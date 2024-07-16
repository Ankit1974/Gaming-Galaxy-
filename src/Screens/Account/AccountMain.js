import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const AccountScreen = () => {
  const [name, setName] = useState('Loading...'); // Initial state while fetching name
  const [editing, setEditing] = useState(false); // State to handle editing mode

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userDoc = await firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            setName(userDoc.data().name);
          } else {
            setName('User');
          }
        }
      } catch (error) {
        console.error('Error fetching user name: ', error);
        setName('Error loading name');
      }
    };

    fetchUserName();
  }, []);

  const handleSaveName = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        await firestore().collection('users').doc(user.uid).update({ name });
        Alert.alert('Name updated successfully');
        setEditing(false); // Exit editing mode after saving
      }
    } catch (error) {
      console.error('Error updating user name: ', error);
      Alert.alert('Error updating name');
    }
  };

  const handleRankingSystemPress = () => {
    Alert.alert('Ranking System clicked');
    // Add your navigation or other logic here
  };

  const handleAboutPress = () => {
    Alert.alert('About clicked');
    // Add your navigation or other logic here
  };

  const handlePrivacyPoliciesPress = () => {
    Alert.alert('Privacy Policies clicked');
    // Add your navigation or other logic here
  };

  const handleLogoutPress = () => {
    Alert.alert('Logout clicked');
    // Add your logout logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder} />
        <View style={styles.nameContainer}>
          {editing ? (
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              onSubmitEditing={handleSaveName} // Save the name when the user submits the input
              returnKeyType="done"
              autoFocus
            />
          ) : (
            <>
              <Text style={styles.name}>{name}</Text>
              <TouchableOpacity onPress={() => setEditing(true)} style={styles.editButton}>
                <Icon name="edit" size={24} color="blue" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={handleRankingSystemPress}>
          <Icon name="star" size={24} color="black" style={styles.menuIcon} />
          <Text style={styles.menuText}>Ranking System</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleAboutPress}>
          <Icon name="info" size={24} color="black" style={styles.menuIcon} />
          <Text style={styles.menuText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handlePrivacyPoliciesPress}>
          <Icon name="lock" size={24} color="black" style={styles.menuIcon} />
          <Text style={styles.menuText}>Privacy Policies</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogoutPress}>
          <Icon name="exit-to-app" size={24} color="black" style={styles.menuIcon} />
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginTop: 50, // Adjust as needed to position the header section
  },
  avatarPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75, // Adjusted to match the circular shape
    backgroundColor: '#ddd', // Placeholder color for the avatar
    marginBottom: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 45,
  },
  name: {
    fontSize: 24,
    marginRight: 10, // Adjusted to add some space between the name and the icon
  },
  nameInput: {
    fontSize: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    textAlign: 'center',
    marginRight: 10, // Adjusted to add some space between the input and the icon
  },
  editButton: {
    marginLeft: 2, // Adjusted to add some space between the name and the icon
  },
  menu: {
    marginTop: 30,
    width: '100%',
    alignItems: 'flex-start', // Align items to the start (left)
  },
  menuItem: {
    paddingVertical: 15,
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center', // Ensure the icon and text are vertically aligned
    marginLeft: 10, // Add margin to the left
  },
  menuIcon: {
    marginRight: 15, // Add some space between the icon and the text
  },
  menuText: {
    fontSize: 18,
  },
});

export default AccountScreen;
