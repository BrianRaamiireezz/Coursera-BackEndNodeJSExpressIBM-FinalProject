const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

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
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
