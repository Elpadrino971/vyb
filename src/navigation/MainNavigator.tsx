/**
 * MainNavigator
 * Root navigation with custom capsule tab bar
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppTheme } from '@/hooks/useTheme';
import { CapsuleNavBar } from '@/components/navigation/CapsuleNavBar';

// Screens
import { HomeScreen } from '@/screens/home/HomeScreen';
import { SearchScreen } from '@/screens/search/SearchScreen';
import { LiveScreen } from '@/screens/live/LiveScreen';
import { TicketsScreen } from '@/screens/tickets/TicketsScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export const MainNavigator: React.FC = () => {
  const theme = useAppTheme();

  return (
    <NavigationContainer
      theme={{
        dark: Boolean(theme.isDark),
        colors: {
          primary: String(theme.colors.primary),
          background: String(theme.colors.background),
          card: String(theme.colors.card),
          text: String(theme.colors.text),
          border: String(theme.colors.border),
          notification: String(theme.colors.red),
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
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Live" component={LiveScreen} />
        <Tab.Screen name="Tickets" component={TicketsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
