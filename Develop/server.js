const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path')



//parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming json data
app.use(express.json());
//parse files within public
app.use(express.static('./public'));

//get route that returns index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

//get route that returns notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//post route
app.post('/notes', (req, res) => {
    res.send("successful")

})

//port listener
app.listen(PORT, () => {
    console.group(`API server now on port ${PORT}!`);
});

