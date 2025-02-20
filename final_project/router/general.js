const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  if (!req.body.username) {
    return res.status(500).json({ message: 'Please provide a username!' });
  }

  if (!req.body.password) {
    return res.status(500).json({ message: 'Please provide a password!' });
  }

  const { username, password } = req.body;

  if (!isValid(username)) {
    return res.status(500).json({ message: 'Username already exists!' });
  }

  users.push({
    username,
    password,
  });

  return res.status(201).json({ message: 'Successfully registered!' });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  return res.status(200).json(await books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  return res.status(200).json(await books[req.params.isbn]);
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const authorRegex = new RegExp(req.params.author, 'i');
  const booksByAuthor = Object.values(await books).filter((book) => authorRegex.test(book.author));
  return res.status(200).json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const titleRegex = new RegExp(req.params.title, 'i');
  const booksByTitle = Object.values(await books).filter((book) => titleRegex.test(book.title));
  return res.status(200).json(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  return res.status(200).json(await books[req.params.isbn].reviews);
});

module.exports.general = public_users;
