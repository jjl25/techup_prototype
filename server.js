const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/data', (req, res) => { // Defines a route handler for GET requests to '/data'
  fs.readFile('data.json', 'utf8', (err, data) => { // Reads 'data.json' file from the filesystem
    if (err) { // Checks if there was an error reading the file
      res.status(500).send('Error reading data.json'); // Sends a 500 Internal Server Error response with an error message
    } else {
      res.send(data); // Sends the contents of 'data.json' as the response
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
