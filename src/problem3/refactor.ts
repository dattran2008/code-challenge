/**
 * This is a refactored version, include comment to explain why. There is a note for more detail about what and why
 */

interface WalletBalance {
  currency: string;
  amount: number;
  // Add missing property name "blockchain"
  blockchain: string;
}

// Change to extend to apply DRY principle 
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

/**
 * Change to extend HTMLAttribute to avoid {...rest} causing DOM leak
 */
interface Props extends React.HTMLAttributes<HTMLDivElement> {}


/**
 * Move this function outside of component to avoid re-init whenever re-render
 * Change type "any" -> "string"
 * Gather cases that have same return result
 */
const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Remove "price" from useMemo() dependencies
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // Fix logic to be more readable and valid
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        if (leftPriority > rightPriority) {
          return -1;
        }
        if (rightPriority > leftPriority) {
          return 1;
        }
        return 0; // add return case when priorities are equal
      });
  }, [balances]);

  // Merge format and caculate USD into one iteration
  const rows = sortedBalances.map((balance: WalletBalance) => {
    const usdValue = (prices[balance.currency] || 0) * balance.amount;
    const formattedAmount = balance.amount.toFixed();

    return (
      <WalletRow
        className={classes.row}
        key={balance.currency} // use unique ID instead of index
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={formattedAmount}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};

export default WalletPage;
