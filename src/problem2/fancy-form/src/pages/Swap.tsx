import { useState } from "react";
import { useSwap } from "@/features/swap-currency/hooks/useSwap";
import SwapForm from "@/features/swap-currency/components/SwapForm";
import WalletBalances from "@/features/swap-currency/components/WalletBalances";

const SwapPage = () => {
  const [balances, setBalances] = useState<Record<string, number>>({
    ETH: 99.5,
    USDC: 1000,
    WBTC: 1.234,
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
      <div className="w-full max-w-5xl flex flex-col-reverse lg:flex-row items-stretch justify-center">
        {!isSuccess && <div className="hidden lg:block flex-1"></div>}
        <div className="w-full max-w-[480px] shrink-0 z-10 px-4 lg:px-0">
          <SwapForm
            balances={balances}
            swapSummary={swapSummary}
            isSubmitting={isSubmitting}
            isSuccess={isSuccess}
            onConfirmSwap={executeSwap}
            onReset={resetTarget}
          />
        </div>
        {!isSuccess && (
          <div className="w-full lg:flex-1 flex justify-center lg:justify-start mt-8 lg:mt-0 lg:pl-8 px-4 lg:px-0">
            <WalletBalances balances={balances} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapPage;
