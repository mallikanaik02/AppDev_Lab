import React from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useAuth } from '../contexts/AuthContext';

const CustomDrawerContent = (props) => {
  const { profile } = useAuth();
  const isVIP = profile?.premium;
  const { state, navigation } = props;
  const currentRoute = state.routeNames[state.index];

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: '#000' }}>
      <DrawerItem
        label="Home"
        labelStyle={{ color: currentRoute === 'HomeMain' ? '#1DB954' : '#fff' }}
        onPress={() => navigation.navigate('HomeMain')}
        focused={currentRoute === 'HomeMain'}
      />
      {isVIP && (
        <DrawerItem
          label="Receptify VIP"
          labelStyle={{ color: currentRoute === 'ReceptifyVIP' ? '#1DB954' : '#888', fontWeight: 'bold' }}
          onPress={() => navigation.navigate('ReceptifyVIP')}
          focused={currentRoute === 'ReceptifyVIP'}
        />
      )}
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
