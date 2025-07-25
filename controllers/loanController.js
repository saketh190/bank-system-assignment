const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../data/db.json');
const { calculateInterest, calculateTotalAmount, calculateEMI } = require('../utils/calculations');

// Load DB
function loadDB() {
  return JSON.parse(fs.readFileSync(dbPath));
}

// Save DB
function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// LEND API
const lendLoan = (req, res) => {
  const { customer_id, loan_amount, loan_period, rate_of_interest } = req.body;

  const interest = calculateInterest(loan_amount, loan_period, rate_of_interest);
  const totalAmount = calculateTotalAmount(loan_amount, interest);
  const emi = calculateEMI(totalAmount, loan_period);

  const loan = {
    loan_id: uuidv4(),
    customer_id,
    principal: loan_amount,
    period: loan_period,
    rate: rate_of_interest,
    total_interest: interest,
    total_amount: totalAmount,
    emi,
    emi_paid: 0,
    lump_sum_paid: 0
  };

  const db = loadDB();
  db.loans.push(loan);
  saveDB(db);

  res.status(201).json({
    message: 'Loan created successfully',
    loan_id: loan.loan_id,
    total_amount: totalAmount,
    monthly_emi: emi
  });
};
const makePayment = (req, res) => {
  const { loan_id, type, amount } = req.body;

  const db = loadDB();
  const loan = db.loans.find(l => l.loan_id === loan_id);

  if (!loan) {
    return res.status(404).json({ message: 'Loan not found' });
  }

  if (type === 'EMI') {
    loan.emi_paid += 1;
  } else if (type === 'LUMP_SUM') {
    loan.lump_sum_paid += amount;
  } else {
    return res.status(400).json({ message: 'Invalid payment type' });
  }

  const totalPaid = (loan.emi_paid * loan.emi) + loan.lump_sum_paid;
  const remainingAmount = loan.total_amount - totalPaid;
  const remainingEMIs = Math.ceil(remainingAmount / loan.emi);

  saveDB(db);

  res.status(200).json({
    message: 'Payment successful',
    loan_id: loan.loan_id,
    total_paid: totalPaid,
    remaining_amount: remainingAmount > 0 ? remainingAmount : 0,
    remaining_emis: remainingAmount > 0 ? remainingEMIs : 0
  });
};
const getLedger = (req, res) => {
  const { loan_id } = req.params;
  const db = loadDB();
  const loan = db.loans.find(l => l.loan_id === loan_id);

  if (!loan) {
    return res.status(404).json({ message: 'Loan not found' });
  }

  const total_paid = (loan.emi_paid * loan.emi) + loan.lump_sum_paid;
  const remaining_amount = loan.total_amount - total_paid;
  const remaining_emis = Math.ceil(remaining_amount / loan.emi);

  res.status(200).json({
    loan_id: loan.loan_id,
    customer_id: loan.customer_id,
    principal: loan.principal,
    interest: loan.total_interest,
    total_amount: loan.total_amount,
    emi_amount: loan.emi,
    total_paid,
    remaining_amount: remaining_amount > 0 ? remaining_amount : 0,
    remaining_emis: remaining_amount > 0 ? remaining_emis : 0
  });
};
const getAccountOverview = (req, res) => {
  const { customer_id } = req.params;
  const db = loadDB();

  const customerLoans = db.loans.filter(l => l.customer_id === customer_id);

  if (customerLoans.length === 0) {
    return res.status(404).json({ message: 'No loans found for this customer' });
  }

  const overview = customerLoans.map(loan => {
    const total_paid = (loan.emi_paid * loan.emi) + loan.lump_sum_paid;
    const remaining_amount = loan.total_amount - total_paid;
    const remaining_emis = Math.ceil(remaining_amount / loan.emi);

    return {
      loan_id: loan.loan_id,
      principal: loan.principal,
      interest: loan.total_interest,
      total_amount: loan.total_amount,
      emi_amount: loan.emi,
      total_paid,
      remaining_amount: remaining_amount > 0 ? remaining_amount : 0,
      remaining_emis: remaining_amount > 0 ? remaining_emis : 0
    };
  });

  res.status(200).json({ customer_id, loans: overview });
};




module.exports = {
  lendLoan,
  makePayment,
  getLedger,
  getAccountOverview
};



