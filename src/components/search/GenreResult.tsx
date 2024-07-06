import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { API_ACCESS_TOKEN } from '@env';
import MovieItem from '../movies/MovieItem';
import { Movie, RootStackParamList } from '../../types/app';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


type GenreResultsRouteProp = RouteProp<RootStackParamList, 'GenreResults'>;
type GenreResultsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GenreResults'>;

type Props = {
    route: GenreResultsRouteProp;
    navigation: GenreResultsNavigationProp;
};

const GenreResults = ({ route, navigation }: Props) => {
    const { id } = route.params;
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        fetchMoviesByGenres();
    }, []);

    const fetchMoviesByGenres = async () => {
        const genreIds = id.join(',');
        const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreIds}`;

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${API_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setMovies(data.results);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    const handleMoviePress = (movieId: number) => {
        navigation.navigate('MovieDetail', { id: movieId });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={movies}
                renderItem={({ item }) => (
                    <MovieItem
                        movie={item}
                        size={{ width: 100, height: 150 }}
                        coverType="poster"
                        onPress={() => handleMoviePress(item.id)}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={styles.row}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    row: {
        justifyContent: 'space-between',
    },
});

export default GenreResults;