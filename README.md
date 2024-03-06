# Assignment: Building a RESTful API with Node.js and Express

## Summary

This project demonstrates the implementation of a RESTful API using Node.js and Express. The Express server acts as a middle API, handling CRUD requests from the frontend and persisting data obtained from [The Cat API]. The server fetches random cat images from The Cat API, saves the fetched data in JSON files for persistent storage, and defines API endpoints for cat image operations. Additionally, a simple frontend is created to interact with the Express server API, allowing users to view random cats, give the cat a nickname, saving cats to their collection, and delete cat images.

### Table of Contents

---

1. [Development](#development)
2. [Server ENV Variables](#server-environment-variables)
3. [Starting up the App](#starting-up-the-app)
4. [Tech Stack](#tech-stack)
5. [Features](#features)
6. [Testing](#testing)

---

### Development

JTC Cats requires [Node.js](https://nodejs.org/) v16+ to run. Tested on version `v20.11.0`

This App uses [NPM](https://www.npmjs.com/) Node Package Manager to manage its dependencies and packages.

Install the client dependencies by running the following command in the client directory:

```
npm install
```

Install the server dependencies by running the following command in the server directory:

```
npm install
```

### Server environment variables

---

Get a free API key from [The Cat API]. Create a .env file in the server directory and add your API key.

For example:

```
CAT_API_KEY=YOUR_API_KEY
```

### Starting up the App

---

The Client and Server both need to be started separately with command:

```
npm start
```

This will start your `client` on `http://127.0.0.1:8080/` and backend in development mode on `http://localhost:3001/`, with the server listening on `PORT` 3001.

## Features

- View a random cat breed.
- Add a cat to your collection.
- Edit a cat's nickname.
- Delete a cat from your collection.
- Persistent storage to enable faster loading of cat images.

## Tech Stack

### **Front-end**

- [JavaScript] - is a programming language that adds interactivity to your website.

- [HTML] - is the standard markup language for documents designed to be displayed in a web browser.

- [CSS] - is a style sheet language used for describing the presentation of a document written in HTML.

- [http-server] - is a simple, zero-configuration command-line static HTTP server. It is powerful enough for production usage, but it's simple and hackable enough to be used for testing, local development and learning..

- [Jest] - Jest is a delightful JavaScript Testing Framework with a focus on simplicity.

- [jsdom] - is a pure-JavaScript implementation of many web standards, notably the WHATWG DOM and HTML Standards, for use with Node.js. In general, the goal of the project is to emulate enough of a subset of a web browser to be useful for testing.

### **Back-end**

---

- [Node.js] - Cross-platform, open-source server environment that can run on Windows, Linux, Unix, macOS, and more. Node.js is a backend JavaScript runtime environment that runs on the V8 JavaScript Engine and executes JavaScript code outside a web browser.

- [Express] - Express.js, or simply Express, is a backend web application framework for building RESTful APIs with Node.js

- [The Cat API] - The Cat API is a free web service providing random pictures of cats in different categories.

### **Testing**

---

Testing your application is very important to ensure it is running as expected and as a user would interact with it without breaking and encountering bugs. I have set up [Jest] in the client, and there is a `tests` directory in the `client` directory. Simply running `npm test` from the client directory will run all the test files. I have includes some basic tests for the helper functions in the `client/src/client/utils` directory.

[JavaScript]: https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics
[http-server]: https://www.npmjs.com/package/http-server
[Jest]: https://jestjs.io/
[CSS]: https://developer.mozilla.org/en-US/docs/Web/CSS
[HTML]: https://developer.mozilla.org/en-US/docs/Web/HTML
[jsdom]: https://github.com/jsdom/jsdom
[node.js]: http://nodejs.org
[The Cat API]: https://thecatapi.com/
[express]: http://expressjs.com
