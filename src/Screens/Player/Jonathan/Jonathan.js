import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');

// List of specific document IDs to fetch
const specificDocumentIds = ["z3jsQIaVQdYvjpBnBhQQ"]; // Replace with actual document IDs

const Goblin = () => {
    const [breakfastItems, setBreakfastItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const breakfastItems = [];

                for (const docId of specificDocumentIds) {
                    const docRef = firestore().collection("EportsPlayer").doc(docId);
                    const docSnapshot = await docRef.get();

                    if (docSnapshot.exists) {
                        const subcollectionRef = docRef.collection('PlayerProfile');
                        const subcollectionSnapshot = await subcollectionRef.get();

                        subcollectionSnapshot.forEach((subDoc) => {
                            breakfastItems.push({
                                id: subDoc.id,
                                name: subDoc.data().Name,
                                imageUrl: subDoc.data().Image,
                                ign: subDoc.data().IGN,
                                dob: formatDateOfBirth(subDoc.data().D_O_B),
                                team: subDoc.data().Team,
                            });
                        });
                    }
                }

                setBreakfastItems(breakfastItems);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDateOfBirth = (dob) => {
        if (!dob) return "";
        const dateObj = dob.toDate(); // Convert Firebase Timestamp to JavaScript Date object
        const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
        return formattedDate;
    };

    const renderProductItem = ({ item }) => {
        return (
            <View style={styles.card}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.cardImage}
                    onError={() => console.log("Image failed to load")}
                />
                <Text style={styles.heading}>PLAYER INFORMATION</Text>
                <View style={styles.cardContent}>
                    <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Name:</Text> {item.name}
                    </Text>
                    <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>IGN:</Text> {item.ign}
                    </Text>
                    <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>D-O-B:</Text> {item.dob}
                    </Text>
                    <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Team:</Text> {item.team}
                    </Text>
                </View>
                <Text style={styles.heading}>SOCIAL MEDIA</Text>
                <View style={styles.cardContent}>
                    <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>YouTube:</Text>
                    </Text>
                    <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Instagram:</Text>
                    </Text>
                </View>
                <Text style={styles.heading}>PAST TEAM</Text>
                <View style={styles.cardContent}>
                    <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Team Insane</Text>
                    </Text>
                    <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Team iQOO Soul</Text>
                    </Text>
                </View>
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
            data={breakfastItems}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatListContentContainer}
        />
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 10,
        backgroundColor: '#fff',
        flex: 1,
        borderRadius: 20,
        elevation: 7,
        width: width * 0.93,
        height: height * 0.95,
        marginHorizontal: 10,
        backgroundColor: "pink"
    },
    cardImage: {
        width: '100%',
        height: '50%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    cardContent: {
        padding: 10
    },
    productText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    detailText: {
        fontSize: 17,
        color: 'black',
        marginBottom: 3,
    },
    detailLabel: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 18
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
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    heading: {
        fontSize: 24,
        color: 'black',
        textAlign: "center",
        fontWeight: "bold",
        marginTop: 5,
        backgroundColor: "#CC5A71"
    }
});

export default Goblin;
