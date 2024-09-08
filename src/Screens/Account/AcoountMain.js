import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image, Dimensions, ScrollView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Modal from 'react-native-modal';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

const { width, height } = Dimensions.get('window');

const AccountScreen = ({ navigation }) => {
  const [name, setName] = useState('Loading...');
  const [editing, setEditing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isContactModalVisible, setContactModalVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          setUserEmail(user.email);
          const userDoc = await firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            setName(userDoc.data().name);

            const avatarsSnapshot = await firestore().collection('Avatar').get();
            if (!avatarsSnapshot.empty) {
              const avatars = avatarsSnapshot.docs.map(doc => doc.data().url);
              const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
              setAvatar(randomAvatar);
            }
          } else {
            setName('User');
          }
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
        setName('Error loading name');
      }
    };

    fetchUserData();
  }, []);

  const handleSaveName = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        await firestore().collection('users').doc(user.uid).update({ name });
        Alert.alert('Name updated successfully');
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating user name: ', error);
      Alert.alert('Error updating name');
    }
  };

  const handleLogoutPress = () => {
    setModalVisible(true);
  };

  const confirmLogout = async () => {
    try {
      await auth().signOut();
      setModalVisible(false);
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out: ', error);
      Alert.alert('Error logging out');
    }
  };

  const cancelLogout = () => {
    setModalVisible(false);
  };

  const toggleContactModal = () => {
    setContactModalVisible(!isContactModalVisible);
  };

  const openGmail = () => {
    Linking.openURL('mailto:GGPlusstaff@gmail.com');
  };

  const openWhatsApp = () => {
    Linking.openURL('https://wa.me/918368776258');
  };

  const openInstagram = () => {
    Linking.openURL('https://www.instagram.com/viral.gamer?igsh=eGpvMHhpYWVnYjNv');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
          <View style={styles.nameContainer}>
            {editing ? (
              <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                onSubmitEditing={handleSaveName}
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
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Ranking System')}>
            <Icon name="star" size={24} color="black" style={styles.menuIcon} />
            <Text style={styles.menuText}>Ranking System</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('About')}>
            <Icon name="info" size={24} color="black" style={styles.menuIcon} />
            <Text style={styles.menuText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={toggleContactModal}>
            <Material name="headset" size={24} color="black" style={styles.menuIcon} />
            <Text style={styles.menuText}>Contact Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PrivacyPolicy')}>
            <Icon name="lock" size={24} color="black" style={styles.menuIcon} />
            <Text style={styles.menuText}>Privacy Policy</Text>
          </TouchableOpacity>

          {/* Conditionally Render Posting Section */}
          {userEmail === 'ankitraj4323@gmail.com' && (
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PostContentScreen')}>
              <Icon name="edit" size={24} color="black" style={styles.menuIcon} />
              <Text style={styles.menuText}>Posting</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.menuItem} onPress={handleLogoutPress}>
            <Icon name="exit-to-app" size={24} color="black" style={styles.menuIcon} />
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Modal */}
        <Modal isVisible={isModalVisible}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={confirmLogout}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={cancelLogout}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Contact Us Modal */}
        <Modal isVisible={isContactModalVisible} onBackdropPress={toggleContactModal}>
          <View style={styles.contactModalContent}>
            <TouchableOpacity style={styles.option} onPress={openInstagram}>
              <Entypo name="instagram" size={24} color="purple" />
              <Text style={styles.optionText}>Instagram</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={openGmail}>
              <Icon name="mail-outline" size={24} color="red" />
              <Text style={styles.optionText}>Gmail</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={openWhatsApp}>
              <Fontisto name="whatsapp" size={24} color="green" />
              <Text style={styles.optionText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  avatar: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: (width * 0.4) / 2,
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: (width * 0.4) / 2,
    marginBottom: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 25,
  },
  name: {
    fontSize: width * 0.06,
    marginRight: 4,
    fontWeight: 'bold',
    color: 'black',
  },
  nameInput: {
    fontSize: width * 0.06,
    borderBottomWidth: 1,
    textAlign: 'center',
    marginRight: 10,
    color: 'black',
  },
  editButton: {
    marginLeft: 1,
  },
  menu: {
    marginTop: 30,
    width: '90%',
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: width * 0.05,
    color: 'black',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: width * 0.05,
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contactModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: width * 0.045,
    marginLeft: 10,
    color: 'black',
  },
});

export default AccountScreen;
