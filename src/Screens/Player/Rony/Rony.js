import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity, Linking } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const specificDocumentIds = ["G4wwDak4Ierq0RTzFRdB"]; // Replace with actual document IDs

const Rony = () => {
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
                                ign: subDoc.data().Ign,
                                dob: subDoc.data().D_O_B,
                                team: subDoc.data().Team,
                                Yurl: subDoc.data().yurl,
                                Iurl: subDoc.data().iurl,
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
                    <TouchableOpacity onPress={() => Linking.openURL(item.Yurl)}>
                        <Icon name="youtube-play" size={wp('8%')} color="#FF0000" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL(item.Iurl)}>
                        <Icon name="instagram" size={wp('8%')} color="#C13584" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.heading}>PAST TEAM</Text>
                <View style={styles.cardContent}>
                    <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Team Mayavi</Text>
                    </Text>
                    <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Team Global Esports</Text>
                    </Text>
                    <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Team Blind Esports</Text>
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
        marginVertical: hp('1%'),
        backgroundColor: '#fff',
        flex: 1,
        borderRadius: wp('4%'),
        elevation: 7,
        width: wp('93%'),
        height: hp('100%'),
        marginHorizontal: wp('2.6%'),
    },
    cardImage: {
        width: '100%',
        height: hp('40%'),
        borderTopLeftRadius: wp('4%'),
        borderTopRightRadius: wp('4%'),
    },
    cardContent: {
        padding: wp('3%'),
    },
    productText: {
        fontSize: wp('4%'),
        fontWeight: 'bold',
        marginBottom: hp('1%'),
    },
    detailText: {
        fontSize: wp('4.5%'),
        color: 'black',
        marginBottom: hp('0.5%'),
    },
    detailLabel: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: wp('5%'),
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
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('1%'),
    },
    heading: {
        fontSize: wp('6%'),
        color: 'black',
        textAlign: "center",
        fontWeight: "bold",
        marginTop: hp('0.5%'),
        backgroundColor: "#D0D6B5",
        paddingVertical: hp('0.5%'),
        borderRadius: wp('2%'),
    }
});

export default Rony