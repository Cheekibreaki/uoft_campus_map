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
const BA_3_Room = require("../assets/geojson/BA_Indoor_3_room.json");
const BA_3_Contour = require("../assets/geojson/BA_Indoor_3_contour.json");
import cloneDeep from 'lodash/cloneDeep';
import fs from 'react-native-fs'





const renderGeojsonFiles = () => {

  const [geojsonData, setGeojsonData] = useState(null);
  let floorNumber = useSelector(store=>store.Filter.filter)[0];
  let filterforContour = useSelector(store=>store.Filter.filter)[1];
  let filterForIndoorRoom= useSelector(store=>store.Filter.filter)[2];
  
  const numContourStyles = 3;
  let layerStyles = {};

  for (let i = 1; i <= numContourStyles; i++) {   
    const contourStyles = cloneDeep(buildingStyles.Contour);
    const layerId = `BA_${i}_Contour`;

    layerStyles[layerId] = {
      style: contourStyles,
    };

  }

  const getBuildingContourStyle = (floorNumber,layerStyles) => {
    const layerIds = ['BA_1_Contour', 'BA_2_Contour', 'BA_3_Contour'];
    let defaultOpacity = 0.2;

    for (let i = 0; i < layerIds.length; i++) {
      const layerId = layerIds[i];
      const opacity = floorNumber === i + 1 ? 1 : defaultOpacity;
      layerStyles[layerId].style.fillExtrusionOpacity = opacity;
    }

    // console.log("layerStyles is ", layerStyles);
    return layerStyles;
    
  };

  
  let contourStyles = getBuildingContourStyle(floorNumber,layerStyles);

  useEffect(() => {
    fs.readFile(fs.DocumentDirectoryPath+ '/BA_Indoor_1_room.json', 'utf8')
        .then((fileData) => {
          // Parse the JSON data into a GeoJSON object
          const geoJsonObject = JSON.parse(fileData);
          // console.log('Parsed GeoJSON Object:', geoJsonObject);
          // Now you can work with the GeoJSON object
          setGeojsonData(geoJsonObject)
         
        })
        .catch((err) => {
          console.log('Error reading JSON file:', err);
        });

  }, []);
  

  return (

    <>
    {geojsonData && (
      <>
      <MapboxGL.ShapeSource
      id="BA_1_Contour"
      shape={BA_1_Contour}
      >

      <MapboxGL.FillExtrusionLayer
          id="BA_1_Contour"
          filter={filterforContour}
          style={contourStyles['BA_1_Contour'].style}
      />
    </MapboxGL.ShapeSource>

    <MapboxGL.ShapeSource
      id="BA_1_Room"
      //shape={GeoJsonFiles.get("BA_Indoor_1_room")}
      //shape = {BA_1_Room}
      shape = {geojsonData}
      >

      <MapboxGL.FillExtrusionLayer
          id="BA_1_Room"
          filter={filterForIndoorRoom}
          style={buildingStyles.IndoorBuilding}
      />
    </MapboxGL.ShapeSource>

    <MapboxGL.ShapeSource
      id="BA_2_Contour"
      shape={BA_2_Contour}
      >

      <MapboxGL.FillExtrusionLayer
          id="BA_2_Contour"
          filter={filterforContour}
          style={contourStyles['BA_2_Contour'].style}
      />
    </MapboxGL.ShapeSource>

    <MapboxGL.ShapeSource
      id="BA_2_Room"
      shape={BA_2_Room}
      >

      <MapboxGL.FillExtrusionLayer
          id="BA_2_Room"
          filter={filterForIndoorRoom}
          style={buildingStyles.IndoorBuilding}
      />
    </MapboxGL.ShapeSource>

    <MapboxGL.ShapeSource
      id="BA_3_Contour"
      shape={BA_3_Contour}
      >

      <MapboxGL.FillExtrusionLayer
          id="BA_3_Contour"
          filter={filterforContour}
          style={contourStyles['BA_3_Contour'].style}
      />
    </MapboxGL.ShapeSource>



    <MapboxGL.ShapeSource
      id="BA_3_Room"
      shape={BA_3_Room}
      >

      <MapboxGL.FillExtrusionLayer
          id="BA_3_Room"
          filter={filterForIndoorRoom}
          style={buildingStyles.IndoorBuilding}
      />
    </MapboxGL.ShapeSource>
      </>
    )}
    



    </>
  );
};

export default renderGeojsonFiles;



