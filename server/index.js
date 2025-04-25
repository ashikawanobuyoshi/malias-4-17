// server/index.js
const express = require('express');
const bodyParser = require('body-parser');
const sendEmailRoute = require('./send-email');

const app = express();
app.use(bodyParser.json());

app.use('/api/send-email', sendEmailRoute);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
