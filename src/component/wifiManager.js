import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Pressable,PermissionsAndroid } from "react-native";
// import BAIndoorMapGeoJSON from "../assets/geojson/BA_Indoor_1_room.json";
import buildingStyles from "../styles/building";
import {useSelector, useDispatch} from 'react-redux';
import MapboxGL from "@rnmapbox/maps";
import WifiManaging from "react-native-wifi-reborn";

const WifiManager = () => {
    const [wifiList, setWifiList] = useState([]);
    
    const fetchWifiInfo = async () => {
        try {
          const wifiArray = await WifiManaging.loadWifiList();
          setWifiList(wifiArray);
      
        } catch (error) {
          console.error('Error fetching WiFi information:', error);
        }
      };

    useEffect(() => {

    const getpremission = async () => {
        let granted;
        try{
            granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                title: 'Location permission is required for WiFi connections',
                message:
                'This app needs location permission as this is required  ' +
                'to scan for wifi networks.',
                buttonNegative: 'DENY',
                buttonPositive: 'ALLOW',
                },
            );
        }finally{
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // You can now use react-native-wifi-reborn
            console.log('get the premission sucessfully!')
            dispatch(setWifiGrant(true))    
            }
        }
        
        
        }
        getpremission();

    // Fetch WiFi information when the component mounts
    fetchWifiInfo();

    // Optional: You can set up a timer to periodically refresh WiFi information
    const refreshInterval = setInterval(fetchWifiInfo, 10000); // Refresh every 10 seconds

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(refreshInterval);
    }, []);

    useEffect(()=>{
    console.log("WIFI IS: ",wifiList)
    },[wifiList])
};

export default WifiManager;

