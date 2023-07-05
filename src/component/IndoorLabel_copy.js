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

function measure(lon1, lat1, lon2, lat2){  // generally used geo measurement function
  var R = 6378.137; // Radius of earth in KM
  var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d * 1000; // meters
}

function computeLabelPosition(givenMarkers){
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








const layerStyles = {
  building: {
    fillExtrusionOpacity: 0.5,
    fillExtrusionHeight: ["get", "height"],
    fillExtrusionBase: ["get", "base_height"],
    fillExtrusionColor: ["get", "color"],
  },
};

const IndoorBuilding = (props: BaseExampleProps) => { 




  
  const componentRef = useRef(null);
  const measureComponent = () => {
    componentRef.current.measure((x, y, width, height, pageX, pageY) => {
      console.log('Component coordinates:');
      console.log('x:', pageX); // X coordinate in screen pixels
      console.log('y:', pageY); // Y coordinate in screen pixels
      console.log('width:', width); // Width of the component
      console.log('height:', height); // Height of the component
    });
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


  // const [markers, setMarkers] = useState([]);
  // const [markerCoordinates, setMarkerCoordinates] = useState([]);

  // let markers = [];
  // const mapViewRef = useRef(null);
  let camera = useRef();
  let map = useRef();
  let markerCoordinates = [];
  let markers = [];
  let raisedMarkers = [];
  const [selectedGeoJSON, setSelectedGeoJSON] = useState(null);

  const [allowOverlap, setAllowOverlap] = useState(false);
  const [show, setShow] = useState(true);
  const [anchor, setAnchor] = useState({ x: 0.5, y: 0.5 });

  // const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  const onPress = async (e) => {
    const { screenPointX, screenPointY } = e.properties;
    console.log("screenPointX, screenPointY", screenPointX, screenPointY);
    const featureCollection = await map.current.queryRenderedFeaturesAtPoint(
      [screenPointX, screenPointY],
      null,
      ["building3d"]
    );
    // console.log(featureCollection)
  };



  const [isMapRendered, setIsMapRendered] = useState(false);
  const [isCameraMoving, setIsCameraMoving] = useState(false);
  const handleMapRenderComplete = useCallback(() => {
    setIsMapRendered(true);
  }, []);

  const findCameraProj = () => {
    let zoomLevel = mapState.properties.zoom;
    let heading = mapState.properties.heading;
    let pitch = mapState.properties.pitch;
    let center = mapState.properties.center;
    let centerPitch = 90-pitch;
    let lon = Math.sin(heading*Math.PI/180)*Math.cos(centerPitch*Math.PI/180)*2000000*Math.pow(2,-zoomLevel)*0.000145;
    let lat = Math.cos(heading*Math.PI/180)*Math.cos(centerPitch*Math.PI/180)*2000000*Math.pow(2,-zoomLevel)*0.00012;

    console.log("lon,lat",lon,lat)
    console.log("done")
    let camera_projection_position = [center[0]-lon,center[1]-lat]
    

    return [{coords: camera_projection_position, color: "purple"}];
  }
  




  const raise = (position,height) => {
    let copyPosition = findCameraProj();
    let zoomLevel = mapState.properties.zoom;
    let heading = mapState.properties.heading;
    let pitch = mapState.properties.pitch;
    let center = mapState.properties.center;
    let centerPitch = 90-pitch;

    distanceBetweenCameraProjAndMarker = Math.abs(measure(copyPosition.coords[0],copyPosition.coords[1],position[0],position[1]));
    CameraHeight = Math.sin(centerPitch*Math.PI/180)*2000000*Math.pow(2,-zoomLevel);
    distanceBetweenRaisedMarkerAndMarker = height*distanceBetweenCameraProjAndMarker/(CameraHeight-height);
    let projectionLat = Math.cos(heading*Math.PI/180)*distanceBetweenRaisedMarkerAndMarker*0.00012;
    let projectionLon = Math.sin(heading*Math.PI/180)*distanceBetweenRaisedMarkerAndMarker0*0.000145;
    position[0]= position[0]+ projectionLon;
    position[1]= position[1]+ projectionLat;

    return [{coords: position,color: "purple"}];
    
    // let copyPosition = position.slice();;
    // let heading = mapState.properties.heading;
    // let pitch = mapState.properties.pitch;
    // console.log("raise",heading,pitch);
    // let fixheight = 0.0008;// 8 meter
    // let distance = 1/Math.tan((90-pitch)*Math.PI/180)*fixheight;
    // let projectionLat = Math.cos(heading*Math.PI/180)*distance;
    // let projectionLon = Math.sin(heading*Math.PI/180)*distance*(8/11);
    // copyPosition[0] = copyPosition[0]+ projectionLon;
    // copyPosition[1] = copyPosition[1]+ projectionLat
    // console.log("Position",copyPosition)
    // return [{coords: copyPosition, color: "purple"}];
  };


  const handleRegionDidChange = async () => {
    setIsCameraMoving(false);
     console.log("Camera movement completed");
    // Perform actions after camera movement is completed
    const featureCollection = await map.current.queryRenderedFeaturesInRect([], null, [
      "building3d",
    ]);
    // console.log("Feature collection completed");
    // console.log(featureCollection)
    if (featureCollection !== null && featureCollection.features !== null) {
      if (featureCollection.features.length) {
        setSelectedGeoJSON(featureCollection);
        // console.log(selectedGeoJSON);
      } else {
        console.log("no JSON found");
        setSelectedGeoJSON(null);
      }
      // console.log("setSelectedGeoJSON:",selectedGeoJSON)
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
      // console.log("markerCoordinates",markerCoordinates)
    }


  if (markerCoordinates.length !== 0 && markerCoordinates[0].latlons !== null) {
      
    // console.log(markerCoordinates[0].latlons);
    const newMarkers = markerCoordinates[0].latlons.map((latlons) => {
      return {
        coords: latlons,
        color: "purple",
      };
    });
    // console.log("this is the markers:");
    // console.log(newMarkers);
    // if(newMarkers){
    let centerLabel = computeLabelPosition(newMarkers); 
    // console.log("centerLabel",centerLabel)
    //   if(centerLabel){
    //     setMarkers(centerLabel);
    //   }
    // }
    
    markers = newMarkers;
    //markers = [...newMarkers];
    markers = [{coords: centerLabel.position, color: "purple"}];
    // console.log("markers2",markers);
    
    raisedMarkers = raise(centerLabel.position,0)
    
  }else{
    console.log("markerCoordinates.length = 0")
  }

  // }, [selectedGeoJSON]);


  

  

  const handleRegionChanging = async () => {
    setIsCameraMoving(true);
    // console.log("moving");

    const featureCollection = await map.current.queryRenderedFeaturesInRect([], null, [
      "building3d",
    ]);
  };




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
  //     //   let centerLabel = computeLabelPosition(newMarkers); 
  //     //   if(centerLabel){
  //     //     setMarkers(centerLabel);
  //     //   }
  //     // }
      
  //     setMarkers(newMarkers);
  //     console.log(markers);
     
      
      
  //   }else{
  //     console.log("markerCoordinates.length = 0")
  //   }
  // }, [markerCoordinates]);



  return (
    // <View ref={componentRef} onLayout={measureComponent}>
    <Page {...props}>
      <MapView
        ref={map}
        onPress={onPress}
        style={sheet.matchParent}
        onLayout={handleMapRenderComplete}
        onCameraChanged={(_state) => {
          console.log("_state",_state)
          setMapState(_state);
          handleRegionChanging()
        }}
        onMapIdle={handleRegionDidChange}
      >
        <Camera
          zoomLevel={16}
          pitch={40}
          heading={30}
          centerCoordinate={[-87.61694, 41.86625]}
          ref={camera}
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
        
        {raisedMarkers.map((raisedMarker, i) => {
          return (
            <MapboxGL.MarkerView
              key={`RaisedMarkerView-${i}-${raisedMarker.coords.join("-")}`}
              coordinate={raisedMarker.coords}
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

        <MapboxGL.MarkerView
              key={"test"}
              coordinate={[-87.61647979502106, 41.86612639153123]}
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
    // </View>
  );
};

export default IndoorBuilding;
