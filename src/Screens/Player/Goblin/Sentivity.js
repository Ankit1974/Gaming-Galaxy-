import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ads from './Ads';
import Gyro from './Gyro';

const Sentivity = () => {
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
                        const sensitivityRef = subDoc.ref.collection('Sensitivity').doc('8AHjIia6DkP6ICPpZ8nA');
                        const sensitivityDoc = await sensitivityRef.get();

                        if (sensitivityDoc.exists) {
                            const sensitivityData = sensitivityDoc.data();
                            playerItems.push({
                                id: subDoc.id,
                                achievements: [sensitivityData],
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
            <View style={styles.achievementContainer}>
                {item.achievements.map((achievement, index) => (
                    <View key={index} style={styles.achievementContent}>
                        <Text style={styles.heading}>CAMERA SENSITIVITY SETTING</Text>
                        <View style={styles.headerContainer}>
                            <Text style={styles.topLeftText}>Free Look</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.detailLabel}>Camera</Text>
                            <Text style={styles.detailText}>{achievement.Camera}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.detailLabel}>Tpp</Text>
                            <Text style={styles.detailText}>{achievement.Tpp}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.detailLabel}>Fpp</Text>
                            <Text style={styles.detailText}>{achievement.Fpp}</Text>
                        </View>
                        <Text style={styles.topLeftText}>Camera Sensitivity</Text>
                        <View style={styles.rowContainer}>
                            <Text style={styles.detailLabel}>Tpp No Scope</Text>
                            <Text style={styles.detailText}>{achievement.Tpp2}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.detailLabel}>Fpp No Scope</Text>
                            <Text style={styles.detailText}>{achievement.Fpp2}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.detailLabel}>Red Dot/Holo</Text>
                            <Text style={styles.detailText}>{achievement.RedDot}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.detailLabel}>2x</Text>
                            <Text style={styles.detailText}>{achievement.xx}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.detailLabel}>3x</Text>
                            <Text style={styles.detailText}>{achievement.xxx}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.detailLabel}>4x</Text>
                            <Text style={styles.detailText}>{achievement.xxxx}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.detailLabel}>6x</Text>
                            <Text style={styles.detailText}>{achievement.xxxxxx}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.detailLabel}>8x</Text>
                            <Text style={styles.detailText}>{achievement.xxxxxxxx}</Text>
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
            ListHeaderComponent={<Ads />}
            ListFooterComponent={<Gyro />}
            contentContainerStyle={styles.flatListContentContainer}
        />
    );
};

const styles = StyleSheet.create({
    achievementContainer: {
        flex: 1,
    },
    achievementContent: {
        backgroundColor: '#41EAD4',
        padding: wp('4%'),
        marginBottom: hp('1%'),
        borderRadius: wp('2%'),
        borderWidth: 1,
        borderColor: '#ddd',
        elevation: 3,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('1%'),
    },
    achievementHeading: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
        color: 'black',
    },
    topLeftText: {
        fontSize: wp('5%'),
        color: 'black',
        fontWeight: 'bold',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('1%'),
        backgroundColor: '#F3F9E3',
        padding: wp('2%'),
        marginTop: hp('0.5%'),
        borderRadius: wp('2%'),
    },
    detailText: {
        fontSize: wp('4%'),
        color: 'black',
    },
    detailLabel: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: wp('4%'),
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
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('2%'),
    },
    heading: {
        fontSize: wp('5%'),
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: hp('0.5%'),
        marginBottom: hp('1%'),
        paddingVertical: hp('0.5%'),
        borderRadius: wp('2%'),
    }
});

export default Sentivity;
