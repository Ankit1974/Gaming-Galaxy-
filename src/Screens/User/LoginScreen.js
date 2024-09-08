import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, Text, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');
const imageHeight = height * 0.4;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      if (email.length > 0 && password.length > 0) {
        const isUserLogin = await auth().signInWithEmailAndPassword(email, password);
        setMessage('');
        console.log(isUserLogin);

        navigation.navigate('home', {
          email: isUserLogin.user.email,
          uid: isUserLogin.user.uid,
        });
      } else {
        Alert.alert('Missing Information', 'Please fill in all required fields.');
      }
    } catch (err) {
      console.log('Error code:', err.code);
      console.log(err);

      setMessage(err.message);
      switch (err.code) {
        case 'auth/wrong-password':
          Alert.alert('Invalid Credentials', 'You entered a wrong password.');
          break;
        case 'auth/user-not-found':
          Alert.alert('Invalid Credentials', 'You entered a wrong email.');
          break;
        case 'auth/invalid-email':
          Alert.alert('Invalid Credentials', 'You entered an invalid email.');
          break;
        case 'auth/invalid-credential':
          Alert.alert('Invalid Credentials', 'You entered wrong email or password.');
          break;
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Star Background */}
      <View style={styles.starsContainer}>
        <Text style={styles.star}>⭐️</Text>
        <Text style={[styles.star, styles.star2]}>⭐️</Text>
        <Text style={[styles.star, styles.star3]}>⭐️</Text>
        <Text style={[styles.star, styles.star4]}>⭐️</Text>
        <Text style={[styles.star, styles.star5]}>⭐️</Text>
      </View>
      <View style={styles.imageContainer}>
        <ImageBackground
          source={{ uri: 'login1' }}
          style={styles.backgroundImage}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Email"
          placeholderTextColor="white"
          keyboardType="email-address"
          value={email}
          onChangeText={value => setEmail(value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Your Password"
          placeholderTextColor="white"
          value={password}
          onChangeText={value => setPassword(value)}
          secureTextEntry={true}
        />
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin} // Call handleLogin on button press
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{message}</Text>
        <TouchableOpacity
          style={styles.signup}
          onPress={() => {
            navigation.navigate('SignUp'); // Navigate to SignUp screen
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', marginTop: 10 }}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1d', // Dark background color
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 0,
  },
  star: {
    position: 'absolute',
    top: '13%',
    left: '20%',
    fontSize: 22,
    color: '#fff',
  },
  star2: {
    top: '32%',
    left: '50%',
    fontSize: 17,
    color: '#fff',
  },
  star3: {
    top: '50%',
    left: '70%',
    fontSize: 18,
    color: '#fff',
  },
  star4: {
    top: '20%',
    left: '90%',
    fontSize: 14,
    color: '#fff',
  },
  star5: {
    top: '40%',
    left: '3%',
    fontSize: 20,
    color: '#fff',
  },
  imageContainer: {
    marginTop: 80,
    width: '100%',
    height: imageHeight,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure main content is on top of stars
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    width: '90%',
    marginTop: 40,
    alignSelf: 'center', // Center the input container horizontally
    zIndex: 1, // Ensure main content is on top of stars
  },
  input: {
    height: 40,
    borderColor: '#39ff14', // Neon green color for the border
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: '#2a2a2d', // Darker input background for a cohesive look
    color: 'white', // Text color to contrast with the dark background
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#007bff', // Blue background for the button
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: 'white', // White text color for the button text
    fontSize: 16,
    fontWeight: 'bold',
  },
  signup: {
    marginTop: 10,
    alignItems: 'center',
  },
});

export default LoginScreen;
