const http = require("node:http");
const fs = require("node:fs/promises");

// Create a local server to receive data from
const server = http.createServer();

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

/* Function that returns a map containing the status code
  and the filename of the requested html page*/
const getResponseInfo = (pathName) => {
  //Create map to store status code of response and name of file to read
  const map = new Map();

  // Change request status code to 200 (OK)
  map.set("status-code", 200);
  // Set content-type in map to text/html since the returned data are html files
  map.set("content-type", "text/html");

  switch (pathName) {
    case "/":
      // Set file name to read to index.html when the url pathname is /
      map.set("filename", "index.html");
      break;
    case "/about":
      // Set file name to read to about.html when the url pathname is /about
      map.set("filename", "about.html");
      break;
    case "/contact":
      // Set file name to read to contact-me.html when the url pathname is /contact
      map.set("filename", "contact-me.html");
      break;
    case "/styles":
      // Set content-type in map to text/css since the returned data are css files
      map.set("content-type", "text/css");
      // Set file name to read to contact-me.html when the url pathname is /contact
      map.set("filename", "styles.css");
      break;
    case "/hero":
      // Set content-type in map to image/webp since the returned data is an image
      map.set("content-type", "image/webp");
      // Set file name to read to contact-me.html when the url pathname is /contact
      map.set("filename", "hero-bg.webp");
      break;
    default:
      // Change request status code to 404 (NOT FOUND)
      map.set("status-code", 404);
      // Set file name to read to 404.html when the requested page is not found
      map.set("filename", "404.html");
      break;
  }
  return map;
};

/*Async function that handles http request */
const httpGetRequest = async (request, res) => {
  //Variable declaration
  const responseInfo = getResponseInfo(request.url);

  try {
    // Attempt to read file index.html and store returned data in map as data
    responseInfo.set(
      "data",
      await readFile(
        responseInfo.get("filename"),
        responseInfo.get("content-type"),
      ),
    );
  } catch (err) {
    // Show error related to read file attempt in the console
    console.error(err);

    // Change status code to 500 (INTERNAL SERVER ERROR)
    responseInfo.set("status-code", 500);

    // Set content-type in map to application/json since we are returning a string
    responseInfo.set("content-type", "application/json");
    // Update data to string containing error message
    responseInfo.set("data", JSON.stringify("500 INTERNAL SERVER ERROR"));
  } finally {
    // Specify response header status code for GET request and text/html subtype as accepted content types
    res.writeHead(responseInfo.get("status-code"), {
      "Content-Type": responseInfo.get("content-type"),
    });

    // Specify request body which contains the data returned from reading file 404.html
    res.end(responseInfo.get("data"));
  }
};

// Add callback to http request event
server.on("request", httpGetRequest);

// Tell the server to listen to localhost: 8000
server.listen(8080);
