import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Linking, RefreshControl } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

const PAGE_SIZE = 1; // Number of items to fetch per page

const ControverseyMain = () => {
    const [TrandingItems, setTrandingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastDoc, setLastDoc] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async (loadMore = false, refresh = false) => {
        if (loadMore && loadingMore) return; // Prevent multiple fetches
        if (!loadMore && !refresh) setLoading(true); // Only set loading for initial load

        try {
            console.log('Fetching data...', loadMore ? 'Loading more' : (refresh ? 'Refreshing' : 'Initial load'));
            let trandingRef = firestore().collection("Controversey").orderBy("Date", "desc").limit(PAGE_SIZE);

            if (loadMore && lastDoc) {
                trandingRef = trandingRef.startAfter(lastDoc);
            }

            const trandingSnapshot = await trandingRef.get();
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
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleReadMore = (url) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    const handleShare = async (item) => {
        try {
            // Download the image to a temporary file
            const fileName = `${item.id}.jpg`; // Unique file name based on item ID
            const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;

            // Download image
            await RNFS.downloadFile({
                fromUrl: item.imageUrl,
                toFile: filePath,
            }).promise;

            // Share the image along with headline and additional text
            const shareOptions = {
                title: item.headLine,
                message: `${item.headLine}\n\nTo read more, download the app.`,
                url: `file://${filePath}`, // Share the local file
            };

            await Share.open(shareOptions);
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const renderProductItem = ({ item }) => {
        return (
            <View style={styles.card}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.cardImage}
                        resizeMode="cover"
                        onError={() => console.log(`Image failed to load for item: ${item.id}`)}
                    />
                    <Text style={styles.tag}>GG+</Text>
                </View>
                <Text style={styles.headline}>{item.headLine}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <View style={styles.actionsContainer}>
                    <TouchableOpacity onPress={() => handleReadMore(item.url)}>
                        <Text style={styles.readMore}>Source</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleShare(item)}>
                        <Text style={styles.share}>Share</Text>
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
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshing(true);
                        setLastDoc(null); // Reset last document for fresh data
                        fetchData(false, true); // Fetch data for refresh
                    }}
                />
            }
        />
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: hp('1%'),
        backgroundColor: '#fff',
        elevation: 7,
        width: wp('90%'),
        borderRadius: wp('4%'),
        alignSelf: 'center',
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: hp('25%'),
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    headline: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: wp('5%'),
        marginLeft: wp('3%'),
        marginTop: hp('1%'),
        flexShrink: 1,
        zIndex: 1, // Ensure it's above other elements
    },
    description: {
        marginTop: hp('1%'),
        color: '#666',
        fontSize: wp('4%'),
        marginHorizontal: wp('3%'),
        textAlign: 'left',
        fontFamily: 'Roboto',
        lineHeight: 26, // Increased line height
        flexShrink: 1,
    },
    readMore: {
        marginTop: hp('1%'),
        color: 'blue',
        fontSize: wp('4%'),
        fontWeight: 'bold',
        textAlign: 'left',
        marginRight: wp('3%'),
        marginLeft: wp('3%')
    },
    share: {
        marginTop: hp('1%'),
        color: 'blue',
        fontSize: wp('4%'),
        fontWeight: 'bold',
        textAlign: 'right',
        marginRight: wp('3%'),
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('1%'),
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
    tag: {
        color: 'white',
        backgroundColor: 'green',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 15,
        position: 'absolute',
        left: 12,
        bottom: -12, // Position at the bottom of the image
    },
    viewShot: {
        backgroundColor: '#fff', // Set a background color that you want
        flex: 1,
    },
});

export default ControverseyMain;

