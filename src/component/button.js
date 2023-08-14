import buttonStyles from "../styles/button";
import {ButtonGroup} from '@rneui/themed'
import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { View,Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import {useSelector, useDispatch} from 'react-redux';
import {setFilter} from '../redux/actions/setFilterAction';
import {setGeoJSON} from "../redux/actions/setGeoJsonAction";
import BA_2_Room from "../assets/geojson/BA_Indoor_2_room.json";
import BA_1_Room from "../assets/geojson/BA_Indoor_1_room.json";



function computeCenterLabelPosition(buildingName,points){

  if (points.length === 0) {
    return [];
  }
  let max0 = points[0][0];
  let max1 = points[0][1];
  let min0 = points[0][0];
  let min1 = points[0][1];
  for (let i = 1; i < points.length; i++) {
      if (points[i][0] > max0) {

      max0 = points[i][0];
      }
      if (points[i][1] > max1) {

        max1 = points[i][1];
      }
      if (points[i][0] < min0) {

        min0 = points[i][0];
      }
      if (points[i][1] < min1) {

        min1 = points[i][1];
      }
      

    
  }
  let building= {
    name: buildingName,
    center: [(max0 + min0) / 2, (max1 + min1) / 2]
  };

  return building;
}

function computeDistance(building, camera) {
  const [x1, y1] = building.center;
  const [x2, y2] = camera;

  const deltaX = x2 - x1;
  const deltaY = y2 - y1;

  const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

  return distance;
}


function getBuildingWithinBound(centerOfBuildings,cameraCenter,cameraBounds,featuresInScreen){
  let minimumDistance = Number.MAX_SAFE_INTEGER;
  let buildingName = "noBuilding";
  if(centerOfBuildings.length===0){
    return buildingName;
  }
  
  let FeatureNames = [];

  if(featuresInScreen !== null && Object.keys(featuresInScreen).length !== 0 && featuresInScreen.features !== null && featuresInScreen.features !== {}){
    const features = featuresInScreen.features;
    // console.log("featureInScreen is not empty")
    FeatureNames = (() => {
        
      let buildingNames = [];
      for (const feature of features) {
        if(!buildingNames.includes(feature.properties.layer_name.split("_")[0])){
          buildingNames.push(feature.properties.layer_name.split("_")[0]);
        }
        
      }
      // console.log(buildingNames);
      return buildingNames; // Return the updated state
    })();
  }

  // console.log("it has name ", FeatureNames)
  // console.log("before loop, building name is ", buildingName)
  // console.log("includes is ", FeatureNames.includes(centerOfBuildings[0].name.split("_")[0]))
  for(let i=0; i<centerOfBuildings.length;i++){
    if( (  centerOfBuildings[i].center[0] > cameraBounds.sw[0] 
        && centerOfBuildings[i].center[0] < cameraBounds.ne[0]
        && centerOfBuildings[i].center[1] > cameraBounds.sw[1]   
        && centerOfBuildings[i].center[1] < cameraBounds.ne[1])
        || FeatureNames.includes(centerOfBuildings[i].name.split("_")[0]) === true
      ){
          let distance = computeDistance(centerOfBuildings[i],cameraCenter);
          if(distance < minimumDistance){
            minimumDistance = distance;
            buildingName = centerOfBuildings[i].name;
          }
    }
  }
  
  return buildingName;
  
}

const BA_1_Contour = require("../assets/geojson/BA_Indoor_1_contour.json");

let centerOfBuildings = [];

//add the building here 
centerOfBuildings.push(computeCenterLabelPosition(BA_1_Contour.features[0].properties.layer_name,BA_1_Contour.features[0].geometry.coordinates[0]));
// console.log("the centerOfBuilding is ",centerOfBuildings);



const ButtonPanel = () => {

    let cameraCenter = useSelector(store=>store.MapState.mapState).properties.center;
    let cameraBounds = useSelector(store=>store.MapState.mapState).properties.bounds;
    let featuresInScreen = useSelector(store=>store.FeatureInScreen.GeoJSONInScreen);
    // console.log("features in the screen are ", featuresInScreen)
    let floorNumbers = [];

    if(cameraCenter!=[0,0]){
      
      let buildingForButton = getBuildingWithinBound(centerOfBuildings,cameraCenter,cameraBounds,featuresInScreen);

      if(buildingForButton !=="noBuilding"){       
        if(buildingForButton === "BA_Indoor_1_contour"){
          floorNumbers = ['B', 1, 2, 3, 4, 5, 6, 7, 8];
          // floorNumbers = floorNumbers.reverse()
        }        
      }
  
    }
    const dispatch = useDispatch();

    const handleButtonPress = (floorNumber) => {
        console.log(floorNumber);
        
        switch (floorNumber){
          case 1:
            dispatch(setGeoJSON(BA_1_Room));
            break
          case 2:
            dispatch(setGeoJSON(BA_2_Room));
            break
          default:
  
            }
        dispatch(setFilter([floorNumber,[],['==', 'floor', floorNumber.toString()]])); 
        // dispatch(setGeoJSON({}))
    };

    return (
      <View style={buttonStyles.buttonPanelContainer}>
      <ButtonGroup
      buttons={floorNumbers.reverse()}
      selectedIndex={floorNumbers.length -1 - useSelector(store=>store.Filter.filter)[0]}
      onPress={(value) => {
        console.log("floorNumber is ", value);

        handleButtonPress(floorNumbers.length -1 -value);
      }}
      containerStyle={{ marginBottom: 20,width:30 }}
      vertical = {true}
      />
      </View>

      // <View style={buttonStyles.buttonPanelContainer}>
      //   {floorNumbers.map((floorNumber) => (
      //     <TouchableOpacity 
      //     key={floorNumber} 
      //     style={buttonStyles.button}
      //     onPress={()=>handleButtonPress(floorNumber)}
      //     >
      //       <Text style={buttonStyles.buttonText}>{floorNumber}</Text>
            
      //     </TouchableOpacity>
      //   ))}
      // </View>
    );
  };

  export default ButtonPanel;