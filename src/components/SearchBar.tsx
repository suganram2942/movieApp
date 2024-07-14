import React from 'react';
import {View, TextInput, StyleSheet, TextInputProps} from 'react-native';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({searchQuery, setSearchQuery}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for a movie..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  input: {
    color: '#fff',
    padding: 10,
  },
});

export default SearchBar;
