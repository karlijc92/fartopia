import React from "react";

export function Button({
  children,
  onClick,
  style = {},
  className = "",
  disabled = false
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        padding: "10px 18px",
        borderRadius: "10px",
        border: "none",
        backgroundColor: "#6366f1",
        color: "white",
        fontWeight: "bold",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        ...style
      }}
    >
      {children}
    </button>
  );
}
