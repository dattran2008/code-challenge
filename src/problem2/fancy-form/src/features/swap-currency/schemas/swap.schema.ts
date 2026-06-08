import { z } from "zod";

export type SwapFormValues = {
  fromToken: string;
  toToken: string;
  fromAmount: string;
};

export const createSwapSchema = (balances: Record<string, number>) => {
  return z
    .object({
      fromToken: z.string(),
      toToken: z.string(),
      fromAmount: z.string(),
    })
    .superRefine((data, ctx) => {
      const amount = parseFloat(data.fromAmount);
      const balance = balances[data.fromToken] || 0;

      if (!data.fromAmount || isNaN(amount) || amount === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Enter an amount",
          path: ["fromAmount"],
        });
      } else if (amount < 0.01) {
        ctx.addIssue({
          code: "custom",
          message: "Minimum swap amount is 0.01",
          path: ["fromAmount"],
        });
      } else if (amount > balance) {
        ctx.addIssue({
          code: "custom",
          message: `Insufficient ${data.fromToken} balance`,
          path: ["fromAmount"],
        });
      }
    });
};
