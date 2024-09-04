// React imports
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import type { Subscription } from 'expo-sensors/build/Pedometer';

// Expo imports
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';

// Local imports
import Card from '../components/Card';
import { useNavigation } from '@react-navigation/native';

// Notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function stdDeviation(arr : Array<number>) : number {
  const n = arr.length
  const avg = arr.reduce((a, b) => a + b) / n
  return Math.sqrt(arr.map(x => Math.pow(x - avg, 2)).reduce((a, b) => a + b) / n)
}

function NewReminderTab() {
  // Stateful variables
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lon, setLon] = useState<number | undefined>(undefined);
  const [accelX, setAccelX] = useState<number | undefined>(undefined);
  const [accelY, setAccelY] = useState<number | undefined>(undefined);
  const [accelZ, setAccelZ] = useState<number | undefined>(undefined);
  const [avgPastReadings, setAvgPastReadings] = useState<number | undefined>(undefined);

  var locationGranted : boolean = false;

  var accelStdDeviations : Array<number> = new Array(11);
  var stdDeviationsHead : number = 0;
  var avgAccelVals : Array<number> = new Array(10);
  var accelValsHead : number = 0;
  var stoodUp : boolean = false;
  var startLat : number | undefined = undefined
  var startLon : number | undefined = undefined

  // Notification monitor
  useEffect(() => {
    const monitorForTriggers = setInterval(() => {
      // Check if latest std deviation is greater than 2 and others are less than 0.5
      // If so, flag user stood up
      // Essentially checks if ther was a sudden acceleration after very little movement for last 20s (motion sampled at 5hz)
      if (stdDeviationsHead === accelStdDeviations.length - 1  && accelStdDeviations[stdDeviationsHead] !== undefined) {
        console.log(accelStdDeviations);
        setAvgPastReadings(accelStdDeviations.slice(0, accelStdDeviations.length-2).reduce((a, b) => a+b)/accelStdDeviations.length);
        // console.log(`Avg: ${avgPastReadings}`)
        if (avgPastReadings! < 0.2 && (accelStdDeviations[stdDeviationsHead] > 0.5)) {
            console.log("Stood Up");
            Notifications.scheduleNotificationAsync({
              content: {
                title: "Stood Up!",
                body: "Detected user stood up",
              },
              trigger: null,
            });
            Alert.alert("Stood Up!", "Detected user stood up")
        }
      }
    }, 2000);
    return () => {clearInterval(monitorForTriggers)};
  }, []);

  // Define accelerometer reading behavior, read every 200ms
  useEffect(() => {
    const motionSub : Subscription = DeviceMotion.addListener(function (motion : DeviceMotionMeasurement) {
      setAccelX(motion.acceleration?.x);
      setAccelY(motion.acceleration?.y);
      setAccelZ(motion.acceleration?.z);
      // console.log(`X: ${motion.acceleration?.x}`);
      // console.log(`Y: ${motion.acceleration?.y}`);
      // console.log(`Z: ${motion.acceleration?.z}`);
      // console.log(motion);

      // Add acceleration values to array, if full - calculate standard deviation, add to std deviation array, then rest head
      var avgAccel : number = (Math.abs(motion.acceleration?.x!) + Math.abs(motion.acceleration?.y!) + Math.abs(motion.acceleration?.z!))/3;
      if (accelValsHead === avgAccelVals.length - 1) {
        avgAccelVals[accelValsHead] = avgAccel;
        if (stdDeviationsHead === accelStdDeviations.length - 1 && accelStdDeviations[stdDeviationsHead] === undefined) {
        // Special handling for first pass
        accelStdDeviations[stdDeviationsHead] = stdDeviation(avgAccelVals);
        } else if (stdDeviationsHead === accelStdDeviations.length - 1) {
          // Array full, shift left, add new value
          accelStdDeviations.shift();
          accelStdDeviations[stdDeviationsHead] = stdDeviation(avgAccelVals);
        } else {
          accelStdDeviations[stdDeviationsHead] = stdDeviation(avgAccelVals);
          stdDeviationsHead++;
        }
        accelValsHead = 0;
      } else {
        avgAccelVals[accelValsHead] = avgAccel;
        accelValsHead++;
      }

    });
    DeviceMotion.setUpdateInterval(200);
    return () => {console.log("Navigated away, stopping DeviceMotion listener..."), motionSub.remove()};
  }, []);

  // Define location listener, read every 200ms
  useEffect(() => {
    const pollLocation = setInterval(() => {
      (async () => {
        // if (!locationGranted) {
        //   let { status } = await Location.requestForegroundPermissionsAsync();
        //   if (status !== 'granted') {
        //     Alert.alert('Location denied', 'Permission to access location was denied');
        //     console.log('Location permission denied');
        //     return;
        //   } else {
        //     locationGranted = true;
        //     console.log('Location permission granted');
        //   }
        // }
        // Get and set location
        if (locationGranted) {
          let location = await Location.getCurrentPositionAsync({});
          setLat(location.coords.latitude);
          // console.log(`Lat: ${location.coords.latitude}`);
          setLon(location.coords.longitude);
          // console.log(`Lon: ${location.coords.longitude}`);
        }
      })();
    }, 200);
    return () => {
      console.log("Navigated away, stopping Location listener...");
      clearInterval(pollLocation);
    };
  }, []);

  // Get location permission.
  useEffect(() => {
    (async () => {
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
    })();
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
      <Card>
        <View>
          <Text>Avg Abs Acceleration (Last 20s):</Text>
          <Text>{(avgPastReadings !== Number(0.00000000)) ? avgPastReadings : ""}</Text>
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