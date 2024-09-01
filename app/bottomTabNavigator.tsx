// React Native imports
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Expo imports
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Local imports
import BuildTab from './build';
import HomeTab from './home';
import SettingsTab from './settings';
import NewReminderTab from './newReminder';

const Tab = createBottomTabNavigator();

export default function BottomTabLayout() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="home"
        component={HomeTab}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tab.Screen
       name="build"
       component={BuildTab}
       options={BuildTab.navigationOptions}
      />
      <Tab.Screen
        name="settings"
        component={SettingsTab}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabLayout;