// React imports
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DeviceMotion } from 'expo-sensors';

// Expo imports
import * as Location from 'expo-location';

// Third party imports
import axios from 'axios'; // <-- Remove this package & kson server

// Local imports
import Card from '../components/Card';

function deviceMotionCallback(devMotion : any) {
  console.log(devMotion);
}

function NewReminderTab() {
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [errMsg, setErrMsg] = useState(null);

  let locationGranted : boolean = false;

  DeviceMotion.addListener(deviceMotionCallback);

  // Define location reading behavior, read every 200ms
  useEffect(() => {
    const toggle = setInterval(() => {
      (async () => {
      
        if (!locationGranted) {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrMsg('Permission to access location was denied');
            console.log('Location permission denied');
            return;
          } else {
            locationGranted = true;
            console.log('Location permission granted');
          }
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLat(location.coords.latitude);
        console.log(`Lat: ${location.coords.latitude}`);
        setLon(location.coords.longitude);
        console.log(`Lon: ${location.coords.longitude}`);
      })();
    }, 200);
    return () => clearInterval(toggle);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <View>
          <Text>Lat:</Text>
          <Text>{lat}</Text>
          <Text>Lon:</Text>
          <Text>{lon}</Text>
        </View>
      </Card>
      <Card>
        <View>
          <Text>Lat:</Text>
          <Text>{lat}</Text>
          <Text>Lon:</Text>
          <Text>{lon}</Text>
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