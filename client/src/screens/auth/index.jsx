import React, { useState } from "react";
import AuthInput from "../../components/AuthInput";
import { useForm } from "react-hook-form";
import bannerImage from "../../../public/assets/authBanner.jpeg";
import avatarImage from "../../../public/assets/avatar.jpg";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../../redux/slice/auth";
import { useLoginMutation, useSignupMutation } from "../../redux/apis/authApi";
import { Camera } from "lucide-react";
import { toast } from "react-toastify";

const Authentication = () => {
  const [switchPages, setSwitchPages] = useState("Signup");
  const dispatch = useDispatch();

  return (
    <div className="w-screen h-screen overflow-x-hidden ">
      {switchPages === "Signup" ? (
        <Signup setSwitchPages={setSwitchPages} dispatch={dispatch} />
      ) : (
        <Login setSwitchPages={setSwitchPages} dispatch={dispatch} />
      )}
    </div>
  );
};

const Signup = ({ setSwitchPages }) => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  const registerSchema = yup.object({
    firstName: yup.string().max(9).required("First name is required"),
    lastName: yup.string().max(15).required("Last name is required"),
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: yup.string().min(4).max(20).required("Password is required"),
    passwordConfirmation: yup
      .string()
      .label("confirm password")
      .required()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
    file: yup
      .mixed()
      .test("required", "Avatar is required", (file) => {
        if (file.length) return true;
        return false;
      })
      .test(
        "is-valid-size",
        "Max allowed size is 10MB",
        (value) => value && value[0]?.size <= MAX_FILE_SIZE
      ),
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const previewImage = watch("file");

  const [signUpUser] = useSignupMutation();

  const signupHandler = async (formData) => {
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "file") {
        data.append(key, value[0]);
      } else {
        data.append(key, value);
      }
    });

    try {
      await signUpUser(data).unwrap();
      toast.info(
        "A verification email has been sent to your email address. Please check your inbox to complete the registration process.",
        {
          theme: "dark",
          position: "bottom-center",
          className: "toast-message",
        }
      );
      setSwitchPages("login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="bg-gray-50">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-28 lg:order-first lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="banner"
            src={bannerImage}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-6 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Welcome to File Management System{" "}
              <span className="lg:hidden">🦑</span>
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500">
              "Experience the convenience of effortlessly managing your files in
              the cloud. At anytime"{" "}
              <span className="hidden lg:inline text-lg">🦑</span>
            </p>

            <form
              action="#"
              className="mt-4 grid grid-cols-6 gap-6"
              onSubmit={handleSubmit(signupHandler)}
            >
              <div className="col-span-6 flex flex-col items-center gap-4 -my-1">
                <div className="avatar w-32 h-32 ring ring-gray-400 ring-offset-2 rounded-full">
                  <img
                    src={
                      !previewImage?.length
                        ? avatarImage
                        : URL.createObjectURL(previewImage[0])
                    }
                    className="rounded-full"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="avatarInput"
                    name="file"
                    {...register("file")}
                  />
                  <label
                    htmlFor="avatarInput"
                    className="btn btn-circle btn-sm absolute -bottom-0 right-1"
                  >
                    <Camera />
                  </label>
                </div>
                {errors.file && (
                  <span className="text-red-400 font-semibold">
                    {errors.file?.message}
                  </span>
                )}
              </div>
              <AuthInput
                labelFor="First name"
                label="First Name"
                register={{
                  ...register("firstName"),
                }}
                error={errors.firstName?.message}
              />
              <AuthInput
                labelFor="Last name"
                label="Last Name"
                register={{
                  ...register("lastName"),
                }}
                error={errors.lastName?.message}
              />
              <AuthInput
                labelFor="Email"
                label="Email"
                type="email"
                register={{
                  ...register("email"),
                }}
                error={errors.email?.message}
                className="col-span-6"
              />
              <AuthInput
                labelFor="Password"
                type="password"
                label="Password"
                register={{
                  ...register("password"),
                }}
                error={errors.password?.message}
              />
              <AuthInput
                labelFor="Password Confirmation"
                label="Password Confirmation"
                type="password"
                register={{
                  ...register("passwordConfirmation"),
                }}
                error={errors.passwordConfirmation?.message}
              />
              {/* <ReactProfile src={bannerImage} />; */}
              <div className="col-span-6">
                <label htmlFor="MarketingAccept" className="flex gap-4">
                  <input
                    type="checkbox"
                    id="MarketingAccept"
                    className="size-5 rounded-md border-gray-200 bg-white shadow-sm"
                  />

                  <span className="text-sm text-gray-700">
                    I want to receive emails about events, product updates and
                    company announcements.
                  </span>
                </label>
              </div>
              <div className="col-span-6">
                <p className="text-sm text-gray-500">
                  By creating an account, you agree to our{" "}
                  <span className="text-gray-700 underline">
                    terms and conditions
                  </span>{" "}
                  and{" "}
                  <span className="text-gray-700 underline">
                    privacy policy
                  </span>
                  .
                </p>
              </div>
              <div className="col-span-6  flex  items-center gap-1  flex-col lg:flex-row ">
                <button
                  type="submit"
                  className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                >
                  Create an account
                </button>

                <p className="mt-4 text-sm text-gray-500 sm:mt-0 lg:ml-3">
                  Already have an account?{" "}
                  <span
                    className="text-gray-700 underline font-semibold cursor-pointer"
                    onClick={() => setSwitchPages("Login")}
                  >
                    Login
                  </span>
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

const Login = ({ setSwitchPages, dispatch }) => {
  const loginSchema = yup.object({
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const [loginUser] = useLoginMutation();

  const loginHandler = async (formData) => {
    try {
      await loginUser(formData).unwrap();
      dispatch(setAuthenticated({ isAuthenticated: true }));
      toast.success("User Logged in successfully");
      setSwitchPages("login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="bg-gray-50 h-full">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-28 lg:order-first lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="banner"
            src={bannerImage}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-6 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Welcome Back to File Management System{" "}
              <span className="lg:hidden">🦑</span>
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500">
              "Hope you enjoy our services and Empowering Your Files Experience"{" "}
              <span className="hidden lg:inline text-lg">🦑</span>
            </p>

            <form
              action="#"
              className="mt-8 grid grid-cols-6 gap-6"
              onSubmit={handleSubmit(loginHandler)}
            >
              <AuthInput
                labelFor="Email"
                label="Email"
                register={{
                  ...register("email"),
                }}
                error={errors.email?.message}
                className="col-span-6"
              />
              <AuthInput
                labelFor="Password"
                label="Password"
                className="col-span-6"
                register={{
                  ...register("password"),
                }}
                error={errors.password?.message}
              />

              <div className="col-span-6  flex  items-center gap-1  flex-col lg:flex-row ">
                <button className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500">
                  Login
                </button>

                <p className="mt-4 text-sm text-gray-500 sm:mt-0 lg:ml-3">
                  Don't have an account?{" "}
                  <span
                    className="text-gray-700 underline font-semibold cursor-pointer"
                    onClick={() => setSwitchPages("Signup")}
                  >
                    Sign up
                  </span>{" "}
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Authentication;
