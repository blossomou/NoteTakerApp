import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { readFile } from 'fs';
import path from 'path';

//import notes from './database/notes.json';

//another way of importing
// const express = require("express");
// const path = require("path");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const { notes } = require("./database/notes.json");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//
//app.use(express.json())
//app.use(express.urlencoded({extended: true}))
//

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
  console.log("id", id);
  let result = notesArray.filter((note) => note.id === parseInt(id))[0];

  //another way
  //let result = [];
  //   for (let i = 0; i < notesArray.length; i++) {
  //     if (notesArray[i].id === parseInt(id)) {
  //       result.push(notesArray[i]);
  //     }
  //   }

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
