import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { API_ACCESS_TOKEN } from '@env';
import { Movie } from '../types/app';
import MovieItem from '../components/movies/MovieItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    MovieDetail: { id: number };
};

type MovieDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MovieDetail'>;

const MovieDetail = ({ route }: any): JSX.Element => {
    const { id } = route.params;
    const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
    const [recommendations, setRecommendations] = useState<Movie[]>([]);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const navigation = useNavigation<MovieDetailNavigationProp>();

    useEffect(() => {
        fetchMovieDetails();
        fetchRecommendations();
        checkIsFavorite(id);
    }, [id]);

    const handleRecommendationPress = (movieId: number) => {
        navigation.push('MovieDetail', { id: movieId });
    };


    const addFavorite = async (movie: Movie): Promise<void> => {
        try {
            const initialData: string | null = await AsyncStorage.getItem(
                '@FavoriteList'
            )
            console.log(initialData)

            let favMovieList: Movie[] = []

            if (initialData !== null) {
                favMovieList = [...JSON.parse(initialData), movie]
            } else {
                favMovieList = [movie]
            }

            await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList))
            setIsFavorite(true)
        } catch (error) {
            console.log(error)
        }
    }

    const removeFavorite = async (id: number): Promise<void> => {
        try {
            const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
            console.log(initialData);
            if (initialData !== null) {
                const favMovieList: Movie[] = JSON.parse(initialData);
                const updatedList = favMovieList.filter(movie => movie.id !== id);
                await AsyncStorage.setItem('@FavoriteList', JSON.stringify(updatedList));
                setIsFavorite(false);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const checkIsFavorite = async (id: number): Promise<void> => {
        try {
            const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
            if (initialData !== null) {
                const favMovieList: Movie[] = JSON.parse(initialData);
                setIsFavorite(favMovieList.some(movie => movie.id === id));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const toggleFavorite = () => {
        if (movieDetails) {
            if (isFavorite) {
                removeFavorite(movieDetails.id);
            } else {
                addFavorite(movieDetails);
            }
        }
    };

    const fetchMovieDetails = async () => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
                headers: {
                    Authorization: `Bearer ${API_ACCESS_TOKEN}`,
                },
            });
            const data = await response.json();
            setMovieDetails(data);
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    };

    const fetchRecommendations = async () => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations`, {
                headers: {
                    Authorization: `Bearer ${API_ACCESS_TOKEN}`,
                },
            });
            const data = await response.json();
            setRecommendations(data.results);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    if (!movieDetails) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${movieDetails.backdrop_path}` }}
                style={styles.backdropImage}
            />
            <View style={styles.detailsContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{movieDetails.title}</Text>
                    <TouchableOpacity onPress={toggleFavorite}>
                        <FontAwesome
                            name={isFavorite ? 'heart' : 'heart-o'}
                            size={24}
                            color={isFavorite ? 'red' : 'black'}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.overview}>{movieDetails.overview}</Text>
                <Text style={styles.info}>Release Date: {movieDetails.release_date.toString()}</Text>
                <Text style={styles.info}>Rating: {movieDetails.vote_average}/10</Text>
            </View>
            <View style={styles.recommendationsContainer}>
                <Text style={styles.recommendationsTitle}>Recommendations</Text>
                <FlatList
                    horizontal
                    data={recommendations}
                    renderItem={({ item }) => (
                        <MovieItem
                            movie={item}
                            size={{ width: 100, height: 150 }}
                            coverType="poster"
                            onPress={() => handleRecommendationPress(item.id)}
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backdropImage: {
        width: '100%',
        height: 200,
    },
    detailsContainer: {
        padding: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    overview: {
        fontSize: 16,
        marginBottom: 10,
    },
    info: {
        fontSize: 14,
        marginBottom: 5,
    },
    recommendationsContainer: {
        padding: 15,
    },
    recommendationsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
});

export default MovieDetail;