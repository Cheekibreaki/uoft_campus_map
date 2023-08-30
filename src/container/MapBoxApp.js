import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { Slider, Text} from "@rneui/base";
import { Position } from "geojson";
import { Camera, Logger, MapView, MarkerView } from '@rnmapbox/maps';
import colors from "../styles/colors";
import Page from "../common/Page";
import BaseExamplePropTypes from "../common/BaseExamplePropTypes";
import {useSelector, useDispatch} from 'react-redux';
import {setGeoJSON} from "../redux/actions/setGeoJsonAction";
import { setMapState } from "../redux/actions/setMapstateAction";
import IndoorLabel from '../component/IndoorLabel'
import ButtonPanel from "../component/button";
import GeojsonFiles from "../component/renderGeojsonFiles";
import { setIsCameraMoving } from "../redux/actions/setIsCameraMovingAction";
import { setGeoJSONInScreen } from "../redux/actions/setFeatureInScreen";
import { setSelectRoom } from "../redux/actions/setSelectedRoom";
MapboxGL.setAccessToken("pk.eyJ1IjoiamlwaW5nbGkiLCJhIjoiY2xoanYzaGZ1MGxsNjNxbzMxNTdjMHkyOSJ9.81Fnu3ho6z2u8bhS2yRJNA");

import BA_1_Room from "../assets/geojson/BA_Indoor_1_room.json";
import BA_2_Room from "../assets/geojson/BA_Indoor_2_room.json";
import BA_3_Room from "../assets/geojson/BA_Indoor_3_room.json";
import getGeoJSON from "../assets/dataBase/getGeoJSONFromRealm";
import SearchBar from "../component/searchBar";

import {
  BA_1_ContourLayerID,
  BA_1_RoomLayerID,
  BA_2_ContourLayerID,
  BA_2_RoomLayerID,
  BA_3_ContourLayerID,
  BA_3_RoomLayerID,
} from "../component/renderGeojsonFiles";


//Todo:
//Flickering issue => state update related
//Promise Rejection => queryRenderedFeaturesInRect @ onCameraChanged

const style = JSON.stringify(require('../assets/map-style.json'));

function computePointWithinRoom(givenRoom,cursorCoordinate) {
  if (givenRoom.length === 0) {
    return false;
  }
  var max0 = givenRoom[0][0];
  var max1 = givenRoom[0][1];
  var min0 = givenRoom[0][0];
  var min1 = givenRoom[0][1];
  for (let i = 1; i < givenRoom.length; i++) {
    
    if (givenRoom[i] != undefined) {
      if (givenRoom[i][0] > max0) {
        max0 = givenRoom[i][0];
      }
      if (givenRoom[i][1] > max1) {
        max1 = givenRoom[i][1];
      }
      if (givenRoom[i][0] < min0) {
        min0 = givenRoom[i][0];
      }
      if (givenRoom[i][1] < min1) {
        min1 = givenRoom[i][1];
      }
    }
  }
  // console.log("cursorCoordiante is ", cursorCoordinate)
  // console.log(`[${min0},${min1}]  [${max0},${max1}]`)
  if(cursorCoordinate.coordinates[0]<max0 &&
     cursorCoordinate.coordinates[1]<max1 &&
     cursorCoordinate.coordinates[0]>min0 &&
     cursorCoordinate.coordinates[1]>min1
    ){
      
      return true;
      
  }
 
  return false;
}



const MapBoxApp = (props: BaseExampleProps) => {
    const zoomLevel = 16;
    const pitch = 40;
    const heading = 30;
    const centerCoordinate = [-79.3973449417775, 43.65997911110146]
    
  
    let counter = 0
    
    let map = useRef();
    let camera = useRef();
    
    const dispatch = useDispatch();

    const selectedGeoJSON = useSelector(store=>store.GeoJSONs.selectedGeoJSON);
    // console.log("selectedGeoJSON",selectedGeoJSON);
    const mapState = useSelector(store=>store.MapState.mapState);
    
    // console.log("mapState",mapState);
    // const [selectedGeoJSON, setSelectedGeoJSON] = useState(null);
    const [allowOverlap, setAllowOverlap] = useState(false);
    
    const [mapInitialized, setMapInitialized] = useState(false);

    let selectedMarker = useSelector(store=>store.SelectRoom.selectRoom);
    let floorNumber = useSelector(store=>store.Filter.filter)[0]

    const onMapInitialized = () => {
      // This function is called when the map is fully initialized
      setMapInitialized(true);
    };

    useEffect(() => {
      // This function will be called only once when the component is mounted
      // You can place your initialization code here
      console.log('App initialized');
      
      getGeoJSON();
    }, []);

  const onPress = async (e) => {
    
    const { screenPointX, screenPointY } = e.properties;
    const cursorCoordinate = e.geometry;
    // console.log("the point's coordinate is ", cursorCoordinate.coordinates)
    // console.log("screenPointX, screenPointY", screenPointX, screenPointY)
    const featureCollection = await map.current.queryRenderedFeaturesAtPoint(
      [screenPointX, screenPointY],
      null,
      []
    );
    if (featureCollection && featureCollection.features && featureCollection.features.length) {
      // console.log(featureCollection)
      
      
      for (const feature of featureCollection.features) {

        // console.log("roomID is", feature)
        const geometry = feature.geometry;
        const roomID = feature.properties.room;
        
        // console.log(geometry.coordinates)
        const isWithinRoom = computePointWithinRoom(geometry.coordinates[0],cursorCoordinate)
        // console.log("is within the room",isWithinRoom)
        if (isWithinRoom === true) {

          let buildingName = selectedGeoJSON.name;
          if (buildingName !== null && buildingName !== undefined) {
            if(buildingName.split("_").includes("BA")){
            buildingName = "Bahen Centre for Information Technology"
          }
          }

          // console.log(selectedGeoJSON.features);
          dispatch(setSelectRoom({
            id: roomID,
            building: buildingName
          }));
          break;
        }
      }

      

    } else {
      
    }
  };



    const queryLayerFeatures = async () => {
        setIsCameraMoving(false);
       
        const featureCollection = await map.current.queryRenderedFeaturesInRect([], null, [
          // "false_name"
          "BA_1_Contour","BA_1_Room","BA_2_Contour","BA_2_Room"
        ]);

        if (featureCollection && featureCollection.features && featureCollection.features.length) {
            // setSelectedGeoJSON(featureCollection);

            dispatch(setGeoJSONInScreen(featureCollection));
        } else {
        // console.log("no Indoor Building Layer found");
        //setSelectedGeoJSON(null);
        dispatch(setGeoJSONInScreen({}));
        }
    };
    
    const avoid_queryLayerFeatures =  async() => {
      const zoomlevel = mapState.properties.zoom;
      console.log(zoomlevel)
      console.log("zoomlevel is ",floorNumber);
      if(zoomlevel >= 17){
      switch (floorNumber){
        case 1:
          dispatch(setGeoJSON(BA_1_Room));
          break
        case 2:
          dispatch(setGeoJSON(BA_2_Room));
          break
        case 3:
          dispatch(setGeoJSON(BA_3_Room));
          break
        default:

          }
      }else{
        dispatch(setGeoJSON({}));
        return;
      }
    }
     



    const renderGeojsonFiles = () =>{
      return (
        <GeojsonFiles/>
      );
    }
    const renderButtonPanel = () => {
      // Function to render IndoorLabel on the map
      if (mapInitialized) {
        return (
          < View>
            <ButtonPanel/> 
            
          </View>
          
        );
      } else {
        // If map is not initialized yet, return null or a loading indicator
        return null;
      }
    };
    const renderSearchBar = () => {
      // Function to render IndoorLabel on the map
      if (mapInitialized) {
        return (
          < View>
            <SearchBar/>   
          </View>
          
        );
      } else {
        // If map is not initialized yet, return null or a loading indicator
        return null;
      }
    };

    const renderSelcetedMarker = () => {
      // Function to render IndoorLabel on the map
      if (selectedMarker !== null && Object.keys(selectedMarker).length !== 0) {
          
        return (  
        //   <MapboxGL.MarkerView 
        //   coordinate={selectedMarker.coords}
        // > 
     
        //   <View 
        //   style={{ 
        //     borderColor: 'black',
        //     borderWidth: 1.0,
        //     width: 60,   
        //     backgroundColor: 'white',
        //     borderRadius: 5,
        //     shadowColor: '#000',
        //     shadowOffset: {
        //       width: 0,
        //       height: 2,}
        //     }}>
        //   <Text>{selectedMarker.id}</Text> 
        //   <Text>hello</Text> 
        //   </View>
           
        // </MapboxGL.MarkerView>
        
        <View style={{ position: 'absolute', bottom: 20, left: 20, width: '80%' }}>
          <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 5 }}>
            <Text>{selectedMarker.id}</Text>
            <Text>{selectedMarker.building}</Text>
          </View>
        </View>
        );
      } else {
        // If map is not initialized yet, return null or a loading indicator
        return null;
      }
    };

    // const filterFeature =  useSelector(store=>store.Filter.filter);
    return (
        // <View ref={componentRef} onLayout={measureComponent}>
        <>
          <MapView 
            ref={map}
            onPress={onPress}
            styleURL={style}
            style={{ flex: 1 }}
            onWillStartRenderingFrame = {(_state)=>{
              
            }}
            onCameraChanged={(_state) => {
              
              // console.log("_state",_state)
              // setMapState(_state);
              counter++
              // console.log("yes")
              dispatch(setMapState(_state));
              // queryLayerFeatures()
              avoid_queryLayerFeatures()
              dispatch(setIsCameraMoving(true))
            }}
            onMapIdle = {() => {
              onMapInitialized()
              dispatch(setIsCameraMoving(false))
             
            }}
            // onDidFinishLoadingMap={onMapInitialized}
            onDidFinishLoadingMap={onMapInitialized}
          >
            <Camera
              zoomLevel={zoomLevel}
              pitch={pitch}
              heading={heading}
              centerCoordinate={centerCoordinate}
              ref={camera}
            />  

            {renderGeojsonFiles()}
            <IndoorLabel/> 
          </MapView>
          <SearchBar/>
          {renderButtonPanel()}
          {renderSelcetedMarker()}
          

        </>
        // </View>
    );

};

export default MapBoxApp;