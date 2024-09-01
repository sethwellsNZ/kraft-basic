// React imports
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';

// Expo imports
import * as Location from 'expo-location';

// Local imports
import Card from '../components/Card';

function NewReminderTab() {
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [errMsg, setErrMsg] = useState(null);

  let locationGranted : boolean = false;

  // Define location reading behavior, read every 100ms
  useEffect(() => {
    const toggle = setInterval(() => {
      (async () => {
      
        if (!locationGranted) {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrMsg('Permission to access location was denied');
            return;
          } else {
            locationGranted = true;
          }
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLat(location.coords.latitude);
        console.log(`Lat: ${location.coords.latitude}`);
        setLon(location.coords.longitude);
        console.log(`Lon: ${location.coords.longitude}`);
      })();
    }, 100);
    return () => clearInterval(toggle);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <View style={styles.cardContent}>
          <Text>Lat:</Text>
          <TextInput value={lat}/>
          <Text>Lon:</Text>
          <TextInput value={lon}/>
        </View>
      </Card>
    </ScrollView>
  );
}

NewReminderTab.navigationOptions = ({ navigation }) => ({
  title: 'New Reminder',
  headerTitle: 'New Reminder',
  headerBackTitle: 'Back',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  // cardContent: {
  //   flex: 1,
  //   justifyContent: 'flex-start',
  //   alignItems: 'stretch',
  // }
});

export default NewReminderTab;