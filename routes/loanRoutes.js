const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

router.post('/lend', loanController.lendLoan);
router.post('/payment', loanController.makePayment);
router.get('/ledger/:loan_id', loanController.getLedger);
router.get('/account-overview/:customer_id', loanController.getAccountOverview);


module.exports = router;
