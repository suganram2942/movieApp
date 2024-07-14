// services/movieService.ts
import axios from 'axios';

const API_KEY = '2dca580c2a14b55200e784d157207b4d';
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchGenres = async () => {
  const response = await axios.get(
    `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`,
  );
  return response.data.genres;
};

export const fetchMovies = async (year, genre, page) => {
  const genreFilter = genre ? `&with_genres=${genre}` : '';
  const response = await axios.get(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${year}&page=${page}${genreFilter}&vote_count.gte=100`,
  );
  return response.data.results;
};
