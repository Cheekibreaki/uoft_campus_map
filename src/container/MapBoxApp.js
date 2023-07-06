import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { Slider } from "@rneui/base";
import { Position } from "geojson";
import { Camera, Logger, MapView, MarkerView } from '@rnmapbox/maps';
import colors from "../styles/colors";
import indoorMapGeoJSON from "../assets/indoor_3d_map.json";
import Page from "../common/Page";
import BaseExamplePropTypes from "../common/BaseExamplePropTypes";
import {useSelector, useDispatch} from 'react-redux';
import {getGeoJSON} from '../redux/actions/getGeoJspmAction';

const MapBoxApp = (props: BaseExampleProps) => {
    const zoomLevel = 16;
    const pitch = 40;
    const heading = 30;
    const centerCoordinate = [-79.3973449417775, 43.65997911110146]

    const layerStyles = {
        building: {
            fillExtrusionOpacity: 0.5,
            fillExtrusionHeight: ["get", "height"],
            fillExtrusionBase: ["get", "base_height"],
            fillExtrusionColor: ["get", "color"],
        },
    };
    

    const [mapState, setMapState] = useState({
        properties: {
          center: [0, 0],
          bounds: {
            ne: [0, 0],
            sw: [0, 0],
          },
          zoom: 0,
          heading: 0,
          pitch: 0,
        },
    });

    let map = useRef();
    let camera = useRef();
    
    const dispatch = useDispatch();
    

    const [selectedGeoJSON, setSelectedGeoJSON] = useState(null);
    const [allowOverlap, setAllowOverlap] = useState(false);
    const [isCameraMoving, setIsCameraMoving] = useState(false);


    const queryLayerFeatures = async () => {
        setIsCameraMoving(false);
        console.log("Camera moving");
        const featureCollection = await map.current.queryRenderedFeaturesInRect([], null, [
          "IndoorBuilding3DLayer",
        ]);

        if (featureCollection && featureCollection.features && featureCollection.features.length) {
            setSelectedGeoJSON(featureCollection);
        } else {
        console.log("no Indoor Building Layer found");
        setSelectedGeoJSON(null);
        }
    };



    return (
        // <View ref={componentRef} onLayout={measureComponent}>
        <Page {...props}>
          <MapView
            ref={map}
            style={{ flex: 1 }}
            onCameraChanged={(_state) => {
              console.log("_state",_state)
              setMapState(_state);
              queryLayerFeatures()
            }}
            // onMapIdle={handleRegionDidChange}
          >
            <Camera
              zoomLevel={zoomLevel}
              pitch={pitch}
              heading={heading}
              centerCoordinate={centerCoordinate}
              ref={camera}
            />  


        <MapboxGL.ShapeSource
          id="indoorBuildingSource"
          shape={indoorMapGeoJSON}
        >
          <MapboxGL.FillExtrusionLayer
            id="IndoorBuilding3DLayer"
            style={layerStyles.building}
          />
        </MapboxGL.ShapeSource>
          </MapView>
        </Page>
        // </View>
    );

};

export default MapBoxApp;