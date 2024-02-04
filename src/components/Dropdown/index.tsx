"use client";
import React, { useState } from "react";
import ChevronDown from "../../assets/icons/ChevronDown";

interface DropdownProps {
  children: React.ReactNode;
  data: string[];
  opened?: boolean;
  closeOnSelect?: boolean;
  onToggle?: () => void;
  onSelect: (value: string) => void;
}

const Dropdown = ({
  children,
  data,
  opened,
  closeOnSelect = true,
  onToggle,
  onSelect,
}: DropdownProps) => {
  const [internalOpened, setInternalOpened] = useState(opened ?? false);
  const onClick = () => {
    setInternalOpened(!internalOpened);
    onToggle?.();
  };
  return (
    <div className="relative w-fit">
      <div
        className="text-black font-semibold flex items-center gap-1 outline outline-1 bg-white outline-gray-300 justify-center cursor-pointer hover:bg-gray-200 p-2 rounded-md"
        onClick={onClick}
      >
        {children}
        <ChevronDown
          className={` transition-transform w-4 h-min ${
            internalOpened ? "transform rotate-180" : ""
          }`}
        />
      </div>

      {internalOpened && (
        <div
          className="absolute top-14 right-2 border p-px
         bg-white w-40 rounded-md shadow-lg text-black after:absolute after:top-[-6px] after:right-3 after:w-3 after:h-3 after:border-gray-200 after:rotate-45 after:bg-white after:border-t after:border-l after:[clip-path:polygon(0%_0%,_0%_100%,_100%_0%)]"
        >
          {data.map((item, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer first:rounded-t-md last:rounded-b-md"
              onClick={() => {
                onSelect(item);
                closeOnSelect && setInternalOpened(false);
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
