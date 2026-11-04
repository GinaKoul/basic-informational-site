const fs = require("node:fs/promises");
const express = require("express");
const app = express();

// Async function that tries to read file and returns a custom error when the procedure fails
const readFile = async (filepath, contentType) => {
  try {
    // Read file using the fs promise based module and return it
    return (await contentType.split("/").shift()) == "image"
      ? fs.readFile(filepath)
      : fs.readFile(filepath, { encoding: "utf8" });
  } catch (err) {
    // Throw an error to inform that attempt to read the file failed
    throw new Error(`Failed to read file ${filepath}. Error message: ${err}`);
  }
};

// Handle GET request to path /
app.get("/{home}", async (req, res) => {
  try {
    let responseData = await readFile("index.html", "text/html");
    res.type("html"); // Change content type to text/html
    res.status(200); // Change status code to 200 (OK)
    res.end(responseData);
  } catch (err) {
    next(err);
  }
});

// Handle GET request to path /about
app.get("/about", async (req, res) => {
  try {
    let responseData = await readFile("about.html", "text/html");
    res.type("html"); // Change content type to text/html
    res.status(200); // Change status code to 200 (OK)
    res.end(responseData);
  } catch (err) {
    next(err);
  }
});

// Handle GET request to path /contact
app.get("/contact", async (req, res) => {
  try {
    let responseData = await readFile("contact-me.html", "text/html");
    res.type("html"); // Change content type to text/html
    res.status(200); // Change status code to 200 (OK)
    res.end(responseData);
  } catch (err) {
    next(err);
  }
});

// Handle GET request to path /styles
app.get("/styles", async (req, res) => {
  try {
    let responseData = await readFile("styles.css", "text/css");
    res.type("css"); // Change content type to text/css
    res.status(200); // Change status code to 200 (OK)
    res.end(responseData);
  } catch (err) {
    next(err);
  }
});

// Handle GET request to path /hero
app.get("/hero", async (req, res) => {
  try {
    let responseData = await readFile("hero-bg.webp", "image/webp");
    res.type("webp"); // Change content type to image/webp
    res.status(200); // Change status code to 200 (OK)
    res.end(responseData);
  } catch (err) {
    next(err);
  }
});

// Handle all GET requests to any other path
app.get("/{*splat}", async (req, res) => {
  try {
    let responseData = await readFile("404.html", "text/html");
    res.type("html"); // Change content type to text/html
    res.status(404); // Change status code to 404 (NOT FOUND)
    res.end(responseData);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack); // Show error related to read file attempt in the console
  res.type("html"); // Change content type to application/json
  res.status(500); // Change status code to 500 (INTERNAL SERVER ERROR)
  res.send("500 INTERNAL SERVER ERROR");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  // This is important!
  // Without this, any startup errors will silently fail
  // instead of giving you a helpful error message.
  if (error) {
    throw error;
  }
  console.log(`My first Express app - listening on port ${PORT}!`);
});
