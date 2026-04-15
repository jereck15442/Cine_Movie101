const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Dataset (Initial Data)
let movies = [
  { id: 1, title: 'Inception', genre: 'Sci-Fi', year: 2010, rating: 8.8 },
  { id: 2, title: 'The Godfather', genre: 'Crime', year: 1972, rating: 9.2 },
  { id: 3, title: 'The Dark Knight', genre: 'Action', year: 2008, rating: 9.0 },
  { id: 4, title: 'Pulp Fiction', genre: 'Crime', year: 1994, rating: 8.9 },
  { id: 5, title: "Schindler's List", genre: 'Drama', year: 1993, rating: 9.0 },
  { id: 6, title: 'The Matrix', genre: 'Sci-Fi', year: 1999, rating: 8.7 },
  { id: 7, title: 'Interstellar', genre: 'Sci-Fi', year: 2014, rating: 8.6 },
  { id: 8, title: 'Parasite', genre: 'Thriller', year: 2019, rating: 8.6 },
  {
    id: 9,
    title: 'Spirited Away',
    genre: 'Animation',
    year: 2001,
    rating: 8.6,
  },
  { id: 10, title: 'Gladiator', genre: 'Action', year: 2000, rating: 8.5 },
];

// --- API ENDPOINTS (10 UNIQUE) ---

// 1. GET all movies
app.get('/api/movies', (req, res) => {
  res.status(200).json(movies);
});

// 2. GET single movie by ID
app.get('/api/movies/:id', (req, res) => {
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).json({ message: 'Movie not found' });
  res.json(movie);
});

// 3. POST add new movie
app.post('/api/movies', (req, res) => {
  const { title, genre, year, rating } = req.body;
  if (!title || !genre)
    return res.status(400).json({ message: 'Title and Genre required' });

  const newMovie = {
    id: movies.length > 0 ? Math.max(...movies.map((m) => m.id)) + 1 : 1,
    title,
    genre,
    year: parseInt(year),
    rating: parseFloat(rating),
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// 4. PUT update movie
app.put('/api/movies/:id', (req, res) => {
  const index = movies.findIndex((m) => m.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Movie not found' });

  movies[index] = { ...movies[index], ...req.body };
  res.json(movies[index]);
});

// 5. DELETE movie
app.delete('/api/movies/:id', (req, res) => {
  const index = movies.findIndex((m) => m.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Movie not found' });

  const deleted = movies.splice(index, 1);
  res.json({ message: 'Deleted successfully', movie: deleted[0] });
});

// 6. GET movies by genre
app.get('/api/movies/genre/:genre', (req, res) => {
  const filtered = movies.filter(
    (m) => m.genre.toLowerCase() === req.params.genre.toLowerCase()
  );
  res.json(filtered);
});

// 7. GET top-rated movies (Rating > 8.8)
app.get('/api/movies/featured/top', (req, res) => {
  const topMovies = movies.filter((m) => m.rating >= 8.9);
  res.json(topMovies);
});

// 8. GET search by title
app.get('/api/movies/search/find', (req, res) => {
  const title = req.query.title;
  if (!title)
    return res
      .status(400)
      .json({ message: "Query parameter 'title' is required" });
  const results = movies.filter((m) =>
    m.title.toLowerCase().includes(title.toLowerCase())
  );
  res.json(results);
});

// 9. GET system stats
app.get('/api/stats', (req, res) => {
  res.json({
    totalMovies: movies.length,
    averageRating: (
      movies.reduce((acc, m) => acc + m.rating, 0) / movies.length
    ).toFixed(2),
    lastUpdated: new Date(),
  });
});

// 10. GET random movie
app.get('/api/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * movies.length);
  res.json(movies[randomIndex]);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));