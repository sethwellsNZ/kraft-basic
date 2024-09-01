// React Native imports
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Expo imports
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Local imports
import BottomTabLayout from './bottomTabNavigator';
import NewReminderTab from './newReminder';

const Stack = createNativeStackNavigator();

export default function TabLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="bottomTabNavigator" component={BottomTabLayout} options={{ headerShown: false }} />
      <Stack.Screen name="newReminder" component={NewReminderTab} options={NewReminderTab.navigationOptions} />
    </Stack.Navigator>
  );
}

export default TabLayout;