const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  return !users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  return users.some((user) => user.username === username && user.password === password);
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  if (!authenticatedUser(req.body.username, req.body.password)) {
    return res.status(500).json({ message: 'User credentials are wrong!' });
  }

  const token = jwt.sign({ userId: req.body.username }, 'fingerprint_customer', {
    expiresIn: '1h',
  });

  return res.status(200).json({ token });
});

// Add a book review
regd_users.put('/auth/review/:isbn', async (req, res) => {
  (await books)[req.params.isbn].reviews[req.userId] = req.body.review;
  return res.status(200).json({ message: 'Review was added!' });
});

// Delete a book review
regd_users.delete('/auth/review/:isbn', async (req, res) => {
  delete (await books)[req.params.isbn].reviews[req.userId];
  return res.status(200).json({ message: 'Review was deleted!' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
