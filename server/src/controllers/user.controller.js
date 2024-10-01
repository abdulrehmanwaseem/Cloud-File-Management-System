import catchAsync from "express-async-handler";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { USER_TOKEN, cookieOptions } from "../constants/options.js";
import { registerEmailTemplate } from "../constants/emailTemplates.js";
import { uploadFilesToCloudinary } from "../utils/features.js";
import { emailQueue, EMAIL_QUEUE_NAME } from "../jobs/sendEmailJob.js";
import { generateEmailVerifyUrl } from "../lib/helpers.js";

import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import redisCache from "../config/DB/redis.config.js";

const signUp = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  const file = req.file;
  if (!file) return next(new ApiError("Please Upload Avatar", 400));
  console.log(file);
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (!existingUser.isVerified) {
      return next(
        new ApiError(
          "You have already registered. Please verify your email address, To login",
          400
        )
      );
    } else {
      return next(
        new ApiError(
          "User with this email already exists, Try another email",
          400
        )
      );
    }
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  const result = await uploadFilesToCloudinary([file]);
  const avatar = {
    public_id: result[0].public_id,
    url: result[0].url,
  };

  user.avatar = avatar;
  await user.save();

  const token = user.generateToken();

  const emailVerifyUrl = generateEmailVerifyUrl(
    req,
    `/auth/verify-email?id=${user._id}`
  );

  const payload = [
    {
      toEmail: email,
      subject: `Successfully sign-in for ${email}`,
      body: registerEmailTemplate(emailVerifyUrl),
    },
  ];
  await emailQueue.add(EMAIL_QUEUE_NAME, payload);

  res.status(201).cookie(USER_TOKEN, token, cookieOptions).json({
    status: "success",
    message: "User created successfully",
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email }).select("+password");
  if (!userExists) {
    return next(
      new ApiError("User does not exist. Please sign up first.", 400)
    );
  }

  if (!userExists.isVerified) {
    return next(
      new ApiError("Please verify your email address before logging in.", 400)
    );
  }

  const isValidPassword = await userExists.matchPassword(password);
  if (!isValidPassword) {
    return next(new ApiError("Invalid Credentials, Try again", 400));
  }

  redisCache.del("/api/v1/auth/me", (err) => {
    if (err) throw err;
  });

  const token = userExists.generateToken();

  res.status(200).cookie(USER_TOKEN, token, cookieOptions).json({
    status: "success",
    message: "User Logged in successfully",
  });
});

const verifyEmail = catchAsync(async (req, res, next) => {
  const { id } = req.query;
  const updatedUser = await User.findByIdAndUpdate(
    { _id: id },
    { isVerified: true }
  );
  if (!updatedUser) {
    return next(
      new ApiError("User does not exist. Please sign up first.", 400)
    );
  }

  if (updatedUser.isVerified) {
    return next(new ApiError("User is already verified", 400));
  }

  res.send("User verified successfully, Now you can close this tab");
});

const challengeStore = {};

const twoFactorAuth = catchAsync(async (req, res, next) => {
  const { _id, firstName, lastName } = req.user;

  const challengePayload = await generateRegistrationOptions({
    rpID: "localhost",
    rpName: "File Management System",
    userName: firstName + lastName,
  });
  challengeStore[_id] = challengePayload.challenge;

  return res.json({
    status: "success",
    challengePayload,
    message: "Two Factor Authentication Successfully",
  });
});

const verifyTwoFactorAuth = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { credentials } = req.body;
  const challenge = challengeStore[_id];

  const verifiedChallenge = await verifyRegistrationResponse({
    expectedChallenge: challenge,
    expectedOrigin: "http://localhost:5173",
    expectedRPID: "localhost",
    response: credentials,
  });

  if (!verifiedChallenge.verified) {
    return next(new ApiError("Could not verify", 400));
  }
  console.log(verifiedChallenge.registrationInfo);

  return res.json({
    status: "success",
    verified: true,
    message: "Two Factor Authentication Verified",
  });
});

const getMyProfile = catchAsync(async (req, res, next) => {
  const user = req.user;
  res.json({
    status: "success",
    user,
    message: "Profile Fetch Successfully",
  });
});

const logout = catchAsync(async (req, res, next) => {
  redisCache.del("/api/v1/auth/me", (err) => {
    if (err) throw err;
  });
  res.status(204).clearCookie(USER_TOKEN).json({
    status: "success",
    message: "User Logged out successfully",
  });
});
const deleteUnverifiedUsers = async () => {
  redisCache.del("/api/v1/auth/me", (err) => {
    if (err) throw err;
  });
  const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000); // 15 days ago
  console.log(fifteenDaysAgo);
  await User.deleteMany({
    isVerified: false,
    createdAt: { $lte: fifteenDaysAgo },
  });
};

setInterval(async () => {
  console.log("Deleting unverified users...");
  await deleteUnverifiedUsers();
  console.log("Unverified users deleted.");
}, 24 * 60 * 60 * 1000); // Once every day
// 24 = hours, 60 = minutes, 60 = seconds, 1000 = milliseconds

export {
  signUp,
  login,
  verifyEmail,
  logout,
  getMyProfile,
  twoFactorAuth,
  verifyTwoFactorAuth,
};
