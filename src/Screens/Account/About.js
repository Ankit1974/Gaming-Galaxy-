import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const AboutScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Welcome to GG+</Text>
      <Text style={styles.subHeader}>The ultimate destination for everything gaming and esports!</Text>
      
      <Text style={styles.sectionHeader}>❖  Stay Informed with Daily News</Text>
      <Text style={styles.text}>
        At GG+, we understand the importance of staying updated in the fast-paced world of gaming. Our team of dedicated journalists and industry insiders brings you the latest news every day. From groundbreaking game releases to pivotal updates and industry trends, GG+ ensures you never miss a beat. Whether you're a casual gamer or a hardcore enthusiast, our news section is your go-to source for accurate and timely information.
      </Text>
      
      <Text style={styles.sectionHeader}>❖  Dive into Viral Gaming Content</Text>
      <Text style={styles.text}>
        Gaming is more than just a hobby; it's a vibrant culture filled with exciting moments and viral phenomena. GG+ curates the most entertaining and shareable content from around the globe. Whether it's hilarious memes, jaw-dropping gameplay clips, or heartwarming community stories, our app provides a daily dose of the most engaging gaming content. Join the conversation and share your favorite finds with friends and fellow gamers.
      </Text>
      
      <Text style={styles.sectionHeader}>❖  Explore Job Listings in Esports and Gaming</Text>
      <Text style={styles.text}>
        Looking to break into the gaming industry or advance your career? GG+ offers an extensive job listings section tailored specifically for the esports and gaming sectors. Discover which companies are hiring and find opportunities that match your skills and aspirations. From game development to marketing and event management, our listings cover a wide range of roles within the industry, connecting talent with top employers.
      </Text>
      
      <Text style={styles.sectionHeader}>❖  Comprehensive Esports Data</Text>
      <Text style={styles.text}>
        For the esports aficionados, GG+ is an indispensable tool. Our app provides in-depth data on players, teams, and organizations, helping you stay informed and ahead of the game. Track your favorite players' stats, follow team standings, and gain insights into the competitive landscape. Whether you're a fan, analyst, or aspiring pro player, our comprehensive esports data section offers everything you need to stay on top of the competition.
      </Text>
      
      <Text style={styles.sectionHeader}>❖  Join the GG+ Community</Text>
      <Text style={styles.text}>
        GG+ is more than just an app; it's a community of passionate gamers and esports enthusiasts. Connect with like-minded individuals, share your thoughts, and participate in discussions about the latest in gaming. Our platform fosters a vibrant and inclusive environment where everyone can celebrate their love for gaming.
      </Text>
      
      <Text style={styles.footer}>Download GG+ today and immerse yourself in the gaming galaxy. Stay updated, get inspired, and be part of a community that lives and breathes gaming. GG+ - Your gateway to the gaming universe!</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: width * 0.05,
  },
  header: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  subHeader: {
    fontSize: width * 0.05,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: height * 0.05,
  },
  sectionHeader: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: height * 0.015,
  },
  text: {
    fontSize: width * 0.04,
    color: 'gray',
    marginBottom: height * 0.03,
    lineHeight: height * 0.04,
  },
  footer: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
    marginTop: height * 0.03,
  },
});

export default AboutScreen;
