import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Pressable } from "react-native";
// import BAIndoorMapGeoJSON from "../assets/geojson/BA_Indoor_1_room.json";
import buildingStyles from "../styles/building";
import {useSelector, useDispatch} from 'react-redux';
import MapboxGL from "@rnmapbox/maps";

const BA_1_Room = require("../assets/geojson/BA_Indoor_1_room.json");
const BA_1_Contour = require("../assets/geojson/BA_Indoor_1_contour.json");
const BA_2_Room = require("../assets/geojson/BA_Indoor_2_room.json");
const BA_2_Contour = require("../assets/geojson/BA_Indoor_2_contour.json");



const renderGeojsonFiles = () => {

  filterForContour = useSelector(store=>store.Filter.filter)[0]
  filterForIndoorbuilding = useSelector(store=>store.Filter.filter)[1]


  return (

    <>
    
    <MapboxGL.ShapeSource
      id="BA_1_Contour"
      shape={BA_1_Contour}
      >

      <MapboxGL.FillExtrusionLayer
          id="BA_1_Contour"
          // filter={useSelector(store=>store.Filter.filter)[0]}
          style={buildingStyles.Contour}
      />
    </MapboxGL.ShapeSource>

    <MapboxGL.ShapeSource
      id="BA_1_Room"
      shape={BA_1_Room}
      >

      <MapboxGL.FillExtrusionLayer
          id="BA_1_Room"
          // filter={useSelector(store=>store.Filter.filter)[0]}
          style={buildingStyles.IndoorBuilding}
      />
    </MapboxGL.ShapeSource>

    <MapboxGL.ShapeSource
      id="BA_2_Contour"
      shape={BA_2_Contour}
      >

      <MapboxGL.FillExtrusionLayer
          id="BA_2_Contour"
          // filter={useSelector(store=>store.Filter.filter)[0]}
          style={buildingStyles.Contour}
      />
    </MapboxGL.ShapeSource>

    <MapboxGL.ShapeSource
      id="BA_2_Room"
      shape={BA_2_Room}
      >

      <MapboxGL.FillExtrusionLayer
          id="BA_2_Room"
          // filter={useSelector(store=>store.Filter.filter)[0]}
          style={buildingStyles.IndoorBuilding}
      />
    </MapboxGL.ShapeSource>


    </>
  );
};

export default renderGeojsonFiles;



