import React, { useState, useEffect, useMemo } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BaseIcon from "@/components/BaseIcon";
import TokenSelectModal from "./CurrencyModal";

import type { ApiPrice } from "@/models/Api";
import type { SwapFormProps } from "@/models/CmpProps";
import { createSwapSchema, type SwapFormValues } from "../schemas/swap.schema";
import SwapSuccess from "./SwapSuccess";

export const SwapForm: React.FC<SwapFormProps> = ({
  balances,
  isSubmitting,
  isSuccess,
  swapSummary,
  onConfirmSwap,
  onReset,
}) => {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalTarget, setModalTarget] = useState<"from" | "to" | null>(null);

  const resolver = useMemo(
    () => zodResolver(createSwapSchema(balances)),
    [balances],
  );

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<SwapFormValues>({
    resolver,
    mode: "onChange",
    defaultValues: {
      fromToken: "ETH",
      toToken: "USDC",
      fromAmount: "1",
    },
  });

  const [fromToken, toToken, fromAmount] = useWatch({
    control,
    name: ["fromToken", "toToken", "fromAmount"],
  });

  const { toAmount, fromUsd, toUsd, currentRate } = useMemo(() => {
    if (isLoading || error || !prices[fromToken] || !prices[toToken]) {
      return {
        toAmount: "0",
        fromUsd: "0.00",
        toUsd: "0.00",
        currentRate: "0.00",
      };
    }
    const fromPrice = prices[fromToken];
    const toPrice = prices[toToken];
    const amount = parseFloat(fromAmount) || 0;
    const calculatedToAmount = (amount * fromPrice) / toPrice;

    return {
      toAmount:
        amount > 0 ? calculatedToAmount.toFixed(6).replace(/\.?0+$/, "") : "0",
      fromUsd: (amount * fromPrice).toFixed(2),
      toUsd: (calculatedToAmount * toPrice).toFixed(2),
      currentRate: (fromPrice / toPrice).toLocaleString("en-US", {
        maximumFractionDigits: 4,
      }),
    };
  }, [fromAmount, fromToken, toToken, prices, isLoading, error]);

  const availableBalance = balances[fromToken] || 0;
  const availableTokens = Object.keys(prices);

  /* Handle business function sections */
  const handleSwapDirection = () => {
    setValue("fromToken", toToken);
    setValue("toToken", fromToken);
    setValue("fromAmount", toAmount === "0" ? "" : toAmount, {
      shouldValidate: true,
    });
  };

  const handleClickMax = (e: React.MouseEvent) => {
    e.preventDefault();
    setValue("fromAmount", availableBalance.toString(), {
      shouldValidate: true,
    });
  };

  const handleSelectToken = (token: string) => {
    if (modalTarget === "from")
      setValue("fromToken", token, { shouldValidate: true });
    else if (modalTarget === "to") setValue("toToken", token);
  };

  const onSubmitForm = (data: SwapFormValues) => {
    onConfirmSwap({
      fromToken: data.fromToken,
      toToken: data.toToken,
      fromAmount: data.fromAmount,
      toAmount: toAmount,
    });
  };

  const handleLocalReset = () => {
    reset({
      fromToken: fromToken,
      toToken: toToken,
      fromAmount: "",
    });
    onReset();
  };

  let buttonText = "Confirm Swap";
  const errorMessage = errors.fromAmount?.message;
  if (errorMessage) {
    if (errorMessage === "Enter an amount") {
      buttonText = "Enter an amount";
    } else if (errorMessage === "Minimum swap amount is 0.01") {
      buttonText = "Amount too low";
    } else {
      buttonText = errorMessage;
    }
  }
  const isButtonDisabled = !isValid || isSubmitting;

  const renderFormContent = () => {
    if (isLoading) {
      return (
        <div className="w-full max-w-[480px] bg-[#181a20] rounded-3xl p-10 mx-auto border border-[#2b3139] flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-[#2b3139] border-t-[#fcd535] rounded-full animate-spin"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full max-w-[480px] bg-[#181a20] rounded-3xl p-6 mx-auto border border-red-900 text-center text-red-400">
          {error}
        </div>
      );
    }

    if (isSuccess) {
      return <SwapSuccess summary={swapSummary} onReset={handleLocalReset} />;
    }

    return (
      <form
        className="w-full max-w-[480px] bg-[#181a20] rounded-3xl p-6 text-white font-sans mx-auto border border-[#2b3139] shadow-xl"
        onSubmit={handleSubmit(onSubmitForm)}
      >
        <div className="relative flex flex-col gap-3">
          <div className="bg-[#2b3139] rounded-2xl p-4 hover:ring-1 hover:ring-[#fcd535] transition-all">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-[#848e9c]">From</span>
              <span className="text-sm text-[#848e9c]">
                Available Balance: {availableBalance} {fromToken}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setModalTarget("from")}
                className="flex items-center gap-2 bg-[#181a20] hover:bg-[#1e2329] p-1.5 pr-3 rounded-xl transition-colors border border-transparent hover:border-[#323943]"
              >
                <BaseIcon category="tokens" iconName={fromToken} />
                <span className="font-semibold text-lg">{fromToken}</span>
                <BaseIcon category="utils" iconName="arrow-down" size="xs" />
              </button>
              <div className="flex flex-col items-end flex-1 ml-4">
                <div className="flex w-full justify-end items-center">
                  <Controller
                    name="fromAmount"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <input
                        className={`bg-transparent text-right text-2xl font-semibold outline-none w-full ${
                          errors.fromAmount ? "text-red-500" : "text-[#eaecef]"
                        }`}
                        type="text"
                        placeholder="0"
                        value={value}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || /^\d*\.?\d*$/.test(val))
                            onChange(val);
                        }}
                      />
                    )}
                  />
                  <button
                    className="text-[#fcd535] text-sm font-semibold hover:text-[#fbd129] ml-2"
                    onClick={handleClickMax}
                  >
                    Max
                  </button>
                </div>
                <div className="text-sm text-[#848e9c] mt-1">≈ ${fromUsd}</div>
              </div>
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-1 bg-[#181a20] rounded-xl">
            <button
              type="button"
              onClick={handleSwapDirection}
              className="bg-[#2b3139] hover:bg-[#323943] p-2 rounded-lg transition-colors group"
            >
              <svg
                className="w-5 h-5 text-white group-hover:text-[#fcd535] transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
          </div>

          <div className="bg-[#2b3139] rounded-2xl p-4 hover:ring-1 hover:ring-[#fcd535] transition-all">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-[#848e9c]">To</span>
              <span className="text-sm text-[#848e9c]">
                Available Balance: {balances[toToken] || 0} {toToken}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setModalTarget("to")}
                className="flex items-center gap-2 bg-[#181a20] hover:bg-[#1e2329] p-1.5 pr-3 rounded-xl transition-colors border border-transparent hover:border-[#323943]"
              >
                <BaseIcon category="tokens" iconName={toToken} />
                <span className="font-semibold text-lg">{toToken}</span>
                <BaseIcon category="utils" iconName="arrow-down" size="xs" />
              </button>
              <div className="flex flex-col items-end flex-1 ml-4">
                <div className="text-right text-2xl font-semibold text-[#eaecef] truncate w-full">
                  {toAmount}
                </div>
                <span className="text-sm text-[#848e9c] mt-1">≈ ${toUsd}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center my-6 px-1">
          <span className="text-sm text-[#848e9c]">Rate</span>
          <span className="text-sm text-[#eaecef] font-medium">
            1 {fromToken} ≈ {currentRate} {toToken}
          </span>
        </div>
        <button
          type="submit"
          disabled={isButtonDisabled}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2 ${
            isButtonDisabled
              ? "bg-[#2b3139] text-[#848e9c] cursor-not-allowed"
              : "bg-[#fcd535] hover:bg-[#fbd129] text-black"
          }`}
        >
          {isSubmitting ? (
            <>
              <BaseIcon category="utils" iconName="spinner" animation="spin" />
              Swapping...
            </>
          ) : (
            buttonText
          )}
        </button>
      </form>
    );
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://interview.switcheo.com/prices.json",
        );
        if (!response.ok) {
          throw new Error("Network error");
        }
        const data: ApiPrice[] = await response.json();
        const priceMap = data.reduce((acc: Record<string, number>, item) => {
          if (item.price > 0) {
            acc[item.currency] = item.price;
          }
          return acc;
        }, {});

        setPrices(priceMap);
      } catch (err) {
        setError("Failed to load live prices.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrices();
  }, []);

  return (
    <>
      {renderFormContent()}

      <TokenSelectModal
        isOpen={modalTarget !== null}
        onClose={() => setModalTarget(null)}
        tokens={availableTokens}
        onSelect={handleSelectToken}
        selectedToken={modalTarget === "from" ? fromToken : toToken}
      />
    </>
  );
};

export default SwapForm;
