import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Pressable,PermissionsAndroid } from "react-native";
// import BAIndoorMapGeoJSON from "../assets/geojson/BA_Indoor_1_room.json";
import buildingStyles from "../styles/building";
import {useSelector, useDispatch} from 'react-redux';
import MapboxGL from "@rnmapbox/maps";
import WifiManaging from "react-native-wifi-reborn";

const WifiManager = async () => {
    
    const granted = useSelector(store=>store.IsWifiGranted.isGranted);
     
};

export default WifiManager;

