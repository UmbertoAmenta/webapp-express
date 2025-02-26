const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT;

const notFound = require("./middlewares/notFound");
const handlerErrors = require("./middlewares/handlerErrors");

// ROUTERS
const moviesRouter = require("./routers/moviesRouter");

// MIDDLEWARES
// globali
app.use(cors({ origin: process.env.FE_CLIENT }));
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server in funzione");
});

app.use("/movies", moviesRouter);

// Middlewares errori
app.use(notFound);
app.use(handlerErrors);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
