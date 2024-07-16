import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
    <TopTab.Screen name="Achievement" component={Achievement} />
    <TopTab.Screen name="Sentivity" component={Sentivity} />
    <TopTab.Screen name="Control" component={Control} />
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
            <Stack.Screen name="CONTROVERSEY" component={ControverseyMain} />
            <Stack.Screen name="VALORANT" component={ValorantMain} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationScreen;
