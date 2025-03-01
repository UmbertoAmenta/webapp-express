const connection = require("../data/db");

// INDEX
const index = (req, res) => {
  const sql = `
  SELECT movies.*, ROUND(AVG(reviews.vote)) as avg_vote
  FROM movies
  LEFT JOIN reviews ON movies.id = reviews.movie_id
  GROUP BY movies.id`;

  connection.execute(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Query Error",
        message: `Database Query Failed: ${sql}`,
      });
    }

    const movies = results.map((movie) => {
      movie.image = `${process.env.BE_SERVER}/imgs/${movie.image}`;
    });
    res.json(results);
  });
};

// SHOW
const show = (req, res) => {
  const { id } = req.params;

  const sql = `SELECT movies.*, ROUND(AVG(reviews.vote)) as avg_vote
  FROM movies
  LEFT JOIN reviews ON movies.id = reviews.movie_id
  WHERE movies.id = ?
  GROUP BY movies.id`;
  connection.execute(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Query Error",
        message: `Database Query Failed: ${sql}`,
      });
    }

    const movie = results[0];

    if (!movie) {
      return res.status(404).json({
        error: "Not Found",
        message: "Movie Not Found",
      });
    }
    movie.image = `${process.env.BE_SERVER}/imgs/${movie.image}`;

    const reviewsSql = `SELECT * FROM reviews WHERE movie_id = ?`;
    connection.execute(reviewsSql, [id], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "Query Error",
          message: `Database query failed: ${reviewsSql}`,
        });
      }

      movie.reviews = results;

      res.json(movie);
    });
  });
};

// STORE -REVIEW
const storeReview = (req, res) => {
  const { id } = req.params;

  const { name, vote, text } = req.body;

  const sql = `
  INSERT INTO reviews (movie_id, name, vote, text)
  VALUE (?, ?, ?, ?)`;

  connection.execute(sql, [id, name, vote, text], (error, results) => {
    if (error) {
      return res.status(500).json({
        error: "Query Error",
        message: `Database query failed: ${sql}`,
      });
    }

    return res.status(201).json({ id: results.insertId });
  });
};

// DELETE
const destroy = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM movies WHERE id = ?`;
  connection.execute(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete post" });
    res.sendStatus(204);
  });
};

module.exports = { index, show, storeReview, destroy };
