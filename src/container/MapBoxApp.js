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



import BA_1_Room from "../assets/geojson/BA_Indoor_1_room.json";
import BA_2_Room from "../assets/geojson/BA_Indoor_2_room.json";
import BA_3_Room from "../assets/geojson/BA_Indoor_3_room.json";


//Todo:
//Flickering issue => state update related
//Promise Rejection => queryRenderedFeaturesInRect @ onCameraChanged

const style = JSON.stringify(require('../assets/map-style.json'));


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

    const onMapInitialized = () => {
      // This function is called when the map is fully initialized
      setMapInitialized(true);
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
    let floorNumber = useSelector(store=>store.Filter.filter)[0]
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
          {renderButtonPanel()}
          {renderSelcetedMarker()}
          

        </>
        // </View>
    );

};

export default MapBoxApp;