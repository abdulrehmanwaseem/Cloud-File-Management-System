import React from "react";

const AuthInput = ({
  labelFor = "name",
  label = "name",
  type = "text",
  error = null,
  register,
  className = "col-span-6 sm:col-span-3",
}) => {
  return (
    <div className={className}>
      <label
        htmlFor={labelFor}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        type={type}
        placeholder="Type here..."
        className={`mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm ${
          error && "border-red-400"
        }`}
        {...register}
      />
      <span className="text-red-400 font-semibold">{error}</span>
    </div>
  );
};

export default AuthInput;
