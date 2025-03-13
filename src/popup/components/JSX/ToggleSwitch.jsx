import React, { useEffect, useState } from "react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const ToggleSwitch = ({ name, localStorageName, state, setState }) => {
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    chrome.storage.local.get(["speed"], function (result) {
      setSpeed(result.speed || 4);
    });
    onLoad();
  }, []);

  const onLoad = async () => {
    const state = (await chrome.storage.local.get(localStorageName))[
      localStorageName
    ];
    if (state === undefined) {
      await chrome.storage.local.set({ [localStorageName]: true });
      setState(true);
    } else {
      setState(state);
    }
  };

  const handleCheckbox = async (e) => {
    chrome.storage.local.set({ [localStorageName]: e.target.checked });
    setState(e.target.checked);
  };

  const handleSpeedUp = () => {
    const newSpeed = speed >= 4 ? 1 : speed + 1;
    setSpeed(newSpeed);
    chrome.storage.local.set({ speed: newSpeed });
  };

  const handleSpeedDown = () => {
    const newSpeed = speed <= 1 ? 4 : speed - 1;
    setSpeed(newSpeed);
    chrome.storage.local.set({ speed: newSpeed });
  };

  return (
    <div className="relative">
      <div className="button-container flex justify-between items-center mt-2 h-12 w-full relative ">
        <div className="flex items-center">
          <h3 className="text-sm text-[#e7e7e7] font-bold mr-2">{name}</h3>
          {name === "Speed Up Ad" && (
            <div className="text-gray-300 flex flex-col pointer opacity-50 hover:opacity-100 duration-200">
              <span className="cursor-pointer -mb-1 " onClick={handleSpeedUp}>
                <ArrowDropUpIcon />
              </span>
              <p
                className={`text-gray-300 text-sm  transition duration-200 rounded-sm border-gray-300 px-1 cursor-not-allowed`}
              >
                {speed}x
              </p>
              <span className="cursor-pointer -mb-1" onClick={handleSpeedDown}>
                <ArrowDropDownIcon />
              </span>
            </div>
          )}
        </div>
        <div className="relative w-16 h-8  ">
          <input
            type="checkbox"
            className="absolute h-full w-full cursor-pointer"
            checked={state}
            onChange={(e) => handleCheckbox(e)}
          />
          <span
            className={`pointer-events-none slider block w-full h-full ${state ? "bg-red-500" : "bg-gray-400"} transition duration-200 rounded-full relative`}
          >
            <span
              className={`absolute left-1 bottom-1 bg-white w-6 h-6 rounded-full transition duration-200 transform ${
                state ? "translate-x-8" : ""
              }`}
            ></span>
            <p
              className={`absolute text-xs font-bold right-2.5 top-1.5 text-white transition duration-200 ${state ? "translate-x-8 " : ""}`}
            >
              OFF
            </p>
            {/* this is here for cosmetics makes it so that it looks like "OFF" is sliding behind the background */}
            <div className="absolute w-12 h-12 -right-12 -bottom-2 bg-[#272625] "></div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ToggleSwitch;
