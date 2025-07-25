function calculateInterest(P, N, R) {
  return (P * N * R) / 100;
}

function calculateTotalAmount(P, interest) {
  return P + interest;
}

function calculateEMI(totalAmount, N) {
  return Math.ceil(totalAmount / (N * 12));
}

module.exports = {
  calculateInterest,
  calculateTotalAmount,
  calculateEMI
};
