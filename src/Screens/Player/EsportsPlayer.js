import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';

const { width, height } = Dimensions.get('window');

const EsportsPlayerMain = ({ navigation }) => {
    const [TrandingItems, setTrandingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const trandingRef = firestore().collection("EportsPlayer");
                const trandingSnapshot = await trandingRef.get();
                const trandingItems = trandingSnapshot.docs.map(doc => ({
                    id: doc.id,
                    imageUrl: doc.data().Image,
                    name: doc.data().Name,
                }));

                setTrandingItems(trandingItems);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleProductPress = async (item) => {
        try {
            const user = auth().currentUser;
            if (user) {
                const email = user.email;
                const currentMonth = moment().format('MMMM-YYYY');
                const playerRef = firestore()
                    .collection('PlayerViewed')
                    .doc(currentMonth)
                    .collection(item.name)
                    .doc(email);

                await playerRef.set({
                    email: email,
                    timestamp: firestore.FieldValue.serverTimestamp(),
                });

                console.log('Player view data stored successfully');
            } else {
                console.error("User not logged in");
            }

            navigation.navigate(item.name);
        } catch (error) {
            console.error('Error storing player view data:', error);
        }
    };

    const renderProductItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleProductPress(item)} style={styles.card}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.cardImage}
                    onError={() => console.log("Image failed to load")}
                />
                <Text style={styles.headline}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text>Error: {error.message}</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={TrandingItems}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContentContainer}
        />
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        elevation: 7,
        flex: 1,
        margin: 10,
        height: height * 0.3,
        width: (width / 2) - 30,
    },
    cardImage: {
        width: '100%',
        height: '85%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    headline: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 22,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatListContentContainer: {
        paddingHorizontal: 10,
    },
});

export default EsportsPlayerMain;
