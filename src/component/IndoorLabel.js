import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
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
import {useSelector} from 'react-redux';
import {setGeoJSON} from '../redux/actions/getGeoJsonAction';
import {setMapState} from '../redux/actions/getMapstateAction';


function computeCenterLabelPosition(givenMarkers){
  if (givenMarkers.length === 0) {
    return [];
  }
  var max0 = givenMarkers[0].coords[0];
  var max1 = givenMarkers[0].coords[1];
  var min0 = givenMarkers[0].coords[0];
  var min1 = givenMarkers[0].coords[1];
  for (let i = 1; i < givenMarkers.length; i++) {

    if (givenMarkers[i].coords[0] > max0) {

      max0 = givenMarkers[i].coords[0];
    }
    if (givenMarkers[i].coords[1] > max1) {

      max1 = givenMarkers[i].coords[1];
    }
    if (givenMarkers[i].coords[0] < min0) {

      min0 = givenMarkers[i].coords[0];
    }
    if (givenMarkers[i].coords[1] < min1) {

      min1 = givenMarkers[i].coords[1];
    }
  }



  let position = [(max0 + min0) / 2, (max1 + min1) / 2];

  return {position};
}





const IndoorLabel = () => { 
  const mapState = useSelector(store=>store.MapState.mapState);
  const findCameraProj = () => {
    
    
    let zoomLevel = mapState.properties.zoom;
    let heading = mapState.properties.heading;
    let pitch = mapState.properties.pitch;
    let center = mapState.properties.center;
    let centerPitch = 90-pitch;
    let lon = Math.sin(heading*Math.PI/180)*Math.cos(centerPitch*Math.PI/180)*59959.436*Math.pow(2,-zoomLevel)*0.0103;
    let lat = Math.cos(heading*Math.PI/180)*Math.cos(centerPitch*Math.PI/180)*59959.436*Math.pow(2,-zoomLevel)*0.0072;

    

    let camera_projection_position = [center[0]-lon,center[1]-lat]
    
    console.log("camera_projection_position",camera_projection_position)
    return {coords: camera_projection_position, color: "purple"};
  }
  
  const raise = (position,height) => {
    // let cameraProj = findCameraProj();
    // return [cameraProj]
    let cameraProj = findCameraProj();
    let zoomLevel = mapState.properties.zoom;
    let heading = mapState.properties.heading;
    let pitch = mapState.properties.pitch;
    let center = mapState.properties.center;
    console.log("center",center);
    let centerPitch = 90-pitch;
    let copyPosition = position.slice();
    if(cameraProj){
      console.log("copyPosition",cameraProj)
      // let distanceBetweenCameraProjAndMarker = Math.abs(measure(cameraProj.coords[0],cameraProj.coords[1],position[0],position[1]));
      let vector  =[position[0]-cameraProj.coords[0],position[1]-cameraProj.coords[1]];
      const length = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
      let CameraHeight = Math.sin(centerPitch*Math.PI/180)*59959.436*Math.pow(2,-zoomLevel)*39;
      console.log("CameraHeight",CameraHeight);
      if(CameraHeight>height){
        
        let distanceBetweenRaisedMarkerAndMarker = height*length/(CameraHeight-height);
        console.log("distance",distanceBetweenRaisedMarkerAndMarker);

        
        
        const extendVector = [
          vector[0] / length * distanceBetweenRaisedMarkerAndMarker,
          vector[1] / length * distanceBetweenRaisedMarkerAndMarker
        ];
        
        

        copyPosition[0]= copyPosition[0]+ extendVector[0];
        copyPosition[1]= copyPosition[1]+ extendVector[1];
        console.log("position",copyPosition)
        return [{coords: copyPosition,color: "purple"}];
      }
      
    }
    
    return [{coords: position,color: "purple"}];
    
  };



  let markerCoordinates = [];
  let markers = [];
  let raisedMarkers = [];
  const selectedGeoJSON = useSelector((store)=>store.GeoJSONs.selectedGeoJSON);
  // console.log("selectedGeoJson",selectedGeoJSON);

  if (Object.keys(selectedGeoJSON).length !== 0 && selectedGeoJSON !== null && selectedGeoJSON.features !== null && selectedGeoJSON.features !== {} ) {
    console.log("selectedGeoJSON",selectedGeoJSON)
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


  if (markerCoordinates.length !== 0 && markerCoordinates[1].latlons !== null) {
      
    // console.log(markerCoordinates[0].latlons);
    const newMarkers = markerCoordinates[1].latlons.map((latlons) => {
      return {
        coords: latlons,
        color: "purple",
      };
    });

    let centerLabel = computeCenterLabelPosition(newMarkers); 

    markers = newMarkers;
    //markers = [...newMarkers];
    markers = [{coords: centerLabel.position, color: "purple"}];
    // console.log("markers2",markers);
    
    raisedMarkers = raise(centerLabel.position,1.4)
    
  }else{
    console.log("markerCoordinates.length = 0")
  }


  return (
    // <View ref={componentRef} onLayout={measureComponent}>
      <>
        {markers.map((marker, i) => {
          return (
            <MapboxGL.MarkerView
              key={`MarkerView-${i}-${marker.coords.join("-")}`}
              coordinate={marker.coords}
              allowOverlap={true}
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
        
        {raisedMarkers.map((raisedMarker, i) => {
          return (
            <MapboxGL.MarkerView
              key={`RaisedMarkerView-${i}-${raisedMarker.coords.join("-")}`}
              coordinate={raisedMarker.coords}
              allowOverlap={true}
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
    </>
  );
};

export default IndoorLabel;
