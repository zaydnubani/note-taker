const express = require('express');
const path = require('path');
const fs = require('fs');
// Helper method for generating unique ids
const db = require("./db/db.json");

const uuid = require('./helpers/uuid');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => res.send('Navigate to /send or /routes'));

app.get('/send', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/send.html'))
);

// TODO: Create a route that will serve up the `public/paths.html` page

app.get('/paths', (req, res) => 
res.sendFile(path.join(__dirname, 'public/paths.html')));

app.get('/notes', (req, res) =>
res.sendFile(path.join(__dirname, "public/notes.html")));

// API Calls

app.get("/api/notes", function (req, res) {
    // Read the db.json file and return all saved notes as JSON
    res.json(db);
});

// API POST Request
app.post("/api/notes", function (req, res) {
    console.log(req.body);
    const {title, text} = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new review
          parsedNotes.push(newNote);
  
          // Write updated reviews back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) => {
                res.json(db);
                writeErr
                  ? console.error(writeErr)
                  : console.info('Successfully updated notes!')   
            }
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
  });

  // // API DELETE Request
  app.delete("/api/notes/:id", function (req, res) {
    // Return the remaining notes to the client
    let note_id = req.params.id
    console.log(note_id);
    for(let i = 0; 0 < db.length; i++) {
        if (db[i].id === note_id) {
            db.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(db, null, 2)
            );
        break;
        }
    };
    res.json(db);
  });

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);