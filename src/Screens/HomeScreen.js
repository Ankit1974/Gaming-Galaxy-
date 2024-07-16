import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native'; // Import useRoute hook
import TrandingSectionMain from '../../android/Common/TrandingSection';
import CategorySection from '../../android/Common/CategorySection';

const HomeScreen = () => {
    const route = useRoute(); // Use useRoute hook to access route parameters
    const {} = route.params ?? {}; // Destructure email and uid from route.params

    return (
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.content}>
                <Text style={styles.header}>TRENDING NEWS</Text>
                <TrandingSectionMain/>
                <Text style={styles.header2}>Categories</Text>
                <CategorySection />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        paddingVertical: 10,
    },
    content: {
        padding: 10,
    },
    header: {
        fontSize: 24,
        marginTop: 10,
        marginLeft: 3,
        fontWeight: 'bold',
        color: 'black',
    },
    header2: {
        fontSize: 24,
        marginLeft: 4,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 10,
    },
    userInfoContainer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginTop: 20,
        borderRadius: 5,
    },
    userInfoText: {
        fontSize: 16,
        color: 'black',
        marginBottom: 5,
    },
});

export default HomeScreen;
