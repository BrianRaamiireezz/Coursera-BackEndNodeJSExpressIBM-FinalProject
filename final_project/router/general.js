const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post(
  "/register",
  (req, res) => {
    const { username, password } = req.body;

    if (
      username &&
      password
    ) {
      if (isValid(username)) {
        users.push(
          {
            username,
            password
          }
        );

        res.send("User successfully registered");
      }
      else {
        res.send("The username provided already exists!");
      }
    }
    else {
      res.send("Both username and password are required!");
    }
  }
);

// Get the book list available in the shop
public_users.get(
  '/',
  function (req, res) {
    res.json({ books });
  }
);

// Get book details based on ISBN
public_users.get(
  '/isbn/:isbn',
  function (req, res) {
    const isbn = req.params.isbn;

    if (
      isbn &&
      Object.keys(books).includes(isbn)
    ) {
      res.json(books[isbn]);
    }
    else {
      res.send("Unable to find the book!");
    }
  }
);

// Util function
function _get_book_by_attribute(attribute, value, result) {
  const found_book =
    Object.values(books).find(
      book => (
        book[attribute] === value
      )
    );

  if (result) {
    Object.keys(found_book).forEach(
      key => {
        result[key] = found_book[key]
      }
    );

    return true;
  }
  else {
    return false;
  }
}

// Get book details based on author
public_users.get(
  '/author/:author',
  function (req, res) {
    const author = req.params.author;
    let found_book = {};

    if (
      author &&
      _get_book_by_attribute("author", author, found_book)
    ) {
      res.json({ book: found_book });
    }
    else {
      res.send("Unable to find the book!");
    }
  }
);

// Get all books based on title
public_users.get(
  '/title/:title',
  function (req, res) {
    const title = req.params.title;
    let found_book = {};

    if (
      title &&
      _get_book_by_attribute("title", title, found_book)
    ) {
      res.json({ book: found_book });
    }
    else {
      res.send("Unable to find the book!");
    }
  }
);

//  Get book review
public_users.get(
  '/review/:isbn',
  function (req, res) {
    const isbn = req.params.isbn;

    if (
      isbn &&
      Object.keys(books).includes(isbn)
    ) {
      const reviews = books[isbn]["reviews"];

      if (
        !reviews ||
        Object.keys(reviews).length === 0
      ) {
        res.send("The book doesn't have any reviews yet");
      }
      else {
        res.json(reviews);
      }
    }
    else {
      res.send("Unable to find the book!");
    }
  }
);

module.exports.general = public_users;
