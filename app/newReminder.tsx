// React imports
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';
import type { Subscription } from 'expo-sensors/build/Pedometer';

// Expo imports
import * as Location from 'expo-location';

// Local imports
import Card from '../components/Card';
import { useNavigation } from '@react-navigation/native';

function NewReminderTab() {
  // Initialisation
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lon, setLon] = useState<number | undefined>(undefined);
  const [accelX, setAccelX] = useState<number | undefined>(undefined);
  const [accelY, setAccelY] = useState<number | undefined>(undefined);
  const [accelZ, setAccelZ] = useState<number | undefined>(undefined);
  var locationGranted : boolean = false;

  // Define accelerometer reading behavior, read every 200ms
  useEffect(() => {
    const motionSub : Subscription = DeviceMotion.addListener(function (motion : DeviceMotionMeasurement) {
      setAccelX(motion.acceleration?.x);
      setAccelY(motion.acceleration?.y);
      setAccelZ(motion.acceleration?.z);
      // console.log(`X: ${motion.acceleration?.x}`);
      // console.log(`Y: ${motion.acceleration?.y}`);
      // console.log(`Z: ${motion.acceleration?.z}`);
      console.log(motion);
    });
    DeviceMotion.setUpdateInterval(200);
    return () => {console.log("Navigated away, stopping DeviceMotion listener..."), motionSub.remove()};
  }, []);

  // Define location listener, read every 200ms
  useEffect(() => {
    const toggle = setInterval(() => {
      (async () => {
      
        // Get location permission.
        if (!locationGranted) {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Location denied', 'Permission to access location was denied');
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
    return () => {
      console.log("Navigated away, stopping Location listener...");
      clearInterval(toggle);
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <View>
          <Text>Lat:</Text>
          <Text>{(lat !== Number(0.00000000)) ? lat : ""}</Text>
          <Text>Lon:</Text>
          <Text>{(lon !== Number(0.00000000)) ? lon : ""}</Text>
        </View>
      </Card>
      <Card>
        <View>
          <Text>Acceleration</Text>
          <Text>X:</Text>
          <Text>{accelX}</Text>
          <Text>Y:</Text>
          <Text>{accelY}</Text>
          <Text>Z:</Text>
          <Text>{accelZ}</Text>

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