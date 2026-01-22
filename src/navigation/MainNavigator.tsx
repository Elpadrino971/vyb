/**
 * MainNavigator
 * Root navigation with custom capsule tab bar
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/hooks/useTheme';
import { CapsuleNavBar } from '@/components/navigation/CapsuleNavBar';

// Screens
import { HomeScreen } from '@/screens/home/HomeScreen';
import { ExploreScreen } from '@/screens/explore/ExploreScreen';
import { LiveScreen } from '@/screens/live/LiveScreen';
import { TicketsScreen } from '@/screens/tickets/TicketsScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export const MainNavigator: React.FC = () => {
  const { theme, isDark } = useTheme();

  // Force boolean type for React Native Fabric
  const isDarkMode: boolean = isDark === true;

  return (
    <NavigationContainer
      theme={{
        dark: isDarkMode,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.card,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.red,
        },
      }}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => {
          const { state, navigation } = props;
          const activeRoute = state.routes[state.index].name.toLowerCase();

          return (
            <CapsuleNavBar
              activeRoute={activeRoute}
              onNavigate={(route) => {
                const routeName =
                  route.charAt(0).toUpperCase() + route.slice(1);
                navigation.navigate(routeName);
              }}
            />
          );
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Live" component={LiveScreen} />
        <Tab.Screen name="Tickets" component={TicketsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
