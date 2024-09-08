import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RankingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.comingSoonText}>Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  comingSoonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black', // Adjust the text color as needed
  },
});

export default RankingScreen;
