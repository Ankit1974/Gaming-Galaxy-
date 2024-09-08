import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';

const PostContentScreen = () => {
  const [section, setSection] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [Description    , setDescription] = useState('');
  const [headline, setHeadline] = useState('');
  const [url, setUrl] = useState('');
  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1.0,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handlePostContent = async () => {
    try {
      const contentRef = firestore().collection(section).doc();
      await contentRef.set({
        image: imageUri,
        Description,
        headline,
        url,
      });

      if (imageUri) {
        const imagePath = `${section}/${contentRef.id}/image.jpg`;
        const imageRef = storage().ref(imagePath);
        await imageRef.putFile(imageUri);
        const imageUrl = await imageRef.getDownloadURL();
        await contentRef.update({ image: imageUrl });
      }

      Alert.alert('Content posted successfully!');
      setSection('');
      setImageUri('');
      setDescription('');
      setHeadline('');
      setUrl('');
    } catch (error) {
      console.error('Error posting content: ', error);
      Alert.alert('Error posting content');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Section:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={section}
          onValueChange={(itemValue) => setSection(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Section" value="" />
          <Picker.Item label="Bgmi" value="Bgmi" />
          <Picker.Item label="CONTROVERSY" value="CONTROVERSY" />
          <Picker.Item label="GLOBAL" value="GLOBAL" />
          <Picker.Item label="TradingNews" value="TradingNews" />
        </Picker>
      </View>

      <Text style={styles.label}>Image:</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={handleSelectImage}>
        <Text style={styles.imagePickerText}>{imageUri ? 'Change Image' : 'Select Image'}</Text>
      </TouchableOpacity>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      ) : null}

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter description"
        value={Description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Headline:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter headline"
        value={headline}
        onChangeText={setHeadline}
      />

      <Text style={styles.label}>URL:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter URL"
        value={url}
        onChangeText={setUrl}
      />

      <TouchableOpacity style={styles.button} onPress={handlePostContent}>
        <Text style={styles.buttonText}>Post Content</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 16,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#007BFF',
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 4,
    marginBottom: 16,
    resizeMode: 'cover',
  },
});

export default PostContentScreen;
