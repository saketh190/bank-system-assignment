# Bank Loan System API

## 📌 Features Implemented
- **LEND**: Issue a loan to a customer
- **PAYMENT**: Accept EMI or Lump sum payment
- **LEDGER**: View balance & EMI info for a loan
- **ACCOUNT OVERVIEW**: List all loans for a customer

## 📊 Tech Stack
- Node.js
- Express.js
- JSON File-Based Storage (`data/db.json`)

---

## 📂 Prerequisites

- Make sure **Node.js** is installed
- Run `npm install` to install dependencies
- Ensure `data/db.json` exists and is initialized with:

```json
{
  "loans": []
}
```
## ▶️ How to Run

```bash
npm start
