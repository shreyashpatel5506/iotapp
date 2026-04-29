import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../screens/DashboardScreen';
import { AlertScreen } from '../screens/AlertScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { NotificationScreen } from '../screens/NotificationScreen';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { data } = useRealtimeData();
  const navigationRef = useRef(null);

  // Auto redirection handled by blocking modal in DashboardScreen
  useEffect(() => {
    // Redirection disabled
  }, [data.status]);


  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen 
          name="Alert" 
          component={AlertScreen} 
          options={{ gestureEnabled: false }} // Cannot swipe back from danger
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
