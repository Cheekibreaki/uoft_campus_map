import React, { useState, useEffect, useCallback, useLayoutEffect } from "react";
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


function computeLabelPosition(points){
  console.log("given markers",points)
  if (points.length === 0) {
    return [];
  }

  // let max = givenMarkers[0].coords;
  // let min = givenMarkers[0].coords;
  // for (let i = 1; i < givenMarkers.length; i++) {
  //   if (givenMarkers[i].coords[0] > max[0]) {
  //     max[0] = givenMarkers[i].coords[0];
  //   }
  //   if (givenMarkers[i].coords[1] > max[1]) {
  //     max[1] = givenMarkers[i].coords[1];
  //   }
  //   if (givenMarkers[i].coords[0] < min[0]) {
  //     min[0] = givenMarkers[i].coords[0];
  //   }
  //   if (givenMarkers[i].coords[1] < min[1]) {
  //     min[1] = givenMarkers[i].coords[1];
  //   }
  // }

  // let position = [(max[0] + min[0]) / 2, (max[1] + min[1]) / 2];

  const position = points.reduce((acc, point) => {
    acc[0] += point.coords[0];
    acc[1] += point.coords[1];
    return acc;
  }, [0, 0]);
  
  position[0] /= points.length;
  position[1] /= points.length;
  
  console.log('Center:', position);

  return { position };
}



const layerStyles = {
  building: {
    fillExtrusionOpacity: 0.5,
    fillExtrusionHeight: ["get", "height"],
    fillExtrusionBase: ["get", "base_height"],
    fillExtrusionColor: ["get", "color"],
  },
};

const IndoorBuilding = (props: BaseExampleProps) => {
  
  // const [markers, setMarkers] = useState([]);
  // const [markerCoordinates, setMarkerCoordinates] = useState([]);

  // let markers = [];
  let markerCoordinates = [];
  let markers = [];

  const [selectedGeoJSON, setSelectedGeoJSON] = useState(null);

  const [allowOverlap, setAllowOverlap] = useState(false);
  const [show, setShow] = useState(true);
  const [anchor, setAnchor] = useState({ x: 0.5, y: 0.5 });

  // const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  const onPress = async (e) => {
    const { screenPointX, screenPointY } = e.properties;
    console.log("screenPointX, screenPointY", screenPointX, screenPointY);
    const featureCollection = await map.queryRenderedFeaturesAtPoint(
      [screenPointX, screenPointY],
      null,
      ["building3d"]
    );
    console.log(featureCollection)
  };



  const [isMapRendered, setIsMapRendered] = useState(false);
  const [isCameraMoving, setIsCameraMoving] = useState(false);
  const handleMapRenderComplete = useCallback(() => {
    setIsMapRendered(true);
  }, []);

  const handleRegionDidChange = async () => {
    setIsCameraMoving(false);
    console.log("Camera movement completed");
    // Perform actions after camera movement is completed
    const featureCollection = await map.queryRenderedFeaturesInRect([], null, [
      "building3d",
    ]);
    console.log("Feature collection completed");
    console.log(featureCollection)
    if (featureCollection !== null && featureCollection.features !== null) {
      console.log("in it")
      if (featureCollection.features.length) {
        setSelectedGeoJSON(featureCollection);
        // console.log(selectedGeoJSON);
      } else {
        console.log("no JSON found");
        setSelectedGeoJSON(null);
      }
      console.log("setSelectedGeoJSON:",selectedGeoJSON)
    }else{
      console.log("not found")
    }
  };


  // useLayoutEffect(() => {

    if (selectedGeoJSON !== null && selectedGeoJSON.features !== null) {
      const features = selectedGeoJSON.features;
      markerCoordinates = (() => {
      
        let updatedCoordinates = [];
        for (const feature of features) {
          const geometry = {
            latlons: feature.geometry.coordinates.flat(),
            base_height: feature.properties.base_height,
            height: feature.properties.height,
          };
          updatedCoordinates = updatedCoordinates.concat(geometry);
        }
        
        return updatedCoordinates; // Return the updated state
      })();
      console.log("markerCoordinates",markerCoordinates)
    }


    if (markerCoordinates.length !== 0 && markerCoordinates[0].latlons !== null) {
        
    // console.log(markerCoordinates[0].latlons);
    const newMarkers = markerCoordinates[0].latlons.map((latlons) => {
      return {
        coords: latlons,
        color: "purple",
      };
    });
    console.log("this is the markers:");
    console.log(newMarkers);
    // if(newMarkers){
    let resultLabel = computeLabelPosition(newMarkers); 
    console.log("resultLabel",resultLabel)
    //   if(resultLabel){
    //     setMarkers(resultLabel);
    //   }
    // }
    
    // markers = newMarkers;
    markers = [...newMarkers];
    markers = [{coords: resultLabel.position, color: "purple"}];
    console.log("markers2",markers);
    
    
    
  }else{
    console.log("markerCoordinates.length = 0")
  }

  // }, [selectedGeoJSON]);




  const handleMapLoaded = () => {
    const camera = mapViewRef.current.getCamera();
    const cameraCoordinates = camera.centerCoordinate;
    const targetCoordinates = [longitude, latitude]; // Replace with the coordinates of the target point

    const distance = MapboxGL.MetersPerPixelAtLatitude(
      cameraCoordinates[1],
    ) * MapboxGL.MetersBetweenCoordinates(
      cameraCoordinates,
      targetCoordinates,
    );

    console.log('Distance:', distance);
  };

  const handleRegionChanging = async () => {
    setIsCameraMoving(true);
    // console.log("moving");

    const featureCollection = await map.queryRenderedFeaturesInRect([], null, [
      "building3d",
    ]);
  };

  useEffect(() => {
    if (isMapRendered) {
      const fetchData = async () => {
        if (isMapRendered) {
          console.log("Map and layers rendered completely");
        }
      };

      fetchData();
    }
  }, [isMapRendered]);


  // useEffect(() => {
    
  //   if (markerCoordinates.length !== 0 && markerCoordinates[0].latlons !== null) {
          
  //     // console.log(markerCoordinates[0].latlons);
  //     const newMarkers = markerCoordinates[0].latlons.map((latlons) => {
  //       return {
  //         coords: latlons,
  //         color: "purple",
  //       };
  //     });
  //     console.log("this is the markers:");
  //     // console.log(newMarkers);
  //     // if(newMarkers){
  //     //   let resultLabel = computeLabelPosition(newMarkers); 
  //     //   if(resultLabel){
  //     //     setMarkers(resultLabel);
  //     //   }
  //     // }
      
  //     setMarkers(newMarkers);
  //     console.log(markers);
     
      
      
  //   }else{
  //     console.log("markerCoordinates.length = 0")
  //   }
  // }, [markerCoordinates]);



  return (
    <Page {...props}>
      <MapView
        ref={(ref) => (map = ref)}
        onPress={onPress}
        style={sheet.matchParent}
        onLayout={handleMapRenderComplete}
        onCameraChanged={handleRegionChanging}
        onMapIdle={handleRegionDidChange}
      >
        <Camera
          zoomLevel={16}
          pitch={40}
          heading={30}
          centerCoordinate={[-87.61694, 41.86625]}
        />  


        {markers.map((marker, i) => {
          return (
            <MapboxGL.MarkerView
              key={`MarkerView-${i}-${marker.coords.join("-")}`}
              coordinate={marker.coords}
              allowOverlap={allowOverlap}
              style={ "flex" }
            >
              <Pressable
                style={[
                  
                  { backgroundColor: "black", padding: 4 * 1 },
                ]}
              >
                
              </Pressable>
            </MapboxGL.MarkerView>
          );
        })}


        <MapboxGL.ShapeSource
          id="indoorBuildingSource"
          shape={indoorMapGeoJSON}
        >
          <MapboxGL.FillExtrusionLayer
            id="building3d"
            style={layerStyles.building}
          />
        </MapboxGL.ShapeSource>


      </MapView>
    </Page>
  );
};

export default IndoorBuilding;
