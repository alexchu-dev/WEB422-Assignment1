/*********************************************************************************
 *  WEB422 – Assignment 1
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Alex Chu    Student ID: 153954219    Date: 5/19/2023
 *  Cyclic Link:      https://alexchu-web422-a1.vercel.app/
 ********************************************************************************/
// Express config
const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const HTTP_PORT = process.env.PORT || 8080

// Add support for CORS
app.use(cors())
// JSON parsing
app.use(express.json())

// --------------
// Database : Connecting to database and setting up your schemas/models (tables)
// --------------
const MoviesDB = require("./modules/moviesDB.js")
const db = new MoviesDB()

// --------------
// Endpoints
// --------------
app.get("/", (req, res) => {
  res.json({ message: "API Listening" })
})

// Use the body of request to add a new Movie document to the collection. 201 plus json when created, 500 when errors.
app.post("/api/movies", (req, res) => {
  const movieData = req.body
  db.addNewMovie(movieData)
    .then((newMovie) => {
      res.status(201).json(newMovie)
    })
    .catch((err) => {
      res.status(500).json({ error: "Error 500: Internal Server Error!" })
    })
})

// Receive parameters "page", "perPage", "title" through query and return results in json.
app.get("/api/movies", (req, res) => {
  const page = req.query.page
  const perPage = req.query.perPage
  const title = req.query.title
  db.getAllMovies(page, perPage, title)
    .then((allMovie) => {
      res.status(200).json(allMovie)
    })
    .catch((err) => {
      res.status(500).json({ error: "Error 500: Internal Server Error!" })
    })
})

// Receives Object ID through req.params and return the specific Movie object.
app.get("/api/movies/:id", (req, res) => {
  const idFromParam = req.params.id
  db.getMovieById(idFromParam)
    .then((movie) => {
      res.status(200).json(movie)
    })
    .catch((err) => {
      res.status(500).json({ error: "Error 500: Internal Server Error!" })
    })
})

// Receives Object ID through param and update the data receives from body.
app.put("/api/movies/:id", (req, res) => {
  const idFromParam = req.params.id
  const movieData = req.body
  db.updateMovieById(movieData, idFromParam)
    .then((updatedMovie) => {
      res.status(200).json({ message: "Update successful!", movieData })
    })
    .catch((err) => {
      res.status(500).json({ error: "Error 500: Internal Server Error!" })
    })
})

// Delete a movie object by receiving specific Object ID from param
app.delete("/api/movies/:id", (req, res) => {
  const idFromParam = req.params.id
  db.deleteMovieById(idFromParam)
    .then((deletedMovie) => {
      res.status(204)
    })
    .catch((err) => {
      res.status(500).json({ error: "Error 500: Internal Server Error!" })
    })
})

// ----------------
// Server initialization
/// --------------
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`)
    })
  })
  .catch((err) => {
    console.log(err)
  })
