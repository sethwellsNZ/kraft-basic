import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

function BuildTab() {
  return (
    <View style={styles.container}>
        <Text>Build Screen</Text>
    </View>
  );
}

BuildTab.navigationOptions = ({ navigation }) => ({
  title: 'Build',
  tabBarIcon: ({ color }) => <FontAwesome size={28} name="code" color={color} />,
  headerRight: ({ color }) => (
    <View>
    <TouchableOpacity
      onPress={() => {navigation.navigate('newReminder')}}
      style={{ marginRight: 15 }}
    >
      <Text style={{ fontSize: 30, color: color }}>+</Text>
    </TouchableOpacity>
    </View>
  ),
  headerTitle: 'Build',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BuildTab;