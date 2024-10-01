import { Home, LogOut, Menu, Moon, SunMedium, User } from "lucide-react";
import React, { Suspense, useLayoutEffect, useState } from "react";
import ToolTip from "../components/ToolTip";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLazyLogoutQuery } from "../redux/apis/authApi";
import { setUnAuthenticated } from "../redux/slice/auth";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const AppLayout = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useLayoutEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="w-screen h-screen overflow-hidden" data-theme={theme}>
      <div className="w-full shadow-md shadow-sky-400 sticky z-50">
        <Navbar />
      </div>
      <div className="w-full h-[90%] overflow-x-auto customized-scrollbar">
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </div>
      <ToggleTheme setTheme={setTheme} />
    </div>
  );
};

const Navbar = () => {
  const { userData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [trigger] = useLazyLogoutQuery();

  const logoutHandler = async () => {
    try {
      await trigger(1);
      dispatch(setUnAuthenticated());
      navigate("/");
      toast.success("User logged out successfully");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle " />
      <div className="drawer-content flex  justify-between py-3 px-3 lg:px-7">
        <div className="flex items-center gap-2">
          <label
            htmlFor="my-drawer"
            className="btn btn-sm h-9 w-9 btn-square drawer-button"
          >
            <Menu />
          </label>
          <h1 className="font-semibold text-sky-400 mb-[2px] lg:text-2xl">
            File Management System
          </h1>
        </div>
        <span className="flex items-center gap-3 lg:gap-5">
          <button
            className="btn btn-info text-slate-200 btn-sm h-10 lg:btn-md"
            onClick={logoutHandler}
          >
            <LogOut />
            <span className="hidden lg:block">Logout</span>
          </button>
          <Link to={"/profile"} className="avatar cursor-pointer relative">
            <div className="w-11 rounded-full overflow-hidden lg:w-12 ring ring-sky-700">
              <img
                src={userData?.avatar?.url + "?" + Date.now()}
                alt="avatar"
                className="w-full h-full transition-opacity duration-300 hover:opacity-75 "
              />
              <ToolTip
                title={userData?.firstName}
                position="tooltip-bottom"
                extraClass="absolute inset-0 bg-gray-400 opacity-0 hover:opacity-75 transition-opacity duration-300 rounded-full"
              ></ToolTip>
            </div>
          </Link>
        </span>
      </div>
      <div className="drawer-side ">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay "
        ></label>
        <Links logoutHandler={logoutHandler} />
      </div>
    </div>
  );
};

const Links = ({ logoutHandler }) => {
  const lists = [
    {
      title: "Home",
      link: "/",
      icon: <Home size={22} />,
    },
    {
      title: "Profile",
      link: "/profile",
      icon: <User size={22} />,
    },
    {
      noRoute: true,
      title: "Logout",
      handler: logoutHandler,
      icon: <LogOut size={22} />,
    },
  ];
  return (
    <ul className="menu py-5 w-64 min-h-full  bg-base-200 text-base-content shadow-md shadow-sky-400">
      <span className="flex mb-2 ml-4">🔴🟡🟢</span>
      {lists.map((val, index) =>
        !val.noRoute ? (
          <NavLink to={val.link} key={index}>
            <li className="flex items-center">
              <span className="font-semibold  text-lg w-full ">
                {val.icon} {val.title}
              </span>
            </li>
          </NavLink>
        ) : (
          <li
            key={index}
            onClick={val.handler}
            className="flex flex-row items-center"
          >
            <span className="font-semibold text-lg w-full">
              {val.icon} {val.title}
            </span>
          </li>
        )
      )}
    </ul>
  );
};

const ToggleTheme = ({ setTheme }) => {
  return (
    <div className="fixed bottom-2 lg:bottom-3 right-3 lg:right-4">
      <ToolTip title="Toggle Theme" position="tooltip-left">
        <label className="swap swap-rotate bg-slate-300 rounded-xl p-1 text-black">
          <input
            type="checkbox"
            className="theme-controller hidden"
            value="default"
            onChange={() =>
              setTheme((prev) => (prev === "dark" ? "light" : "dark"))
            }
          />
          <svg className="swap-off fill-current w-10 h-10" viewBox="0 0 24 24">
            <SunMedium />
          </svg>
          <svg className="swap-on fill-current w-10 h-10" viewBox="0 0 24 24">
            <Moon />
          </svg>
        </label>
      </ToolTip>
    </div>
  );
};

export default AppLayout;
