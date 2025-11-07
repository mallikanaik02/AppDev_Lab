import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '../contexts/AuthContext';

import HomeScreen from '../screens/main/HomeScreen';
import ReceptifyVIPScreen from '../screens/main/vip/ReceptifyVIPScreen';
import CustomDrawerContent from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

const HomeDrawerNavigator = () => {
  const { profile } = useAuth();
  const isVIP = profile?.premium;

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: '#000' },
      }}
    >
      <Drawer.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Home' }} />
      {isVIP && (
        <Drawer.Screen
          name="ReceptifyVIP"
          component={ReceptifyVIPScreen}
          options={{ title: 'Receptify VIP' }}
        />
      )}
    </Drawer.Navigator>
  );
};

export default HomeDrawerNavigator;
