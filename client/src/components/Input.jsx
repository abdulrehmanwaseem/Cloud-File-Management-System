import React from "react";

const Input = ({
  type = "text",
  label,
  register = {},
  error = "",
  defaultValue,
}) => {
  return (
    <label className="form-control flex gap-1 w-full">
      <span className="label-text text-gray-200 ">{label}</span>
      <input
        type={type}
        placeholder="Type here"
        className={`input input-bordered w-full placeholder:italic ${
          error && "border-red-400"
        }  max-w-lg min-w-full`}
        {...register}
        defaultValue={defaultValue}
      />
      <span className="text-red-400 font-semibold">{error}</span>
    </label>
  );
};

export default Input;
