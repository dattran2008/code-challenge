const sum_to_n_a = (n) => {
  if (isNaN(n)) {
    return;
  }

  const list = Array.from({ length: n }, (_, i) => i + 1);
  return list.reduce((acc, currentVal) => acc + currentVal, 0);
};

const sum_to_n_b = (n) => {
  if (isNaN(n)) {
    return;
  }

  return (n * (n + 1)) / 2;
};

const sum_to_n_c = (n) => {
  if (isNaN(n)) {
    return;
  }

  if (n === 1) {
    return 1;
  }
  return n + sum_to_n_c(n - 1);
};

const inputArg = process.argv[2];
const inputNumber = parseInt(inputArg, 10);

if (!isNaN(inputNumber)) {
  console.log(`Test with input = ${inputNumber}:`, sum_to_n_c(inputNumber));
} else {
  console.log("Number is invalid");
}
