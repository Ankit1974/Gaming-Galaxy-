import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity, Linking } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');
const PAGE_SIZE = 5; // Number of items to fetch per page

const JobsMain = () => {
    const [trandingItems, setTrandingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastDoc, setLastDoc] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = async (loadMore = false) => {
        if (loadMore && (loadingMore || !hasMore)) return; // Prevent multiple fetches or unnecessary calls
        if (!loadMore) setLoading(true); // Only set loading for initial load

        try {
            console.log('Fetching data...', loadMore ? 'Loading more' : 'Initial load');
            const trandingRef = firestore().collection("Jobs").limit(PAGE_SIZE);
            let query = trandingRef;

            if (loadMore && lastDoc) {
                query = query.startAfter(lastDoc);
            }

            const trandingSnapshot = await query.get();
            console.log('Snapshot size:', trandingSnapshot.size);

            if (!trandingSnapshot.empty) {
                const newItems = trandingSnapshot.docs.map(doc => {
                    const data = doc.data();
                    console.log('Document data:', data);
                    return {
                        id: doc.id,
                        name: data.Name,
                        imageUrl: data.Image,
                        role: data.Role,
                        time: data.Time,
                        url: data.Url,
                    };
                });

                console.log('Fetched items:', newItems);

                if (loadMore) {
                    setTrandingItems(prevItems => [...prevItems, ...newItems]);
                } else {
                    setTrandingItems(newItems);
                }

                setLastDoc(trandingSnapshot.docs[trandingSnapshot.docs.length - 1]);
                if (trandingSnapshot.docs.length < PAGE_SIZE) {
                    setHasMore(false); // No more items to fetch
                }
            } else {
                setHasMore(false); // No more items to fetch
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleReadMore = (url) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    const renderProductItem = ({ item }) => {
        return (
            <View style={styles.card}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.cardImage}
                    resizeMode="cover" // Ensures the image covers the entire area within its bounds
                    onError={() => console.log("Image failed to load")}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.headline}>{item.role}</Text>
                    <Text style={styles.description}>{item.name}</Text>
                    <Text style={styles.description}>{item.time}</Text>
                    <TouchableOpacity onPress={() => handleReadMore(item.url)}>
                        <Text style={styles.readMore}>Apply Here</Text>
                    </TouchableOpacity>
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
            data={trandingItems}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.flatListContentContainer}
            onEndReached={() => {
                if (hasMore && !loadingMore) {
                    setLoadingMore(true);
                    fetchData(true);
                }
            }}
            onEndReachedThreshold={0.2} // Trigger when scrolled 20% from the bottom
            ListFooterComponent={loadingMore && <ActivityIndicator size="small" color="#0000ff" />}
        />
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        marginVertical: 10,
        backgroundColor: '#fff',
        elevation: 7,
        width: width * 0.95,
        minHeight: height * 0.15, // Minimum height for the card
        borderRadius: 20,
        overflow: 'hidden',
    },
    cardImage: {
        marginTop: 15,
        marginLeft: 10,
        width: width * 0.25, // Adjust the width of the image
        height: '70%', // Ensure the image height is maximized within the card
    },
    textContainer: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    headline: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
    },
    description: {
        color: 'gray',
        fontSize: 16,
        marginBottom: 5,
    },
    readMore: {
        color: 'blue',
        fontSize: 16,
        fontWeight: 'bold',
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

export default JobsMain;
