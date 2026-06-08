import { useState } from "react";

interface SwapData {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
}

export const useSwap = (onSuccess: (data: SwapData) => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [swapSummary, setSwapSummary] = useState<SwapData>({
    fromAmount: "",
    fromToken: "",
    toAmount: "",
    toToken: "",
  });

  const executeSwap = async (data: SwapData) => {
    setIsSubmitting(true);
    // Simulate call api
    await new Promise((resolve) => setTimeout(resolve, 2000));

    onSuccess(data);
    setSwapSummary(data);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const resetTarget = () => {
    setIsSuccess(false);
  };

  return {
    isSubmitting,
    isSuccess,
    swapSummary,
    executeSwap,
    resetTarget,
  };
};
