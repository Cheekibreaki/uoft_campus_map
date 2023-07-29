import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import BAIndoorMapGeoJSON from "../assets/geojson/BA_Indoor_1.json";
import buildingStyles from "../styles/building";
import {useSelector, useDispatch} from 'react-redux';
import MapboxGL from "@rnmapbox/maps";


const renderGeojsonFiles = () => {

  filterForContour = useSelector(store=>store.Filter.filter)[0]
  filterForIndoorbuilding = useSelector(store=>store.Filter.filter)[1]


  return (
    
    <MapboxGL.ShapeSource
      id="BAindoorBuildingSource"
      shape={BAIndoorMapGeoJSON}
      >

      <MapboxGL.FillExtrusionLayer
          id="Contour3DLayer"
          filter={useSelector(store=>store.Filter.filter)[0]}
          style={buildingStyles.Contour}
      />
      
      <MapboxGL.FillExtrusionLayer
          id="IndoorBuilding3DLayer"
          filter={useSelector(store=>store.Filter.filter)[1]}

          style={buildingStyles.IndoorBuilding}
      />
    </MapboxGL.ShapeSource>


  );
};

export default renderGeojsonFiles;



