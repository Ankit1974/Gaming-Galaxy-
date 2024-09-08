import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity, Linking } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share'; // Ensure Share is imported

const { width, height } = Dimensions.get('window');
const PAGE_SIZE = 1; // Number of items to fetch per page

const TrandingSectionMain = ({}) => {
    const [TrandingItems, setTrandingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastDoc, setLastDoc] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [itemToShare, setItemToShare] = useState(null);
    const [screenshotUri, setScreenshotUri] = useState(null);

    const screenshotViewShots = useRef({});

    const fetchData = async (loadMore = false) => {
        if (loadMore && loadingMore) return; // Prevent multiple fetches
        if (!loadMore) setLoading(true); // Only set loading for initial load

        try {
            console.log('Fetching data...', loadMore ? 'Loading more' : 'Initial load');
            let trandingRef = firestore().collection("TrandingNews").orderBy("no", "desc").limit(PAGE_SIZE);
            
            if (loadMore && lastDoc) {
                trandingRef = trandingRef.startAfter(lastDoc);
            }

            const trandingSnapshot = await trandingRef.get();
            console.log('Snapshot size:', trandingSnapshot.size);

            if (!trandingSnapshot.empty) {
                const newItems = trandingSnapshot.docs.map(doc => ({
                    id: doc.id,
                    description: doc.data().Description,
                    imageUrl: doc.data().Image,
                    headLine: doc.data().HeadLine,
                    url: doc.data().Url, // Assuming you have a field for the URL
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
            }, 1000); // 1000ms delay to ensure content is rendered
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const renderProductItem = ({ item }) => {
        return (
            <View style={styles.card}>
                <ViewShot
                    ref={(ref) => { screenshotViewShots.current[item.id] = ref; }}
                    options={{ format: "jpg", quality: 0.9 }}
                    style={styles.viewShot}
                >
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.cardImage}
                        onError={() => console.log("Image failed to load")}
                    />
                    <Text style={styles.tag}>GG+</Text>
                    <Text style={styles.headline}>{item.headLine}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </ViewShot>
                <View style={styles.bottomContainer}>
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

    const handleReadMore = (url) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
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
            ListFooterComponent={
                loadingMore && (
                    <View style={styles.footerContainer}>
                        <ActivityIndicator size="small" color="#0000ff" />
                    </View>
                )
            }
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
        width: width * 0.86,
        height: height * 0.73,
        marginHorizontal: 10,
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '40%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    tag: {
        color: 'white',
        backgroundColor: 'green',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 15,
        position: 'absolute',
        left: 12,
        top: '40%',
        transform: [{ translateY: -10 }], // Adjust this value to fine-tune the position
    },
    headline: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: wp('5%'),
        marginLeft: 12,
        fontFamily: 'Roboto',
        marginTop: 10,
        flexShrink: 1,
    },
    description: {
        marginTop: 10,
        color: '#666',
        fontSize: wp('4%'),
        fontWeight: '100',
        fontFamily: 'Roboto',
        lineHeight: 26, // Increased line height
        marginHorizontal: 5,
        marginLeft: 13,
        marginRight: 5,
        textAlign: 'left',
        flexShrink: 1,
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 'auto',
    },
    readMore: {
        color: 'blue',
        fontSize: wp('4%'),
        fontWeight: 'bold',
    },
    share: {
        color: 'blue',
        fontSize: wp('4%'),
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
    footerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
});

export default TrandingSectionMain;
