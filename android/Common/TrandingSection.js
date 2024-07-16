import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');
const PAGE_SIZE = 1; // Number of items to fetch per page

const TrandingSectionMain = ({}) => {
    const [TrandingItems, setTrandingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastDoc, setLastDoc] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = async (loadMore = false) => {
        if (loadMore && loadingMore) return; // Prevent multiple fetches
        if (!loadMore) setLoading(true); // Only set loading for initial load

        try {
            const trandingRef = firestore().collection("TrandingNews").limit(PAGE_SIZE);
            let query = trandingRef;

            if (loadMore && lastDoc) {
                query = query.startAfter(lastDoc);
            }

            const trandingSnapshot = await query.get();
            const newItems = trandingSnapshot.docs.map(doc => ({
                id: doc.id,
                description: doc.data().Description,
                imageUrl: doc.data().Image,
                headLine: doc.data().HeadLine,
            }));

            if (loadMore) {
                setTrandingItems(prevItems => [...prevItems, ...newItems]);
            } else {
                setTrandingItems(newItems);
            }

            setLastDoc(trandingSnapshot.docs[trandingSnapshot.docs.length - 1]);

            if (trandingSnapshot.docs.length < PAGE_SIZE) {
                setHasMore(false); // No more items to fetch
            }
        } catch (error) {
            setError(error);
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
            <View style={styles.card}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.cardImage}
                    onError={() => console.log("Image failed to load")}
                />
                <Text style={styles.headline}>{item.headLine}</Text>
                <Text style={styles.description}>{item.description}</Text>
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
            data={TrandingItems}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
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
    card: {
        marginVertical: 10,
        backgroundColor: '#fff',
        flex: 1,
        borderRadius: 20,
        elevation: 7,
        width: width * 0.8,
        height: height * 0.73,
        marginHorizontal: 10,
    },
    cardImage: {
        width: '100%',
        height: '40%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    headline: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 22,
        marginLeft: 12,
        marginTop: 10,
        flexShrink: 1,
    },
    description: {
        marginTop: 10,
        color: 'gray',
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 5,
        marginLeft: 13,
        marginRight: 5,
        textAlign: 'left',
        flexShrink: 1,
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

export default TrandingSectionMain;
