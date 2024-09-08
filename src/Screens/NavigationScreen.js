import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Auth from '@react-native-firebase/auth'; // Import Firebase Auth

import EsportsPlayerMain from './Player/EsportsPlayer';
import BgmiMain from './Bgmi/BgmiMain';
import Sentivity from './Player/Goblin/Sentivity';
import ControverseyMain from './Controversey/ControverseyMain';
import ValorantMain from './Valorant/ValorantMain';
import JobsMain from './Jobs/JobsMain';
import Control from './Player/Goblin/Control';
import LoginScreen from './User/LoginScreen';
import SignUpScreen from './User/SignUpScreen';
import HomeScreen from './HomeScreen';
import Goblin from './Player/Goblin/Goblin';
import AccountMain from './Account/AccountMain';
import Achievement from './Player/Goblin/Achivement';
import Jonathan from './Player/Jonathan/Jonathan';
import Achievement1 from './Player/Jonathan/Achievement';
import Sentivity1 from './Player/Jonathan/Sentivity1';
import Nakul from './Player/Nakul/Nakul';
import Achievement2 from './Player/Nakul/Achievement2';
import Sentivity2 from './Player/Nakul/Sentivity2';
import Control2 from './Player/Nakul/Control2';
import Rony from './Player/Rony/Rony';
import Achievement3 from './Player/Rony/Achievement3';
import Sentivity3 from './Player/Rony/Sentivity3';
import Control3 from './Player/Rony/Control3';
import ReelsMain from './Reels/ReelsMain';
import PrivacyPolicy from './Account/PrivacyPolicy';
import AboutScreen from './Account/About';
import RankingScreen from './Account/RankingSystem';
import PostContentScreen from './AdminAcess/PostContentScreen';

const Stack = createNativeStackNavigator();
const TopTab = createMaterialTopTabNavigator();
const BottomTab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

const GoblinTabs = () => (
  <TopTab.Navigator
    swipeEnabled={true}
    screenOptions={{
      tabBarLabelStyle: { fontSize: wp('2.5%') },
      tabBarItemStyle: { width: wp('30%') },
      tabBarScrollEnabled: true,
    }}
  >
    <TopTab.Screen name="GoblinProfile" component={Goblin} options={{ title: 'Profile' }} />
    <TopTab.Screen name="Achievements" component={Achievement} />
    <TopTab.Screen name="Sensitivity" component={Sentivity} />
    <TopTab.Screen name="Control" component={Control} />
  </TopTab.Navigator>
);

const jonyTabs = () => (
  <TopTab.Navigator
    swipeEnabled={true}
    screenOptions={{
      tabBarLabelStyle: { fontSize: wp('2.5%') },
      tabBarItemStyle: { width: wp('30%') },
      tabBarScrollEnabled: true,
    }}
  >
    <TopTab.Screen name="JonyProfile" component={Jonathan} options={{ title: 'Profile' }} />
    <TopTab.Screen name="Achievements" component={Achievement1} />
    <TopTab.Screen name="Sensitivity" component={Sentivity1} />
    <TopTab.Screen name="Control" component={Control} />
  </TopTab.Navigator>
);

const NakulTabs = () => (
  <TopTab.Navigator
    swipeEnabled={true}
    screenOptions={{
      tabBarLabelStyle: { fontSize: wp('2.5%') },
      tabBarItemStyle: { width: wp('30%') },
      tabBarScrollEnabled: true,
    }}
  >
    <TopTab.Screen name="NakulProfile" component={Nakul} options={{ title: 'Profile' }} />
    <TopTab.Screen name="Achievements" component={Achievement2} />
    <TopTab.Screen name="Sensitivity" component={Sentivity2} />
    <TopTab.Screen name="Control" component={Control2} />
  </TopTab.Navigator>
);

const RonyTabs = () => (
  <TopTab.Navigator
    swipeEnabled={true}
    screenOptions={{
      tabBarLabelStyle: { fontSize: wp('2.5%') },
      tabBarItemStyle: { width: wp('30%') },
      tabBarScrollEnabled: true,
    }}
  >
    <TopTab.Screen name="RonyProfile" component={Rony} options={{ title: 'Profile' }} />
    <TopTab.Screen name="Achievements" component={Achievement3} />
    <TopTab.Screen name="Sensitivity" component={Sentivity3} />
    <TopTab.Screen name="Control" component={Control3} />
  </TopTab.Navigator>
);

const MainTabs = () => (
  <BottomTab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconComponent;
        switch (route.name) {
          case "Home":
            iconComponent = <AntDesign name="home" size={size} color={color} />;
            break;
          case "Jobs":
            iconComponent = <FontAwesome name="briefcase" size={size} color={color} />;
            break;
            case "Reels":
            iconComponent = <MaterialCommunityIcons name="motion-play" size={size+13} color={color} />;
            break;
          case "Account":
            iconComponent = <EvilIcons name="user" size={size+13} color={color} />;
            break;
          default:
            iconComponent = null;
        }
        return iconComponent;
      },
      tabBarLabelStyle: {
        fontSize: wp('3%'),
      },
      tabBarStyle: {
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        paddingBottom: 2,
      },
      headerShown: false,
      activeTintColor: "blue",
      inactiveTintColor: "black",
    })}
  >
    <BottomTab.Screen name="Home" component={HomeScreen} />
    <BottomTab.Screen name="Reels" component={ReelsMain} />
    <BottomTab.Screen name="Jobs" component={JobsMain} />
    <BottomTab.Screen name="Account" component={AccountMain} />
  </BottomTab.Navigator>
);

const NavigationScreen = () => {
  const [isUserLogin, setIsUserLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = Auth().onAuthStateChanged(user => {
      setIsUserLogin(user !== null);
    });

    return unsubscribe; // Clean up subscription on unmount
  }, []);
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isUserLogin ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="PLAYER" component={EsportsPlayerMain} />
            <Stack.Screen name="Goblin" component={GoblinTabs} options={{ title: 'Goblin' }} />
            <Stack.Screen name="BGMI" component={BgmiMain} />
            <Stack.Screen name="CONTROVERSY" component={ControverseyMain} />
            <Stack.Screen name="Global" component={ValorantMain} />
            <Stack.Screen name="Jonathan" component={jonyTabs} options={{ title: 'Jonathan' }} />
            <Stack.Screen name="Nakul" component={NakulTabs} options={{ title: 'Nakul' }} />
            <Stack.Screen name="Rony" component={RonyTabs} options={{ title: 'Rony' }} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="Ranking System" component={RankingScreen} />  
            <Stack.Screen name="PostContentScreen" component={PostContentScreen} />  
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationScreen;












