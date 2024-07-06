import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie } from '../types/app';
import MovieItem from '../components/movies/MovieItem';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type FavoriteStackParamList = {
    FavoriteScreen: undefined;
    MovieDetail: { id: number };
};

type FavoriteScreenNavigationProp = NativeStackNavigationProp<FavoriteStackParamList, 'FavoriteScreen'>;

export default function Favorite(): JSX.Element {
    const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
    const isFocused = useIsFocused();
    const navigation = useNavigation<FavoriteScreenNavigationProp>();

    useEffect(() => {
        if (isFocused) {
            loadFavoriteMovies();
        }
    }, [isFocused]);

    const loadFavoriteMovies = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('@FavoriteList');
            if (storedFavorites !== null) {
                setFavoriteMovies(JSON.parse(storedFavorites));
            }
        } catch (error) {
            console.error('Error loading favorite movies:', error);
        }
    };

    const renderMovieItem = ({ item }: { item: Movie }) => (
        <MovieItem
            movie={item}
            size={{ width: 150, height: 225 }}
            coverType="poster"
            onPress={() => navigation.navigate('MovieDetail', { id: item.id })}
        />
    );

    return (
        <View style={styles.container}>
            {favoriteMovies.length > 0 ? (
                <FlatList
                    data={favoriteMovies}
                    renderItem={renderMovieItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                />
            ) : (
                <Text style={styles.emptyText}>No favorite movies yet.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
    },
});