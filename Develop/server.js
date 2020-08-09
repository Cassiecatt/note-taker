const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path') // Getting path in NODE
let db = require('./db/db.json'); //Array of Json objects
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // giving a unique ID to each note
const { json } = require('express');


//parse incoming string, array or JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));

//HTML Get Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//API Get Route
app.get('/api/notes', (req, res) => {
    return res.json(db);
})

// API delete Route *Bonus*
app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;

    const deleted = db.find(note => note.id === id);
    if (deleted) {
        db = db.filter(note => note.id !== id)
       res.status(200).json(deleted);
    } else {
        res.status(404).json({message: "Note doesn't exist"})
    }
      });

//API Post Route
app.post('/api/notes', (req, res) => {
    let newNote = req.body; // creating a new note
    newNote.id = uuidv4(); // giving new note unique id
    db.push(newNote); // push new note into db.json
   
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(db));  //Write to db file
    return res.json(newNote);
});

//HTML post route
app.post('/notes', (req, res) => {
    res.send(req.body)
});


//port listener
app.listen(PORT, () => {
    console.group(`API server now on port ${PORT}!`);
});


