import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { Slider } from "@rneui/base";
import { Position } from "geojson";
import { Camera, Logger, MapView, MarkerView } from '@rnmapbox/maps';
import sheet from "../styles/sheet";
import colors from "../styles/colors";
import indoorMapGeoJSON from "../assets/indoor_3d_map.json";
import Page from "../common/Page";
import BaseExamplePropTypes from "../common/BaseExamplePropTypes";
import {useSelector} from 'react-redux';
import {setGeoJSON} from '../redux/actions/getGeoJsonAction';

const IndoorLabel = () => {
  const selectedGeoJSON = useSelector((store)=>store.GeoJSONs.selectedGeoJSON);
  console.log("selectedGeoJson",selectedGeoJSON);
};
export default IndoorLabel

