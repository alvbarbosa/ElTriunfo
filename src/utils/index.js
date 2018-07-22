
export const formatCurrency = (n, decimal = 2, currency = "$") => {
  if (!isNaN(n)) {
    n = parseFloat(n);
    return currency + " " + n.toFixed(decimal).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  } else {
    return n;
  }
};

