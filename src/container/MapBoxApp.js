import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { Slider } from "@rneui/base";
import { Position } from "geojson";
import { Camera, Logger, MapView, MarkerView } from '@rnmapbox/maps';
import colors from "../styles/colors";
import BA_2_Room from "../assets/geojson/BA_Indoor_2_room.json";
import Page from "../common/Page";
import BaseExamplePropTypes from "../common/BaseExamplePropTypes";
import {useSelector, useDispatch} from 'react-redux';
import {setGeoJSON} from "../redux/actions/setGeoJsonAction";
import { setMapState } from "../redux/actions/setMapstateAction";
import IndoorLabel from '../component/IndoorLabel'
import ButtonPanel from "../component/button";
import GeojsonFiles from "../component/renderGeojsonFiles";

//Todo:
//Flickering issue => state update related
//Promise Rejection => queryRenderedFeaturesInRect @ onCameraChanged

const style = JSON.stringify(require('../assets/map-style.json'));


const MapBoxApp = (props: BaseExampleProps) => {
    const zoomLevel = 16;
    const pitch = 40;
    const heading = 30;
    const centerCoordinate = [-79.3973449417775, 43.65997911110146]
    

    // const [mapState, setMapState] = useState({
    //     properties: {
    //       center: [0, 0],
    //       bounds: {
    //         ne: [0, 0],
    //         sw: [0, 0],
    //       },
    //       zoom: 0,
    //       heading: 0,
    //       pitch: 0,
    //     },
    // });
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
    const [isCameraMoving, setIsCameraMoving] = useState(false);
    const [mapInitialized, setMapInitialized] = useState(false);

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

            dispatch(setGeoJSON(featureCollection));
        } else {
        // console.log("no Indoor Building Layer found");
        //setSelectedGeoJSON(null);
        dispatch(setGeoJSON({}));
        }
    };

    const avoid_queryLayerFeatures = async () => {
      dispatch(setGeoJSON(BA_2_Room))
    }



    const renderGeojsonFiles = () =>{
      return (
        <GeojsonFiles/>
      );
    }
    const renderIndoorlabels = () => {
      // Function to render IndoorLabel on the map
      if (mapInitialized) {
        return (
          <IndoorLabel/> 
          
        );
      } else {
        // If map is not initialized yet, return null or a loading indicator
        return null;
      }
    };

    const filterFeature =  useSelector(store=>store.Filter.filter);
    return (
        // <View ref={componentRef} onLayout={measureComponent}>
        <Page {...props}>
          <MapView 
            ref={map}
            styleURL={style}
            style={{ flex: 1 }}
            onWillStartRenderingFrame = {()=>{
              console.log("asda")
            }}
            onCameraChanged={(_state) => {
              
              // console.log("_state",_state)
              // setMapState(_state);
              counter++
              // console.log("yes")
              dispatch(setMapState(_state));
              avoid_queryLayerFeatures()
            }}
            // onDidFinishLoadingMap={onMapInitialized}
            onMapIdle={onMapInitialized}
          >
            <Camera
              zoomLevel={zoomLevel}
              pitch={pitch}
              heading={heading}
              centerCoordinate={centerCoordinate}
              ref={camera}
            />  

            {renderGeojsonFiles()}
            {renderIndoorlabels()}     
          </MapView>
          <View>
           <ButtonPanel/> 
          </View>
          

        </Page>
        // </View>
    );

};

export default MapBoxApp;