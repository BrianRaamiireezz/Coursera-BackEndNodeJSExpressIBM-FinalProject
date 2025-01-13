const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  if (users.find(user => user["username"] === username)) {
    return false;
  }
  else {
    return true;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  const found_user = users.find(
    user => (
      user["username"] === username &&
      user["password"] === password
    )
  );

  if (found_user) {
    return true;
  }
  else {
    return false;
  }
}

//only registered users can login
regd_users.post(
  "/login",
  (req, res) => {
    const { username, password } = req.body;

    if (
      username &&
      password
    ) {
      if (authenticatedUser(username, password)) {

        const accessToken = jwt.sign(
          {
            data: password
          },
          "access",
          {
            expiresIn: 60 * 60
          }
        );

        req.session.authorization = {
          accessToken
        }

        res.send("User successfully logged in");
      }
      else {
        res.send("Either the username or password is incorrect!");
      }
    }
    else {
      res.send("Both username and password are required!");
    }
  }
);

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
