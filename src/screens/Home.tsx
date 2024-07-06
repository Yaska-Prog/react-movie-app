import React from 'react'
import { View, Text, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export default function Home(): JSX.Element {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home</Text>
            <Button
                title="Go to Movie Detail"
                onPress={() => navigation.navigate('MovieDetail' as never)}
            />
        </View>
    )
}