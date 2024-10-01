import React from "react";

const ToolTip = ({
  children,
  title = "",
  position = "tooltip-top",
  extraClass,
}) => {
  return (
    <div
      className={`tooltip ${position} w-full font-medium ${extraClass} `}
      data-tip={title}
    >
      {children}
    </div>
  );
};

export default ToolTip;
