import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GenreResults from '../components/search/GenreResult';
import Search from '../screens/Search';
import MovieDetail from '../screens/MovieDetail';
import { RootStackParamList } from '../types/app';

const Stack = createNativeStackNavigator<RootStackParamList>();

const SearchStackNavigation = (): JSX.Element => (<Stack.Navigator>
    <Stack.Screen name="SearchScreen" component={Search} options={{ headerShown: false }} />
    <Stack.Screen name="GenreResults" component={GenreResults} />
    <Stack.Screen name="MovieDetail" component={MovieDetail} />
</Stack.Navigator>);

export default SearchStackNavigation;
