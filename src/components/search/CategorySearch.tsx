import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_ACCESS_TOKEN } from '@env';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/app';

interface Genre {
    id: number;
    name: string;
}

// type RootStackParamList = {
//     GenreResults: { id: number[] };
// };

// type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GenreResults'>;
type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SearchScreen'>;
const GenreSelection = () => {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    // const navigation = useNavigation();
    const navigation = useNavigation<SearchScreenNavigationProp>();

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        try {
            const response = await fetch(
                'https://api.themoviedb.org/3/genre/movie/list',
                {
                    headers: {
                        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const data = await response.json();
            setGenres(data.genres);
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    };

    const toggleGenre = (genreId: number) => {
        setSelectedGenres((prev) =>
            prev.includes(genreId)
                ? prev.filter((id) => id !== genreId)
                : [...prev, genreId]
        );
    };

    const handleSearch = () => {
        navigation.navigate('GenreResults', { id: selectedGenres });
    };

    const renderGenreItem = ({ item }: { item: Genre }) => (
        <TouchableOpacity
            style={[
                styles.genreButton,
                selectedGenres.includes(item.id) && styles.selectedGenre,
            ]}
            onPress={() => toggleGenre(item.id)}
        >
            <Text style={styles.genreText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={genres}
                renderItem={renderGenreItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        padding: 16,
    },
    row: {
        justifyContent: 'space-between',
    },
    genreButton: {
        backgroundColor: '#C0B4D5',
        padding: 10,
        borderRadius: 5,
        margin: 5,
        width: '47%',
        alignItems: 'center',
    },
    selectedGenre: {
        backgroundColor: '#8978A4',
    },
    genreText: {
        color: 'white',
    },
    searchButton: {
        backgroundColor: '#8978A4',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    searchButtonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default GenreSelection;