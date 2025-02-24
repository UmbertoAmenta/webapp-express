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
    res.json(results);
  });
};

// SHOW
const show = (req, res) => {
  const { id } = req.params;

  const sql = `SELECT * FROM movies WHERE id = ?`;
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

// DELETE
const destroy = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM movies WHERE id = ?`;
  connection.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete post" });
    res.sendStatus(204);
  });
};

module.exports = { index, show, destroy };
