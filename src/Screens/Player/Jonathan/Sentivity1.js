
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Sentivity from '../Goblin/Sentivity';

const Sentivity1 = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Coming Soon</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // Set your preferred background color
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color:'black'
    },
});

export default Sentivity1
;
