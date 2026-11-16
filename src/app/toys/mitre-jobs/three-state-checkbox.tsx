"use client";

import { FaCheck, FaTimes } from "react-icons/fa";

// functions like a checkbox with a label, but cycles between three states: null, true, false
// cycles backwards if shift held
// empty when null, red with FaX when false, green with FaCheck when true
// nice rounded corners, flat coloring, white check and x icons

interface ThreeStateCheckboxProps {
	id?: string;
  label?: string;
  value: boolean | null;
  onChange: (value: boolean | null) => void;
  className?: string;
	size?: string;
	iconRatio?: number;
}

export default function ThreeStateCheckbox({
  label,
  value,
  onChange,
  id,
  className = "",
  size = "17px",
  iconRatio = 0.7,
}: ThreeStateCheckboxProps) {
  const cycle = (forward: boolean) => {
    const order: (boolean | null)[] = [null, true, false];
    const index = order.indexOf(value);
    const nextIndex = forward
      ? (index + 1) % order.length
      : (index - 1 + order.length) % order.length;
    onChange(order[nextIndex]);
  };

  const handleClick = (e: React.MouseEvent) => {
    cycle(!e.shiftKey);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      cycle(!e.shiftKey);
    }
  };

  const bgColor =
    value === true
      ? "bg-green-500"
      : value === false
      ? "bg-red-500"
        : "bg-black/20 dark:bg-white/20";

  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={value === null ? "mixed" : value}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`cursor-pointer inline-flex items-center gap-2 select-none focus:outline-none ${className}`}
    >
      <span
        className={`flex items-center justify-center ${bgColor}`}
        style={{ width: size, height: size, borderRadius: `calc(${size} / 6)` }}
      >
        {value === true  && <FaCheck className="text-white" style={{ width: `calc(${size} * ${iconRatio})`, height: `calc(${size} * ${iconRatio})` }} />}
        {value === false && <FaTimes className="text-white" style={{ width: `calc(${size} * ${iconRatio})`, height: `calc(${size} * ${iconRatio})` }} />}
      </span>
      {label && <span>{label}</span>}
    </button>
  );
}
