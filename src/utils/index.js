
export const formatCurrency = (n, decimal = 2, currency = "$") => {
  if (!isNaN(n)) {
    n = parseFloat(n);
    return currency + " " + n.toFixed(decimal).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  } else {
    return n;
  }
};

export const toDatePicker = date => {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

export const pad2 = number => {
  return (number < 10 ? '0' : '') + number
}

