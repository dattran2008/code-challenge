import { useState } from "react";
import { useSwap } from "@/features/swap-currency/hooks/useSwap";
import SwapForm from "@/features/swap-currency/components/SwapForm";

const SwapPage = () => {
  const [balances, setBalances] = useState<Record<string, number>>({
    ETH: 2.5,
    USDC: 1000,
    BTC: 0.05,
  });

  const { isSubmitting, isSuccess, swapSummary, executeSwap, resetTarget } =
    useSwap((data) => {
      const amountIn = parseFloat(data.fromAmount);
      const amountOut = parseFloat(data.toAmount);

      setBalances((prev) => ({
        ...prev,
        [data.fromToken]: (prev[data.fromToken] || 0) - amountIn,
        [data.toToken]: (prev[data.toToken] || 0) + amountOut,
      }));
    });

  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh]">
      <h1 className="text-3xl font-semibold mb-6">Currency Swap</h1>
      <SwapForm
        balances={balances}
        swapSummary={swapSummary}
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
        onConfirmSwap={executeSwap}
        onReset={resetTarget}
      />
    </div>
  );
};

export default SwapPage;
