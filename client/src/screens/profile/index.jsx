import { Calendar, CircleUserRound, Mail, ShieldCheck } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import {
  useTwoFactorAuthMutation,
  useVerifyTwoFactorAuthMutation,
} from "../../redux/apis/authApi";
import { startRegistration } from "@simplewebauthn/browser";
import { toast } from "react-toastify";

const Profile = () => {
  const { userData } = useSelector((state) => state.auth);
  return (
    <div className="flex justify-center items-center  h-[90vh] ">
      <div className="flex flex-col gap-4 items-center justify-center pt-6 rounded-2xl  border-2 ">
        {/* Avatar */}
        <div className="avatar z-10">
          <div className="w-40 rounded-full ring ring-sky-700">
            <img
              src={userData?.avatar?.url + "?" + Math.random()}
              alt="avatar"
            />
          </div>
        </div>
        {/* Stats: */}
        <Stats userData={userData} />
      </div>
    </div>
  );
};

export default Profile;

const Stats = ({ userData, trigger, data }) => {
  const [twoFactorAuth] = useTwoFactorAuthMutation();
  const [verifyAuth] = useVerifyTwoFactorAuthMutation();

  const twoFactorAuthHandler = async () => {
    try {
      const data = await twoFactorAuth();
      const url = new URL(window.location);

      const { challengePayload } = data?.data;
      console.log(challengePayload);

      const authenticationResult = await startRegistration(challengePayload);
      console.log(authenticationResult);

      const verify = await verifyAuth({ credentials: authenticationResult });
      console.log(verify);
    } catch (error) {
      toast.error("Two factor authentication either failed or rejected");
      console.log(error);
    }
  };
  return (
    <div className="stats shadow stats-vertical ">
      <div className="stat border-t">
        <div className="stat-figure text-sky-400">
          <CircleUserRound className="inline-block w-8 h-8 stroke-current" />
        </div>
        <div className="stat-title">Full Name:</div>
        <div className="font-semibold text-xl lg:text-2xl">
          {userData?.firstName + " " + userData?.lastName}
        </div>
      </div>

      <div className="stat">
        <div className="stat-figure text-sky-400">
          <Mail className="inline-block w-8 h-8 stroke-current" />
        </div>
        <div className="stat-title">Email:</div>
        <div className="font-semibold text-lg lg:text-2xl ">
          {userData?.email}
        </div>
      </div>

      <div className="stat">
        <div className="stat-figure text-sky-400">
          <Calendar className="inline-block w-8 h-8 stroke-current" />
        </div>
        <div className="stat-title">Created At:</div>
        <div className="font-semibold text-xl lg:text-2xl">
          {userData?.createdAt.slice(0, 10)}
        </div>
      </div>
      <div className="stat">
        <button
          className="btn text-sky-500 mb-1"
          onClick={twoFactorAuthHandler}
        >
          <ShieldCheck />
          Two Factor Authentication
        </button>
      </div>
    </div>
  );
};
