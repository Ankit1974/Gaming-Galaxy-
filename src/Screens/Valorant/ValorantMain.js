import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PAGE_SIZE = 1; // Number of items to fetch per page

const ValorantMain = () => {
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
            console.log('Fetching data...', loadMore ? 'Loading more' : 'Initial load');
            const trandingRef = firestore().collection("Valorant").limit(PAGE_SIZE);
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
                        description: data.Description,
                        imageUrl: data.Image,
                        headLine: data.HeadLine,
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
                    resizeMode="contain"
                    onError={() => console.log(`Image failed to load for item: ${item.id}`)}
                />
                <Text style={styles.headline}>{item.headLine}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <TouchableOpacity onPress={() => handleReadMore(item.url)}>
                    <Text style={styles.readMore}>Source</Text>
                </TouchableOpacity>
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
            contentContainerStyle={styles.flatListContentContainer}
            onEndReached={() => {
                if (hasMore && !loadingMore) {
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
        marginVertical: hp('1%'),
        backgroundColor: '#fff',
        elevation: 7,
        width: wp('95%'),
        minHeight: hp('30%'),
        paddingBottom: hp('1%'),
        borderRadius: wp('5%'),
        alignSelf: 'center',
    },
    cardImage: {
        width: '100%',
        height: hp('25%'),
        borderTopLeftRadius: wp('2%'),
        borderTopRightRadius: wp('2%'),
    },
    headline: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: wp('5%'),
        marginLeft: wp('3%'),
        marginTop: hp('1%'),
        flexShrink: 1,
    },
    description: {
        marginTop: hp('1%'),
        color: 'gray',
        fontSize: wp('4%'),
        fontWeight: 'bold',
        marginHorizontal: wp('3%'),
        textAlign: 'left',
        flexShrink: 1,
    },
    readMore: {
        marginTop: hp('1%'),
        color: 'blue',
        fontSize: wp('4%'),
        fontWeight: 'bold',
        textAlign: 'right',
        marginRight: wp('3%'),
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
        paddingBottom: hp('1%'),
    },
});

export default ValorantMain;

