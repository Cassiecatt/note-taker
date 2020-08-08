const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path')
const db = require('./db/db.json');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // giving a unique ID to each note

//Empty notes array to push into to
let notes = [];

//parse incoming string, array or JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));

//HTML Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//API Routes
app.get('/api/notes', (req, res) => {
    return res.json(db);
})

//API Post Route
app.post('/api/notes', (req, res) => {
    //push new note into db.json
    let newNote = req.body;
    newNote.id = uuidv4();
    // console.log(uuidv4())
    db.push(newNote);
    //Write to db file
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(db));
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

