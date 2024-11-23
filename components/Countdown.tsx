"use client";
import { Clock5, Hourglass, Timer } from "lucide-react";
import { useEffect, useState } from "react";

type CountdownTimerProps = {
  targetDate: string;
};

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft() {
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
  }

  function formatTime(value: number) {
    return value.toString().padStart(2, "0");
  }

  return (
    <div className="flex center w-full">
      <div className="flex items-center justify-start pl-4 ">
        <p className="text-accent text-sm">End in</p>
      </div>
      <div className="flex items-center justify-center gap-4 p-2 text-center flex-grow ">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="flex flex-col items-center">
            <span suppressHydrationWarning className="text-gold">
              {formatTime(value)}
            </span>
            <span className="text-xs text-secondary">{unit}</span>
          </div>
        ))}
      </div>
      <div className="flex-center pr-4 mt-1">
        <Timer className="w-5 h-5 animate-bounce stroke-accent " />
      </div>
    </div>
  );
};

export default CountdownTimer;
