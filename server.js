const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path')
let db = require('./Develop/db/db.json'); //Array of Objects
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // giving a unique ID to each note
const { json } = require('express');
const { notDeepEqual } = require('assert');


//parse incoming string, array or JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./Develop/public'));

//HTML Get Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});
app.get('/', (req, res) => { // using '*' breaks the application
    res.sendFile(path.join(__dirname, './Develop/public/index.html'));
  });

//API Get Route
app.get('/api/notes', (req, res) => {
    return res.json(db);
})

app.get("/api/notes/:id", (req, res) => {
    const { id } = req.params;
    const noteId = db.find(note => note.id === id);

    if(noteId) {
        res.status(200).json(noteId)
    } else {
        res.status(404).json("Note does not exist")
    }
});

//API Put Route
// app.put("/notes/:id", (req, res) => {
//     const { id } = req.params;
//     const changes = req.body;

//     const index = db.findIndex(note => note.id === id);

//     if (index !== -1) {
//         db[index] = changes;
//         res.status(200).json(db[index]);
//     } else {
//         res.status(404).json("Note cannot be found")
//     }
// })

// API delete Route *Bonus*
app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;

    const deleted = db.find(note => note.id === id);
    if (deleted) {
        db = db.filter(note => note.id !== id)
        fs.writeFileSync(path.join(__dirname, './Develop/db/db.json'), JSON.stringify(db));  //rewrite db.json file
        return res.status(200).json(deleted);
    } else {
        res.status(404).json({message: "Note doesn't exist"})
    }
      });

//API Post Route
app.post('/api/notes', (req, res) => {
    let newNote = req.body; // creating a new note
    newNote.id = uuidv4(); // giving new note unique id
    db.push(newNote); // push new note into db.json
   
    fs.writeFileSync(path.join(__dirname, './Develop/db/db.json'), JSON.stringify(db));  //Write to db file
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


