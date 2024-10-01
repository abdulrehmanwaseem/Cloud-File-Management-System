import React from "react";

const Spinner = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[9999]">
      <div className="flex h-screen justify-center items-center">
        <span className="loading loading-spinner bg-sky-400 w-14"></span>
      </div>
    </div>
  );
};
export default Spinner;
