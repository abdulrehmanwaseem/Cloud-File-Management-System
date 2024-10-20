import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { setAuthenticated } from "./redux/slice/auth";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserProfileQuery } from "./redux/apis/authApi";

// Screens Import:
import AppLayout from "./layout/AppLayout";
import Spinner from "./components/Spinner";

const Authentication = lazy(() => import("./screens/auth"));
const ErrorPage = lazy(() => import("./screens/error"));
const Profile = lazy(() => import("./screens/profile"));
const Home = lazy(() => import("./screens/home"));

import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

import { Offline, Online } from "react-detect-offline";
import { WifiOff } from "lucide-react";

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { data, isLoading, isSuccess, isFetching } = useGetUserProfileQuery();

  const isSomeQueryPending = useSelector(
    (state) =>
      Object.values(state.apis.queries).some(
        (query) => query.status === "pending"
      ) ||
      Object.values(state.apis.mutations).some(
        (query) => query.status === "pending"
      )
  );

  useEffect(() => {
    if (isSuccess) {
      dispatch(setAuthenticated({ userData: data?.user }));
    }
  }, [isFetching]);

  if (isLoading || isFetching) {
    return;
  }

  return (
    <>
      {isSomeQueryPending && <Spinner />}
      {!isAuthenticated ? (
        <>
          <Suspense fallback={<Spinner />}>
            <Authentication />
          </Suspense>
        </>
      ) : (
        <BrowserRouter>
          {isSomeQueryPending && <Spinner />}
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
