/**
 * MainNavigator
 * Root navigation with custom capsule tab bar and stack screens
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { CapsuleNavBar } from '@/components/navigation/CapsuleNavBar';

// Tab Screens
import { HomeScreen } from '@/screens/home/HomeScreen';
import { ExploreScreen } from '@/screens/explore/ExploreScreen';
import { LiveScreen } from '@/screens/live/LiveScreen';
import { TicketsScreen } from '@/screens/tickets/TicketsScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';

// Stack Screens
import { ConcertDetailScreen } from '@/screens/concert/ConcertDetailScreen';
import { BecomeProScreen } from '@/screens/auth/BecomeProScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator: React.FC = () => {
  return (
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
  );
};

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
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen
          name="ConcertDetail"
          component={ConcertDetailScreen}
          options={{
            animation: 'slide_from_bottom',
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="BecomePro"
          component={BecomeProScreen}
          options={{
            animation: 'slide_from_bottom',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
