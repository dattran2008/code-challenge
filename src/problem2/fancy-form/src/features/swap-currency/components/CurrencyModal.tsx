import React, { useState } from "react";
import BaseIcon from "@/components/BaseIcon";
import type { TokenSelectModalProps } from "@/models/CmpProps";

const TokenSelectModal: React.FC<TokenSelectModalProps> = ({
  tokens,
  selectedToken,
  isOpen,
  onSelect,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = tokens.filter((token) =>
    token.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="absolute inset-0" onClick={onClose}></div>
          <div className="relative w-full max-w-md bg-[#1e2329] rounded-2xl border border-[#2b3139] flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-5 pb-4">
              <h2 className="text-white text-xl font-semibold">
                Select Currency
              </h2>
              <button
                onClick={onClose}
                className="text-[#848e9c] hover:text-white transition-colors"
              >
                <BaseIcon category="utils" iconName="close" />
              </button>
            </div>

            <div className="px-5 pb-2">
              <div className="relative flex items-center bg-[#181a20] rounded-xl border border-[#2b3139] px-3 py-2 focus-within:border-[#fcd535] transition-colors">
                <BaseIcon category="utils" iconName="search" size="sm" />
                <input
                  type="text"
                  placeholder="Search token name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-white w-full placeholder-[#848e9c] ml-1"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
              {filteredTokens.length > 0 ? (
                filteredTokens.map((token) => (
                  <button
                    key={token}
                    onClick={() => {
                      onSelect(token);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${selectedToken === token ? "bg-[#2b3139]" : "hover:bg-[#2b3139]"}`}
                  >
                    <div className="flex items-center gap-3">
                      <BaseIcon category="tokens" iconName={token} />
                      <span className="text-white font-medium text-base">
                        {token}
                      </span>
                    </div>
                    {selectedToken === token && (
                      <BaseIcon
                        category="utils"
                        iconName="selected"
                        size="sm"
                      />
                    )}
                  </button>
                ))
              ) : (
                <div className="text-center text-[#848e9c] py-10">
                  No tokens found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TokenSelectModal;
