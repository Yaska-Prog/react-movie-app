import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Favorite from '../screens/Favorite';
import MovieDetail from '../screens/MovieDetail';

const Stack = createNativeStackNavigator();

const FavoriteStackNavigation = (): JSX.Element => (
    <Stack.Navigator>
        <Stack.Screen name="FavoriteScreen" component={Favorite} options={{ headerShown: false }} />
        <Stack.Screen name="MovieDetail" component={MovieDetail} />
    </Stack.Navigator>
);

export default FavoriteStackNavigation;