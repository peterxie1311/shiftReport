import React, { useState } from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

const BoxTooltiptime = () => {
  const [time, setTime] = useState<string>("10:00");

  const handleTimeChange = (newTime: string | null) => {
    if (newTime) {
      setTime(newTime);
    }
  };

  return (
    <div>
      <input aria-label="Time" type="time" />
    </div>
  );
};

export default BoxTooltiptime;
