import React, { useEffect, useState } from 'react';
import { Text, FlatList, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const { width } = Dimensions.get('window');

const CategorySection = () => {
    const [CategoryItems, setCategoryItems] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchCategoryItems = async () => {
            const CategoryRef = firestore().collection("Category");
            try {
                const snapshot = await CategoryRef.get();
                const items = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return { id: doc.id, text: data.Name, imageUrl: data.Image };
                });
                setCategoryItems(items);
            } catch (error) {
                console.error('Error fetching Items:', error);
            }
        };

        fetchCategoryItems();
        
    }, []);

    const handleCategoryPress = async (category) => {
        try {
            const user = auth().currentUser;
            if (user) {
                const email = user.email;
                const currentDate = moment().format('YYYY-MM-DD');

                // Reference to the subcollection for the specific category on the current date
                const categoryRef = firestore()
                    .collection('ClickData')
                    .doc(currentDate)
                    .collection(category.text)
                    .doc(email);

                // Store or update click data in Firebase
                await categoryRef.set({
                    email: email,
                    timestamp: firestore.FieldValue.serverTimestamp(),
                });

                console.log('Click data stored successfully');
            } else {
                console.error("User not logged in");
            }

            // Navigate to the category screen
            navigation.navigate(category.text);
        } catch (error) {
            console.error('Error storing click data:', error);
        }
    };

    const renderCategoryItem = ({ item }) => {
        const itemNameParts = item.text.split(' ');

        return (
            <TouchableOpacity onPress={() => handleCategoryPress(item)} style={styles.categoryContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.icon} />
                {itemNameParts.map((part, index) => (
                    <Text key={index} style={styles.categoryText}>{part}</Text>
                ))}
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={CategoryItems}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
        />
    );
};

const styles = StyleSheet.create({
    horizontalList: {
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    categoryContainer: {
        alignItems: 'center',
        width: (width - 5) / 3, // Adjust width for equal spacing
    },
    icon: {
        width: 100,
        height: 100,
        //marginBottom: 10,
        borderRadius: 25,
        //backgroundColor: "skyblue",
    },
    categoryText: {
        fontSize: 12.93,
        color: 'blue',
        textAlign: "center",
        fontFamily: 'Poppins-SemiBold'
    },
});

export default CategorySection;
