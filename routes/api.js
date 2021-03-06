const uuid = require("uuid");
const fs = require("fs");
const jsonDB = require("../db/db.json");

module.exports = (app) => {
    //Holds returned, parsed json data & gets new note entry pushed to it.
    let noteArray = [];


    //GET to display notes in notes.html sidebar
    app.get('/api/notes', (req, res) => {
        fs.readFile("./db/db.json", "utf8", (err, data) => {
            if (err) throw err;
            res.send(data); //sets data to text/html and sends to client/frontend(index.js)
            //console.log(`This is data ${data}`); //TEST
        });
    });

    //POST - to read, add new note, rewrite db.json
    app.post('/api/notes', (req, res) => {

        //Create new note object
        let newNote = {
            title: req.body.title,
            text: req.body.text,
            id: uuid.v4() //Will add unique ID to each new note
        };

        //First read and parse db.json
        fs.readFile("./db/db.json", "utf8", (err, data) => {
            if (err) throw err;
            let parsedData = JSON.parse(data); //Parse to js object
            noteArray = parsedData; //Define contents of the noteArray
            noteArray.push(newNote); //Push new note entry to noteArray
            console.log(newNote); //TEST
            //Then overwrite existing db.json w/stringified noteArray content
            fs.writeFile("./db/db.json", JSON.stringify(noteArray, null, 2), (err) => {
                if (err) throw err;
                console.log("Notes saved");
                res.json(jsonDB); //sends content as JSON
            });
        });
    });

    //BONUS: Allow user to delete selected note(s)
    app.delete("/api/notes/:id", (req, res) => {

        let deleteNoteID = req.params.id; //Define an id parameter name
        console.log(deleteNoteID); //TEST

        //Read file as in "app.post" above 
        fs.readFile("./db/db.json", "utf8", (err, data) => {
            if (err) throw err;
            data = JSON.parse(data); //Parse response data
            res.send(data); //Send it to index.js/DOM
            // console.log(data.length);//TEST

            //Loop over parsed data to find index matching to selected id.
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === deleteNoteID) {
                    console.log(data[i]);
                    data.splice([i], 1); //Slice/remove matched index
                };
            };

            //Rewrite db.json to reflect file change after data index deletion
            fs.writeFile("./db/db.json", JSON.stringify(data, null, 2), (err) => {
                if (err) throw err;
                console.log("Note deleted");
            });
        });
    });
};