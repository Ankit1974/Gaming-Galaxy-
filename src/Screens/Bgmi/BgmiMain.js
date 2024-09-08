import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Linking, RefreshControl } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';

const PAGE_SIZE = 1; // Number of items to fetch per page

const BgmiMain = () => {
    const [trandingItems, setTrandingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastDoc, setLastDoc] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [itemToShare, setItemToShare] = useState(null);
    const [screenshotUri, setScreenshotUri] = useState(null);

    // Use a single ref for all view shots
    const screenshotViewShots = useRef({}); 

    const fetchData = async (loadMore = false, refresh = false) => {
        if (loadMore && loadingMore) return;
        if (!loadMore && !refresh) setLoading(true);

        try {
            let trandingRef = firestore().collection("Bgmi").orderBy("Date", "desc").limit(PAGE_SIZE);

            if (loadMore && lastDoc) {
                trandingRef = trandingRef.startAfter(lastDoc);
            }

            const trandingSnapshot = await trandingRef.get();

            if (!trandingSnapshot.empty) {
                const newItems = trandingSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        description: data.Description,
                        imageUrl: data.Image,
                        headLine: data.HeadLine,
                        url: data.Url,
                    };
                });

                if (loadMore) {
                    setTrandingItems(prevItems => [...prevItems, ...newItems]);
                } else {
                    setTrandingItems(newItems);
                }

                setLastDoc(trandingSnapshot.docs[trandingSnapshot.docs.length - 1]);

                if (trandingSnapshot.docs.length < PAGE_SIZE) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
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
            setItemToShare(item);

            // Delay screenshot capture to ensure all content is rendered
            setTimeout(async () => {
                const viewShotRef = screenshotViewShots.current[item.id];
                if (viewShotRef) {
                    const uri = await viewShotRef.capture();
                    setScreenshotUri(uri);

                    const appLink = `https://play.google.com/store/apps/details?id=com.ggplus`;

                    const shareOptions = {
                        title: item.headLine,
                        message: `Check it out in our app: ${appLink}`,
                        url: uri,
                    };

                    await Share.open(shareOptions);
                }
            }, 500); // 500ms delay
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const renderProductItem = ({ item }) => {
        return (
            <View style={styles.card}>
                <ViewShot
                    ref={(ref) => { screenshotViewShots.current[item.id] = ref; }}
                    options={{ format: "jpg", quality: 0.9}}
                    style={styles.viewShot}
                >
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
                </ViewShot>
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
                    fetchData(true);
                }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loadingMore && <ActivityIndicator size="small" color="#0000ff" />}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshing(true);
                        setLastDoc(null);
                        fetchData(false, true);
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

export default BgmiMain;