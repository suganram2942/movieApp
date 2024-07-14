import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';

interface Genre {
  id: number;
  name: string;
}

interface GenrePickerProps {
  genres: Genre[];
  selectedGenre: number | null;
  setSelectedGenre: (genreId: number) => void;
}

const GenrePicker: React.FC<GenrePickerProps> = ({
  genres,
  selectedGenre,
  setSelectedGenre,
}) => {
  const renderItem = ({item}: {item: Genre}) => (
    <TouchableOpacity
      onPress={() => setSelectedGenre(item.id)}
      style={styles.genreButton}>
      <Text
        style={[
          styles.genreText,
          selectedGenre === item.id && styles.selectedGenreText,
        ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.genreList}>
      <FlatList
        data={genres}
        horizontal
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.genreListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  genreList: {
    paddingVertical: 10,
    height: 50, // Set a fixed height
  },
  genreListContent: {
    alignItems: 'center',
  },
  genreButton: {
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  genreText: {
    color: '#fff',
  },
  selectedGenreText: {
    color: '#ff3d3d',
  },
});

export default GenrePicker;
