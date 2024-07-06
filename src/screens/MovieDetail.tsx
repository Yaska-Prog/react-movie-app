import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, ScrollView, FlatList } from 'react-native';
import { API_ACCESS_TOKEN } from '@env';
import { Movie } from '../types/app';
import MovieItem from '../components/movies/MovieItem';

const MovieDetail = ({ route }: any): JSX.Element => {
    const { id } = route.params;
    const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
    const [recommendations, setRecommendations] = useState<Movie[]>([]);

    useEffect(() => {
        fetchMovieDetails();
        fetchRecommendations();
    }, [id]);

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
                <Text style={styles.title}>{movieDetails.title}</Text>
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
});

export default MovieDetail;