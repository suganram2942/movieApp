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
  genres: Genre[];
  cast: Cast[];
  director: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Cast {
  id: number;
  name: string;
  character: string;
}

const MoviesScreen: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [year, setYear] = useState<number>(2012);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingGenres, setLoadingGenres] = useState<boolean>(false);

  const fetchMovieDetails = async (movieId: number) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`,
      );
      const movieDetails = response.data;
      const genres =
        movieDetails.genres?.map((genre: any) => ({
          id: genre.id,
          name: genre.name,
        })) || [];
      const cast =
        movieDetails.credits?.cast?.slice(0, 5).map((member: any) => ({
          id: member.id,
          name: member.name,
          character: member.character,
        })) || [];
      const director =
        movieDetails.credits?.crew?.find(
          (member: any) => member.job === 'Director',
        )?.name || '';

      return {
        genres,
        cast,
        director,
      };
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return {
        genres: [],
        cast: [],
        director: '',
      };
    }
  };

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
      const moviesWithDetails = await Promise.all(
        response.data.results?.map(async (movie: any) => {
          const details = await fetchMovieDetails(movie.id);
          return {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
            release_date: movie.release_date,
            overview: movie.overview,
            ...details,
          };
        }) || [],
      );
      setMovies(prevMovies =>
        page === 1 ? moviesWithDetails : [...prevMovies, ...moviesWithDetails],
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
      setLoadingGenres(true);
      const response = await axios.get(
        `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`,
      );
      setGenres(response.data.genres || []);
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
      setLoadingGenres(false);
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

  const renderMovie = ({item}: {item: Movie}) => {
    const formattedDate = item.release_date
      ? new Date(item?.release_date).toLocaleDateString('en-GB')
      : 'N/A';
    const roundedRating = item?.vote_average
      ? (Math.round(item?.vote_average * 10) / 10).toFixed(1)
      : 'N/A';

    return (
      <View style={styles.movieCard}>
        <Image
          source={{uri: `https://image.tmdb.org/t/p/w500${item?.poster_path}`}}
          style={styles.image}
        />
        <Text style={styles.title}>{item?.title}</Text>
        <Text style={styles.details}>Rating: {roundedRating}</Text>
        <Text style={styles.details}>Release Date: {formattedDate}</Text>
        <Text style={styles.details}>
          Genres: {item?.genres?.map(genre => genre?.name).join(', ') || 'N/A'}
        </Text>
        <Text style={styles.details}>
          Cast: {item?.cast?.map(member => member?.name).join(', ') || 'N/A'}
        </Text>
        <Text style={styles.details}>Director: {item.director || 'N/A'}</Text>
        <Text style={styles.description}>{item.overview}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>MOVIEFIX</Text>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <GenrePicker
        genres={genres}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        loadingGenres={loadingGenres}
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
