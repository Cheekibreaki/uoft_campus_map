import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Pressable } from "react-native";
// import BAIndoorMapGeoJSON from "../assets/geojson/BA_Indoor_1_room.json";
import buildingStyles from "../styles/building";
import {useSelector, useDispatch} from 'react-redux';
import MapboxGL from "@rnmapbox/maps";

// const BA_1_Room = require("../assets/geojson/BA_Indoor_1_room.json");
// const BA_1_Contour = require("../assets/geojson/BA_Indoor_1_contour.json");
// const BA_2_Room = require("../assets/geojson/BA_Indoor_2_room.json");
// const BA_2_Contour = require("../assets/geojson/BA_Indoor_2_contour.json");
// const BA_3_Room = require("../assets/geojson/BA_Indoor_3_room.json");
// const BA_3_Contour = require("../assets/geojson/BA_Indoor_3_contour.json");

import cloneDeep from 'lodash/cloneDeep';
import fs from 'react-native-fs'

const renderGeojsonFiles = () => {
  //const [geojsonData, setGeojsonData] = useState(null);
  const  [geojsonRoomFiles,setGeojsonRoomFiles] = useState(null)
  const  [geojsonContourFiles,setGeojsonContourFiles] = useState(null)
  let floorNumber = useSelector(store=>store.Filter.filter)[0];
  let filterforContour = useSelector(store=>store.Filter.filter)[1];
  let filterForIndoorRoom= useSelector(store=>store.Filter.filter)[2];
  
  const numContourStyles = 7;
  let layerStyles = {};

  for (let i = 1; i <= numContourStyles; i++) {   
    const contourStyles = cloneDeep(buildingStyles.Contour);
    const layerId = `BA_${i}_Contour`;

    layerStyles[layerId] = {
      style: contourStyles,
    };

  }

  console.log("floor number is ", floorNumber);
  const getBuildingContourStyle = (floorNumber,layerStyles) => {
    //TODO: 
    // add one more parameters
    // replaced by realm
    // should have all the 

    // get all the floor indicies of first builidng name from realm
    // for loop
    
    const layerIds = ['BA_1_Contour', 'BA_2_Contour', 'BA_3_Contour','BA_4_Contour','BA_5_Contour','BA_6_Contour','BA_7_Contour'];
    let defaultOpacity = 0.2;

    for (let i = 0; i < layerIds.length; i++) {
      if( i!=3 || i !=5){
        const layerId = layerIds[i];
        const opacity = floorNumber === i + 1 ? 1 : defaultOpacity;
        layerStyles[layerId].style.fillExtrusionOpacity = opacity;
      }
     
    }

    // console.log("layerStyles is ", layerStyles);
    return layerStyles;
    
  };

  
  let contourStyles = getBuildingContourStyle(floorNumber,layerStyles);

  useEffect(() => {

    const geojsonFileRoomNames = ['BA_Indoor_1_room.json', 'BA_Indoor_2_room.json', 'BA_Indoor_3_room.json','BA_Indoor_5_room.json','BA_Indoor_7_room.json'];
    const geojsonFileContourNames = ['BA_Indoor_1_contour.json', 'BA_Indoor_2_contour.json', 'BA_Indoor_3_contour.json','BA_Indoor_5_contour.json','BA_Indoor_7_contour.json'];

    const geojsonPromises = geojsonFileRoomNames.map(async (fileName) => {
      const filePath = fs.DocumentDirectoryPath + '/' + fileName;

      return fs.readFile(filePath, 'utf8')
        .then((fileData) => JSON.parse(fileData))
        .catch((err) => {
          console.log(`Error reading JSON file ${fileName}:`, err);
          return null; 
        });
    });

    const geojsonPromisesContour = geojsonFileContourNames.map(async (fileName) => {
      const filePath = fs.DocumentDirectoryPath + '/' + fileName;

      return fs.readFile(filePath, 'utf8')
        .then((fileData) => JSON.parse(fileData))
        .catch((err) => {
          console.log(`Error reading JSON file ${fileName}:`, err);
          return null; 
        });
    });


    Promise.all(geojsonPromises).then((parsedGeojsonFiles) => {
      setGeojsonRoomFiles(parsedGeojsonFiles); 
    });

    Promise.all(geojsonPromisesContour).then((parsedGeojsonFiles) => {
      setGeojsonContourFiles(parsedGeojsonFiles); 
    });

  }, []);
  
  const specificValues = [1, 2, 3, 5, 7];

  return (

    <>
 
    
    {geojsonRoomFiles && geojsonRoomFiles.map((geojsonData, index) => (
      <MapboxGL.ShapeSource 
        id={`BA_${index+1}_Room`} 
        key = {index}
        shape={geojsonData}
      >
        <MapboxGL.FillExtrusionLayer
          id={`BA_${index+1}_Room`}
          filter={filterForIndoorRoom}
          style={buildingStyles.IndoorBuilding}
        />
      </MapboxGL.ShapeSource>
    ))}
    {geojsonContourFiles && geojsonContourFiles.map((geojsonData, index) => (
      <MapboxGL.ShapeSource 
        id={`BA_${index+1}_Contour`} 
        key = {index}
        shape={geojsonData}
      >
        <MapboxGL.FillExtrusionLayer
          id={`BA_${index+1}_Contour`}
          filter={filterforContour}
          style={contourStyles[`BA_${specificValues[index]}_Contour`].style}
        />
      </MapboxGL.ShapeSource>
    ))}

    </>
  );
};

export default renderGeojsonFiles;



