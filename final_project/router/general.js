const express = require('express');
const axios = require("axios");
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
        res.status(409).send("The username provided already exists!");
      }
    }
    else {
      res.status(400).send("Both username and password are required!");
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

const URL_BASE = "http://localhost:5000"

// Asynchronously get the book list available in the shop
public_users.get(
  '/async',
  function (req, res) {
    axios.get(URL_BASE + "/")
      .then(
        response => {
          res.json({ ...response.data });
        }

      )
      .catch(
        _error => {
          res.status(500).send("There was an error retrieving the books data");
        }
      );
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
      res.status(404).send("Unable to find the book!");
    }
  }
);

// Asynchronously get book details based on ISBN
public_users.get(
  '/async/isbn/:isbn',
  function (req, res) {
    const isbn = req.params.isbn;

    if (isbn) {
      axios.get(URL_BASE + "/isbn/" + isbn)
        .then(
          response => {
            res.json({ ...response.data });
          }
        )
        .catch(
          _error => {
            res.status(500).send("There was an error retrieving the book data");
          }
        );
    }
    else {
      res.status(404).send("Unable to find the book!");
    }
  }
);

// Util function
function _get_book_by_attribute(attribute, value, result) {
  const found_books =
    Object.values(books).filter(
      book => (
        book[attribute] === value
      )
    );

  if (found_books.length > 0) {
    result.length = 0;
    result.push(...found_books);

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
    let found_books = [];

    if (
      author &&
      _get_book_by_attribute("author", author, found_books)
    ) {
      res.json({ books: found_books });
    }
    else {
      res.status(404).send("Unable to find any books matching the author provided!");
    }
  }
);

// Asynchronously get book details based on author
public_users.get(
  '/async/author/:author',
  function (req, res) {
    const author = req.params.author;

    if (author) {
      axios.get(URL_BASE + "/author/" + author)
        .then(
          response => {
            res.json({ ...response.data });
          }
        )
        .catch(
          _error => {
            res.status(500).send("There was an error retrieving the books data");
          }
        );
    }
    else {
      res.status(404).send("Unable to find any books matching the author provided!");
    }
  }
);


// Get all books based on title
public_users.get(
  '/title/:title',
  function (req, res) {
    const title = req.params.title;
    let found_books = [];

    if (
      title &&
      _get_book_by_attribute("title", title, found_books)
    ) {
      res.json({ books: found_books });
    }
    else {
      res.status(404).send("Unable to find any books matching the title provided!");
    }
  }
);

// Asynchronously get all books based on title
public_users.get(
  '/async/title/:title',
  function (req, res) {
    const title = req.params.title;

    if (title) {
      axios.get(URL_BASE + "/title/" + title)
        .then(
          response => {
            res.json({ ...response.data });
          }
        )
        .catch(
          _error => {
            res.status(500).send("There was an error retrieving the books data");
          }
        );
    }
    else {
      res.status(404).send("Unable to find any books matching the title provided!");
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
        // "The book doesn't have any reviews yet"
        res.status(204).send();
      }
      else {
        res.json(reviews);
      }
    }
    else {
      res.status(404).send("Unable to find the book!");
    }
  }
);

module.exports.general = public_users;
