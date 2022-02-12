import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { readFile, writeFile } from 'fs';
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

function DeleteById(id, notesArray) {
  let result = notesArray.filter((note) => note.id !== parseInt(id));

  return result;
}

//GetAllNotes
app.get("/api/notes", (req, res) => {
  readNotes().then((result) => res.json(result));
});

//GetNoteById
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

//GetNoteById
app.delete("/api/notes/:id", (req, res) => {
  console.info(`${req.method} request received to delete note`);
  readNotes().then((notes) => {
    const result = DeleteById(req.params.id, notes);
    writeNotes(result).then((result) => {
      res.json(result);
    });
  });
});

//AddNewNote
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a new note`);

  const { title, text } = req.body;

  if (title || text) {
    readNotes().then((result) => {
      const parsedNotes = result;

      let newId = result.length > 0 ? result[result.length - 1].id + 1 : 1; //add a new id
      const newNote = {
        id: newId,
        title,
        text,
      };

      parsedNotes.push(newNote);

      writeNotes(parsedNotes).then((result) => {
        res.json(result);
      });
    });
  }
});

const writeNotes = (noteObj) => {
  return new Promise((resolve, reject) => {
    writeFile("./database/notes.json", JSON.stringify(noteObj), (addErr) =>
      addErr
        ? resolve("Failed to add notes")
        : resolve("Successfully update the notes")
    );
  });
};

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
