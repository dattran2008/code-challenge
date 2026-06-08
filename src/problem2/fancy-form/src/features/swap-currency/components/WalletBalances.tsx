import React from "react";
import BaseIcon from "@/components/BaseIcon";
import type { WalletBalancesProps } from "@/models/CmpProps";

const WalletBalances: React.FC<WalletBalancesProps> = ({ balances }) => {
  const activeBalances = Object.entries(balances).filter(
    ([_, amount]) => amount > 0,
  );

  return (
    <div className="w-full max-w-[400px] bg-[#181a20] rounded-3xl p-6 text-white font-sans border border-[#2b3139] shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#eaecef]">Your Assets</h2>
        <div className="bg-[#2b3139] text-[#848e9c] text-xs px-3 py-1 rounded-full font-medium">
          {activeBalances.length} Tokens
        </div>
      </div>

      {activeBalances.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-[#848e9c] min-h-[200px]">
          <BaseIcon category="utils" iconName="empty-wallet" size="lg" />
          <p>No assets found</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {activeBalances.map(([token, amount]) => (
            <div
              key={token}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#1e2329] hover:bg-[#2b3139] transition-colors border border-transparent hover:border-[#323943] group cursor-default gap-3"
            >
              <div className="flex items-center gap-3 shrink-0">
                <div className="p-1 bg-[#181a20] rounded-xl shadow-sm shrink-0">
                  <BaseIcon category="tokens" iconName={token} size="sm" />
                </div>
                <span className="font-semibold text-[#eaecef] group-hover:text-[#fcd535] transition-colors truncate max-w-[80px]">
                  {token}
                </span>
              </div>
              <div className="flex-1 min-w-0 text-right pl-2">
                <div
                  className="font-medium text-[#eaecef] truncate"
                  title={amount.toLocaleString("en-US", {
                    maximumFractionDigits: 6,
                  })}
                >
                  {amount.toLocaleString("en-US", { maximumFractionDigits: 6 })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WalletBalances;
