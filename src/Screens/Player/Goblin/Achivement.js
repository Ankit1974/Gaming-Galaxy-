import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Dimensions, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const { width } = Dimensions.get('window');
const PAGE_SIZE = 2; // Number of items to fetch per page

const Achievement = () => {
    const [playerItems, setPlayerItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastDoc, setLastDoc] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = async (loadMore = false) => {
        if (loadMore && loadingMore) return; // Prevent multiple fetches
        if (!loadMore) setLoading(true); // Only set loading for initial load

        try {
            console.log(loadMore ? 'Fetching more data' : 'Fetching initial data');

            const playerRef = firestore().collection("EportsPlayer").limit(PAGE_SIZE);
            let query = playerRef;

            if (loadMore && lastDoc) {
                query = query.startAfter(lastDoc);
                console.log('Starting after last document:', lastDoc.id);
            }

            const playerSnapshot = await query.get();
            const newPlayerItems = [];

            for (const doc of playerSnapshot.docs) {
                const subcollectionRef = doc.ref.collection('PlayerProfile');
                const subcollectionSnapshot = await subcollectionRef.get();

                for (const subDoc of subcollectionSnapshot.docs) {
                    const achievementRef = subDoc.ref.collection('Achievement1');
                    const achievementSnapshot = await achievementRef.get();
                    const achievements = achievementSnapshot.docs.map(achievementDoc => achievementDoc.data());

                    // Sort achievements by date in descending order
                    achievements.sort((a, b) => new Date(b.Date) - new Date(a.Date));

                    newPlayerItems.push({
                        id: subDoc.id,
                        achievements: achievements,
                    });
                }
            }

            if (loadMore) {
                setPlayerItems(prevItems => [...prevItems, ...newPlayerItems]);
                console.log('Appending new items, total items:', [...playerItems, ...newPlayerItems].length);
            } else {
                setPlayerItems(newPlayerItems);
                console.log('Setting initial items, total items:', newPlayerItems.length);
            }

            setLastDoc(playerSnapshot.docs[playerSnapshot.docs.length - 1]);

            if (playerSnapshot.docs.length < PAGE_SIZE) {
                setHasMore(false); // No more items to fetch
                console.log('No more items to fetch');
            }
        } catch (error) {
            setError(error);
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const renderProductItem = ({ item }) => {
        return (
            <View style={styles.achievementContainer}>
                {item.achievements.map((achievement, index) => (
                    <View key={index} style={styles.achievementContent}>
                        <Text style={styles.achievementHeading}>{achievement.Name}</Text>
                        <View style={styles.gridContainer}>
                            <View style={styles.gridItem}>
                                <Text style={styles.detailLabel}>DATE</Text>
                                <Text style={styles.detailText}>{achievement.Date}</Text>
                            </View>
                            <View style={styles.gridItem}>
                                <Text style={styles.detailLabel}>PLACE</Text>
                                <Text style={styles.detailText}>{achievement.Place}</Text>
                            </View>
                            <View style={styles.gridItem}>
                                <Text style={styles.detailLabel}>TIER</Text>
                                <Text style={styles.detailText}>{achievement.Tier}</Text>
                            </View>
                            <View style={styles.gridItem}>
                                <Image
                                    style={styles.teamImage}
                                    source={{ uri: achievement.Team }} // Ensure the achievement object includes the TeamImageUrl property
                                />
                            </View>
                            <View style={styles.gridItem}>
                                <Text style={styles.detailLabel}>PRIZE</Text>
                                <Text style={styles.detailText}>{achievement.Prize}</Text>
                            </View>
                            <View style={styles.gridItem}>
                                <Text style={styles.detailLabel}>MVP</Text>
                                <Text style={styles.detailText}>{achievement.Mvp}</Text>
                            </View>
                        </View>
                    </View>
                ))}
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
            onEndReached={() => {
                if (hasMore && !loadingMore) {
                    setLoadingMore(true);
                    fetchData(true);
                }
            }}
            onEndReachedThreshold={0.5} // Trigger when scrolled 50% from the bottom
            ListFooterComponent={loadingMore && <ActivityIndicator size="small" color="#0000ff" />}
        />
    );
};

const styles = StyleSheet.create({
    achievementContainer: {
        flex: 1,
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 10,
    },
    achievementContent: {
        backgroundColor: '#f8f8f8',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        elevation: 3,
        backgroundColor: "#41EAD4"
    },
    achievementHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    gridItem: {
        width: (width - 110) / 3, // Adjust width to make smaller items, assuming 10px padding/margin
        height: (width - 110) / 3, // Make height equal to width
        alignItems: 'center',
        justifyContent: 'center', // Center the text inside the square
        backgroundColor: '#F3F9E3', // Set background color to pink
        borderRadius: 10,
        marginBottom: 10,
    },
    teamImage: {
        width: '50%',
        height: '67%',
        borderRadius: 10,
    },
    detailText: {
        fontSize: 17, // Adjust font size for smaller details
        color: 'black',
        marginBottom: 3,
    },
    detailLabel: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 17, // Adjust font size for smaller details
        marginBottom: 7,
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
        marginTop: 2,
        marginBottom: 10,
        paddingVertical: 2,
        borderRadius: 10,
    }
});

export default Achievement;
