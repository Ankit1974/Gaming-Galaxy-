import React from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';

const PrivacyPolicy = () => {
  const { width, height } = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: width > 600 ? 40 : 20,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: width > 600 ? 30 : 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: 'black',
    },
    effectiveDate: {
      fontSize: width > 600 ? 18 : 14,
      color: 'gray',
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: width > 600 ? 22 : 18,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
      color: 'black',
    },
    paragraph: {
      fontSize: width > 600 ? 16 : 14,
      lineHeight: width > 600 ? 26 : 22,
      marginBottom: 18,
      color: 'gray',
    },
    highlight: {
      color: 'blue',
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.effectiveDate}>Effective Date: July 15, 2024</Text>
      <Text style={styles.paragraph}>
        Gaming Galaxy Plus ("GG+", "we", "us", or "our") respects the privacy of our users ("you" or "your"). This Privacy Policy describes the types of information we collect and receive through our mobile application (the "App") and how we use, disclose, transfer, and store that information.
      </Text>
      <Text style={styles.sectionTitle}>Information We Collect:</Text>
      <Text style={styles.paragraph}>
        <Text style={{ fontWeight: 'bold' }}>Personal Information:</Text> This is information that can be used to identify you as an individual. We collect the following Personal Information when you create an account on GG+:
      </Text>
      <Text style={styles.paragraph}>❖ Phone Number</Text>
      <Text style={styles.paragraph}>❖ Email address</Text>
      <Text style={styles.paragraph}>
        <Text style={{ fontWeight: 'bold' }}>Non-Personal Information:</Text> This is information that cannot be used to identify you as an individual. We collect the following Non-Personal Information:
      </Text>
      <Text style={styles.paragraph}>❖ Device information (device type, operating system, device identifier)</Text>
      <Text style={styles.paragraph}>❖ Usage data (how you use the App, the features you access, and the content you view)</Text>
      <Text style={styles.paragraph}>❖ Information collected by cookies and other tracking technologies</Text>
      <Text style={styles.sectionTitle}>How We Use Your Information:</Text>
      <Text style={styles.paragraph}>❖ Provide, operate, and maintain the App</Text>
      <Text style={styles.paragraph}>❖ Create your account and identify you on the App</Text>
      <Text style={styles.paragraph}>❖ Send you push notifications (with your consent)</Text>
      <Text style={styles.paragraph}>❖ Send you marketing communications (with your consent)</Text>
      <Text style={styles.paragraph}>❖ Respond to your inquiries and requests</Text>
      <Text style={styles.paragraph}>❖ Analyze how you use the App to improve our services</Text>
      <Text style={styles.paragraph}>❖ Personalize your experience on the App</Text>
      <Text style={styles.paragraph}>❖ Deliver targeted advertising (with your consent)</Text>
      <Text style={styles.paragraph}>❖ Comply with legal and regulatory requirements</Text>
      <Text style={styles.sectionTitle}>Sharing Your Information:</Text>
      <Text style={styles.paragraph}>
        We may share your information with third-party service providers who help us operate the App, such as data analytics providers and cloud storage providers. These service providers are contractually obligated to keep your information confidential and secure.
      </Text>
      <Text style={styles.paragraph}>
        We may also share your information with third-party advertisers who use Non-Personal Information to deliver targeted advertising to you. We do not share your Personal Information with advertisers without your consent.
      </Text>
      <Text style={styles.paragraph}>
        We may disclose your information if we are required to do so by law or in the good faith belief that such disclosure is necessary to comply with a court order, subpoena, or other legal process; to protect the rights or property of GG+; or to protect the safety of others.
      </Text>
      <Text style={styles.sectionTitle}>Cookies and Other Tracking Technologies:</Text>
      <Text style={styles.paragraph}>
        We use cookies and other tracking technologies to collect Non-Personal Information about your use of the App. Cookies are small data files that are stored on your device when you visit a website or use an app. They allow us to remember your preferences and track your activity on the App.
      </Text>
      <Text style={styles.paragraph}>
        We use the following types of cookies:
      </Text>
      <Text style={styles.paragraph}>❖ Essential Cookies: These cookies are necessary for the App to function properly.</Text>
      <Text style={styles.paragraph}>❖ Analytics Cookies: These cookies help us understand how you use the App and improve our services.</Text>
      <Text style={styles.paragraph}>❖ Advertising Cookies: These cookies are used to deliver targeted advertising to you.</Text>
      <Text style={styles.paragraph}>
        You can control your cookie preferences through your browser settings. However, disabling cookies may limit your ability to use certain features of the App.
      </Text>
      <Text style={styles.sectionTitle}>Children's Privacy:</Text>
      <Text style={styles.paragraph}>
        GG+ is not directed towards children under the age of 13. We do not knowingly collect Personal Information from children under 13. If you are a parent or guardian and you believe that your child has provided us with Personal Information, please contact us. We will delete the information from our servers.
      </Text>
      <Text style={styles.sectionTitle}>Data Security:</Text>
      <Text style={styles.paragraph}>
        We take reasonable measures to protect your information from unauthorized access, disclosure, alteration, or destruction. However, no security measures are perfect, and we cannot guarantee the security of your information.
      </Text>
      <Text style={styles.sectionTitle}>Your Rights:</Text>
      <Text style={styles.paragraph}>
        You have certain rights regarding your information, including:
      </Text>
      <Text style={styles.paragraph}>❖ The right to access your information</Text>
      <Text style={styles.paragraph}>❖ The right to rectify inaccurate information</Text>
      <Text style={styles.paragraph}>❖ The right to request the deletion of your information</Text>
      <Text style={styles.paragraph}>❖ The right to object to the processing of your information</Text>
      <Text style={styles.paragraph}>❖ The right to withdraw your consent (where applicable)</Text>
      <Text style={styles.paragraph}>
        To exercise your rights, please contact us at <Text style={styles.highlight}>GGPlusstaff@gmail.com</Text>.
      </Text>
      <Text style={styles.sectionTitle}>Changes to this Privacy Policy:</Text>
      <Text style={styles.paragraph}>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on the App.
      </Text>
      <Text style={styles.sectionTitle}>Contact Us:</Text>
      <Text style={styles.paragraph}>
        If you have any questions about this Privacy Policy, please contact us at <Text style={styles.highlight}>GGPlusstaff@gmail.com</Text>.
      </Text>
      <Text style={styles.paragraph}>
        By using the GG+ App, you acknowledge that you have read, understand, and agree to be bound by this Privacy Policy.
      </Text>
    </ScrollView>
  );
};

export default PrivacyPolicy;
