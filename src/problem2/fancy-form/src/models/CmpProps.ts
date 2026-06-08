export interface BaseIconProps {
  iconName: string;
  iconFormat?: "svg" | "png" | "jpg";
  size?: "xs" | "sm" | "md" | "lg";
  animation?: "spin" | "pulse" | "bounce";
  category: string;
}

export interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: string[];
  onSelect: (token: string) => void;
  selectedToken: string;
}

export interface SwapData {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
}

export interface SwapFormProps {
  balances: Record<string, number>;
  isSubmitting: boolean;
  isSuccess: boolean;
  swapSummary: SwapData;
  onConfirmSwap: (data: SwapData) => Promise<void>;
  onReset: () => void;
}
