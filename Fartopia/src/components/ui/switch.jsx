import React from "react";

export function Switch({ checked = false, onCheckedChange }) {
  return (
    <button
      onClick={() => onCheckedChange && onCheckedChange(!checked)}
      style={{
        width: "50px",
        height: "26px",
        borderRadius: "13px",
        border: "none",
        cursor: "pointer",
        backgroundColor: checked ? "#22c55e" : "#ccc",
        position: "relative",
        transition: "background-color 0.2s"
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "3px",
          left: checked ? "26px" : "3px",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "white",
          transition: "left 0.2s"
        }}
      />
    </button>
  );
}
