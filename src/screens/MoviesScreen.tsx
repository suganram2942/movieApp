import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import GenrePicker from '../components/GenrePicker';
import SearchBar from '../components/SearchBar';

const API_KEY = '2dca580c2a14b55200e784d157207b4d';
const BASE_URL = 'https://api.themoviedb.org/3';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

interface Genre {
  id: number;
  name: string;
}

const MoviesScreen: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [year, setYear] = useState<number>(2012);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMovies = async (
    page: number,
    searchQuery: string,
    genre: number | null,
  ) => {
    try {
      setLoading(true);
      const genreParam = genre ? `&with_genres=${genre}` : '';
      const searchParam = searchQuery ? `&query=${searchQuery}` : '';
      const endpoint = searchQuery
        ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchQuery}&page=${page}`
        : `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${year}${genreParam}&page=${page}&vote_count.gte=100`;
      const response = await axios.get(endpoint);
      setMovies(prevMovies =>
        page === 1
          ? response.data.results
          : [...prevMovies, ...response.data.results],
      );
    } catch (error) {
      if (error.response) {
        console.error('Response error:', error.response.data);
      } else if (error.request) {
        console.error('Request error:', error.request);
      } else {
        console.error('General error:', error.message);
      }
      console.error('Error config:', error.config);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`,
      );
      setGenres(response.data.genres);
    } catch (error) {
      if (error.response) {
        console.error('Response error:', error.response.data);
      } else if (error.request) {
        console.error('Request error:', error.request);
      } else {
        console.error('General error:', error.message);
      }
      console.error('Error config:', error.config);
    }
  };

  useEffect(() => {
    fetchGenres();
    fetchMovies(1, '', null); // Initial fetch without any genre filter or search query
  }, []);

  useEffect(() => {
    setPage(1);
    fetchMovies(1, searchQuery, selectedGenre);
  }, [year, selectedGenre, searchQuery]);

  const loadMoreMovies = () => {
    if (!loading) {
      fetchMovies(page + 1, searchQuery, selectedGenre);
      setPage(page + 1);
    }
  };

  const renderMovie = ({item}: {item: Movie}) => (
    <View style={styles.movieCard}>
      <Image
        source={{uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`}}
        style={styles.image}
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.details}>Rating: {item.vote_average}</Text>
      <Text style={styles.details}>Release Date: {item.release_date}</Text>
      <Text style={styles.description}>{item.overview}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>MOVIEFIX</Text>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <GenrePicker
        genres={genres}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
      />
      <FlatList
        data={movies}
        keyExtractor={item => item.id.toString()}
        renderItem={renderMovie}
        onEndReached={loadMoreMovies}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#ff3d3d" /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },
  header: {
    color: '#ff3d3d',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  movieCard: {
    backgroundColor: '#1c1c1c',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  details: {
    color: '#fff',
    fontSize: 14,
  },
  description: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 5,
  },
});

export default MoviesScreen;
