import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text } from 'react-native';
import { API_ACCESS_TOKEN } from '@env';
import MovieItem from '../movies/MovieItem';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons'
import { Movie } from '../../types/app';

type RootStackParamList = {
    MovieDetail: { id: number };
};

type MovieListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MovieDetail'>;

const KeywordSearch = (): JSX.Element => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const navigation = useNavigation<MovieListNavigationProp>();
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = () => {
        if (searchQuery.trim() === '') return;
        console.log(searchQuery);
        setIsLoading(true);

        const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchQuery)}`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${API_ACCESS_TOKEN}`,
            },
        };

        fetch(url, options)
            .then(async (response) => await response.json())
            .then((response) => {
                setSearchResults(response.results);
            })
            .catch((error) => {
                console.error('Search error:', error);
            });
        setIsLoading(false);

    };

    const handleMoviePress = (movieId: number) => {
        navigation.navigate('MovieDetail', { id: movieId });
    };

    return (
        <View>
            <View style={styles.searchBar}>
                <FontAwesome name="search" size={24} color="#888" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Type a title here..."
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
            </View>
            {isLoading && <Text>Loading...</Text>}

            <FlatList
                style={{
                    ...styles.resultList
                }}
                data={searchResults}
                renderItem={({ item }) => (
                    <MovieItem
                        movie={item}
                        size={{ width: 100, height: 150 }}
                        coverType="poster"
                        onPress={() => handleMoviePress(item.id)}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                horizontal={false}
                numColumns={3}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 25,
        paddingHorizontal: 16,
        height: 50,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    resultList: {
        // flex: 1,
        paddingLeft: 4,
        marginTop: 8,
    },
});

export default KeywordSearch;