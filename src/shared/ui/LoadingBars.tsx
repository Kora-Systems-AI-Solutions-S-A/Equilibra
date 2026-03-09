import React from "react";

type LoadingBarsProps = {
  label?: string;
  fullScreen?: boolean;
};

const bars = [44, 72, 96, 128, 96, 72, 44];

export function LoadingBars({
  label = "A carregar...",
  fullScreen = false,
}: LoadingBarsProps) {
  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-[9999] flex items-center justify-center bg-[#060908]/92 backdrop-blur-sm"
          : "flex items-center justify-center"
      }
    >
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-end gap-3">
          {bars.map((height, index) => (
            <div
              key={index}
              className="loading-bar w-4 rounded-full bg-emerald-500"
              style={{
                height: `${height}px`,
                animationDelay: `${index * 120}ms`,
              }}
            />
          ))}
        </div>

        <p className="text-sm tracking-wider text-slate-300">
          {label}
        </p>
      </div>
    </div>
  );
}
