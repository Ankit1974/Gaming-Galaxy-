import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Control3 = () => {
    const [playerItems, setPlayerItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const playerRef = firestore().collection("EportsPlayer");
                const playerSnapshot = await playerRef.get();
                const playerItems = [];

                for (const doc of playerSnapshot.docs) {
                    const subcollectionRef = doc.ref.collection('PlayerProfile');
                    const subcollectionSnapshot = await subcollectionRef.get();

                    for (const subDoc of subcollectionSnapshot.docs) {
                        const sensitivityRef = subDoc.ref.collection('Sensitivity').doc('DsePhK2rOWOD6HZ0Frjc');
                        const sensitivityDoc = await sensitivityRef.get();

                        if (sensitivityDoc.exists) {
                            const sensitivityData = sensitivityDoc.data();
                            playerItems.push({
                                id: subDoc.id,
                                imageUrl: sensitivityData.Image,
                            });
                        }
                    }
                }

                setPlayerItems(playerItems);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderProductItem = ({ item }) => {
        return (
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.image}
                />
            </View>
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
            data={playerItems}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatListContentContainer}
        />
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp('1%'),
    },
    image: {
        marginTop: hp('30%'),
        width: wp('100%'),
        height: hp('25%'),
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
        flexGrow: 1,
        padding: wp('2.5%'),
    },
});

export default Control3;
