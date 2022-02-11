import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { readFile } from 'fs';
import path from 'path';

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const readNotes = () => {
  return new Promise((resolve, reject) => {
    readFile("./database/notes.json", "utf8", function (err, data) {
      if (err) {
        console.log("err", err);
        resolve([]);
      }

      resolve(JSON.parse(data));
    });
  });
};

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(path.resolve("public", "index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.resolve("public", "notes.html"));
});

function findById(id, notesArray) {
  let result = notesArray.filter((note) => note.id === parseInt(id))[0];
  return result;
}

//Get
app.get("/api/notes", (req, res) => {
  readNotes().then((result) => res.json(result));
});

app.get("/api/notes/:id", (req, res) => {
  readNotes().then((notes) => {
    const result = findById(req.params.id, notes);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
  });
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
