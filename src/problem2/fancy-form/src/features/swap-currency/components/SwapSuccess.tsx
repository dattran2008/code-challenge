import React from "react";
import type { SwapData } from "@/models/CmpProps";

interface SwapSuccessProps {
  summary: SwapData;
  onReset: () => void;
}

export const SwapSuccess: React.FC<SwapSuccessProps> = ({
  summary,
  onReset,
}) => {
  return (
    <div className="w-full max-w-[480px] bg-[#181a20] rounded-3xl p-8 text-center text-white mx-auto border border-[#2b3139] flex flex-col items-center shadow-2xl">
      <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 border border-green-500/30">
        <svg
          className="w-8 h-8 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>

      <h2 className="text-xl font-bold mb-2">Swap Success!</h2>
      <p className="text-[#848e9c] text-sm mb-6 leading-relaxed">
        You have successfully converted <br />
        <span className="text-white font-semibold">
          {summary.fromAmount} {summary.fromToken}
        </span>{" "}
        to{" "}
        <span className="text-white font-semibold">
          {summary.toAmount} {summary.toToken}
        </span>
      </p>

      <button
        onClick={onReset}
        className="w-full bg-[#2b3139] hover:bg-[#323943] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
      >
        Back to Swap
      </button>
    </div>
  );
};

export default SwapSuccess;
