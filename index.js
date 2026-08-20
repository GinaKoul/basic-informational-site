const http = require("node:http");
const fs = require("node:fs/promises");

// Create a local server to receive data from
const server = http.createServer();

// Async function that tries to read file and returns equivalent error when the procedure fails
const readFile = async (filepath) => {
  try {
    // Read file using the fs promise based module and return it
    return await fs.readFile(filepath, { encoding: "utf8" });
  } catch (error) {
    // Throw an error to inform that attempt to read the file failed
    throw new Error(`Failed to read file ${filepath}. Error message: ${error}`);
  }
};

/*Async function that calls readFile to get requested page 
that returns Page 404 if requested page is not found 
and returns a string with text 404 Page Not Found 
if Page 404 is not available*/
const httpGetRequest = async (request, res) => {
  //Variable declaration
  let data;
  let statusCode;

  try {
    console.log(request);
    // Attempt to read file index.html
    data = await readFile("index.html");

    // Change request status code to 200 (OK)
    statusCode = 200;
  } catch (err) {
    // Show error related to read file attempt in the console
    console.error(err);

    // Change request status code to 404 (NOT FOUND)
    statusCode = 404;

    try {
      // Attempt to read file 404.html and save response content to data variable
      data = await readFile("404.html");
    } catch (error) {
      // Show error related to read file 404.html attempt in the console
      console.error(error);

      // Assign string 404 Page Not Found to data variable after fail to retrieve 404 Page
      data = "404 Page Not Found";
    }
  } finally {
    // Specify response header status code for GET request and text/html subtype as accepted content types
    res.writeHead(statusCode, { text: "text/html" });
    // Specify request body which contains the data returned from reading file 404.html
    res.end(JSON.stringify(data));
  }
};

// Add callback to http request event
server.on("request", httpGetRequest);

// Tell the server to listen to localhost: 8000
server.listen(8000);
