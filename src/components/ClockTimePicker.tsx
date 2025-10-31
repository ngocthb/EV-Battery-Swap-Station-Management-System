"use client";

import React from "react";

interface Props {
  value: string; // HH:MM:SS
  onChange: (time: string) => void;
  onClose?: () => void;
}

// Very small hour:minute picker
const pad = (n: number) => n.toString().padStart(2, "0");

const ClockTimePicker: React.FC<Props> = ({ value, onChange, onClose }) => {
  const [phase, setPhase] = React.useState<"hour" | "minute">("hour");
  const [hour, setHour] = React.useState<number>(() => {
    const parts = value.split(":");
    return Number(parts[0] ?? 0);
  });
  const [minute, setMinute] = React.useState<number>(() => {
    const parts = value.split(":");
    return Number(parts[1] ?? 0);
  });

  React.useEffect(() => {
    const parts = value.split(":");
    setHour(Number(parts[0] ?? 0));
    setMinute(Number(parts[1] ?? 0));
  }, [value]);

  const selectHour = (h: number) => {
    setHour(h);
    setPhase("minute");
  };

  const selectMinute = (m: number) => {
    setMinute(m);
    const t = `${pad(hour)}:${pad(m)}:00`;
    onChange(t);
    if (onClose) onClose();
  };

  // generate 24 hours in 6x4 grid
  const hours = Array.from({ length: 24 }, (_, i) => i);
  // minutes in steps of 5
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <div className="w-64 bg-white border rounded-lg shadow-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-medium">Chọn giờ</div>
        <button
          onClick={() => onClose && onClose()}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close picker"
        >
          ✕
        </button>
      </div>

      <div className="flex items-baseline justify-center space-x-2 mb-3">
        <div
          className={`text-2xl cursor-pointer ${
            phase === "hour" ? "text-blue-600" : "text-gray-600"
          }`}
          onClick={() => setPhase("hour")}
        >
          {pad(hour)}
        </div>
        <div className="text-2xl">:</div>
        <div
          className={`text-2xl cursor-pointer ${
            phase === "minute" ? "text-blue-600" : "text-gray-600"
          }`}
          onClick={() => setPhase("minute")}
        >
          {pad(minute)}
        </div>
      </div>

      {phase === "hour" ? (
        <div className="grid grid-cols-6 gap-2">
          {hours.map((h) => (
            <button
              key={h}
              onClick={() => selectHour(h)}
              className={`py-2 rounded ${
                h === hour ? "bg-blue-600 text-white" : "hover:bg-gray-100"
              }`}
            >
              {pad(h)}
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-2">
          {minutes.map((m) => (
            <button
              key={m}
              onClick={() => selectMinute(m)}
              className={`py-2 rounded ${
                m === minute ? "bg-blue-600 text-white" : "hover:bg-gray-100"
              }`}
            >
              {pad(m)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClockTimePicker;
