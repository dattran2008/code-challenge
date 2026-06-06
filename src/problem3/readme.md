# Messy React Component Note

## 1. Performance

* **Unnecessary dependency in "useMemo":**
The `prices` variable was included in the dependency array of the `sortedBalances` memoization block, even though it wasn't used inside it.
**Fix:** Removed `prices` from the dependency array to prevent unnecessary recalculations (filtering and sorting) whenever cryptocurrency prices change.
* **Function instantiated inside Component:** 
The `getPriority` function does not depend on any component state or props, yet it was defined inside `WalletPage`. This causes the function to be recreated in memory on every re-render.
**Fix:** Moved the `getPriority` function outside the component scope.
* **Redundant array iterations:** The code iterated over the `sortedBalances` array twice: once to create a `formattedBalances` array (which was never even used) and once to render the `rows`.
**Fix:** Merged the formatting (`formatted`) and USD value calculation logic directly into the rendering loop for `rows` to save computational resources.

## 2. Logic Errors & Potential Bugs

* **Undefined variable (reference error):** 
The code used `lhsPriority` in the `filter` block, but this variable was never defined.
**Fix:** Changed it to the previously calculated `balancePriority` variable.
* **Incorrect filter logic:** 
The condition `if (balance.amount <= 0)` incorrectly filters out valid balances and keeps empty or negative wallets.
**Fix:** Changed the condition to `balance.amount > 0` to correctly display funded wallets.
* **Missing default return in `sort`:** 
When two priority values are equal, the function returned nothing (evaluating to `undefined`). This can lead to inconsistent sorting behavior across different browsers.
**Fix:** Added `return 0` as the fallback return value when priorities match.

## 3. TypeScript & React Anti-patterns

**Interface duplication (violating DRY):** 
The `FormattedWalletBalance` interface manually duplicated the `currency` and `amount` properties from `WalletBalance` instead of inheriting them.
**Fix:** Refactored `FormattedWalletBalance` to extend `WalletBalance` (`interface FormattedWalletBalance extends WalletBalance`), which adheres to the DRY principle and makes the type definitions easier to maintain.
* **Missing interface property:** 
The code accesses `balance.blockchain`, but the `WalletBalance` interface lacks this property.
**Fix:** Added `blockchain: string` to the `WalletBalance` interface definition.
* **Bypassing typeScript (`any`):** 
The `getPriority` function accepted `blockchain: any`, losing the benefits of static typing.
**Fix:** Typed the parameter correctly as `string` (or ideally, a Union Type for specific blockchain names).
* **DOM prop leak:**
The component interface extends `BoxProps` (which usually contains UI library props like `sx`, `m`, `p`), but spreads `{...rest}` directly onto a native HTML `<div>`. This causes React to throw console warnings about unrecognized DOM attributes.
**Fix:** Replaced `<div {...rest}>` with a library-specific component like `<Box {...rest}>` if using UI Library like MUI, etc. , **or** changed the Interface to extend `React.HTMLAttributes<HTMLDivElement>` if standard HTML is intended.
* **`key={index}` anti-pattern:** 
Using the array index as a `key` for rendered lists (especially filtered/sorted lists) breaks React's Reconciliation process, leading to incorrect element state or rendering glitches.
**Fix:** Used a unique data identifier instead, such as `key={balance.currency}`.