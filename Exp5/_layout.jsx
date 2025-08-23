import { Tabs } from "expo-router"
import { useColorScheme } from "react-native"
import { Colors } from "../../constants/Colors"
import { Ionicons } from "@expo/vector-icons"

import { useUser } from '../../hooks/useUser'

import UserOnly from "../../components/auth/UserOnly"

export default function Layout() {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light
  const { user } = useUser()

  return (
    <UserOnly>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { 
            backgroundColor: '#141820ff', // Dark gray background
            paddingTop: 10, 
            height: 90 
          },
          tabBarActiveTintColor: Colors.primary, // Orange color for active
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)', // Light gray for inactive
        }}
      >
        <Tabs.Screen 
          name="homepage"
          options={{ 
            title: "Homepage", 
            tabBarIcon: ({ focused }) => (
              <Ionicons 
                size={24} 
                name={focused ? 'home' : 'home-outline'} 
                color={focused ? Colors.primary : 'rgba(255, 255, 255, 0.6)'} 
              />
            )
          }}
        />
        <Tabs.Screen 
          name="myInternships"
          options={{ 
            title: "Create", 
            tabBarIcon: ({ focused }) => (
              <Ionicons 
                size={24} 
                name={focused ? 'create': 'create-outline'} 
                color={focused ? Colors.primary : 'rgba(255, 255, 255, 0.6)'} 
              />
            )
          }} 
        />
        <Tabs.Screen 
          name="applicants"
          options={{ 
            title: "Applicants", 
            tabBarIcon: ({ focused }) => (
              <Ionicons 
                size={24} 
                name={focused ? 'people': 'people-outline'} 
                color={focused ? Colors.primary : 'rgba(255, 255, 255, 0.6)'} 
              />
            )
          }} 
        />
      </Tabs>
    </UserOnly>
  )
}
