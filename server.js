const express = require('express');
const bodyParser = require('body-parser');
const loanRoutes = require('./routes/loanRoutes');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/api/loan', loanRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
