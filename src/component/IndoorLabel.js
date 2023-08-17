import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { Slider } from "@rneui/base";
import { Position } from "geojson";
import { Camera, Logger, MapView, MarkerView } from '@rnmapbox/maps';
import sheet from "../styles/sheet";
import colors from "../styles/colors";
import buttonStyles from "../styles/button";
import Page from "../common/Page";
import BaseExamplePropTypes from "../common/BaseExamplePropTypes";
import {useSelector, useDispatch} from 'react-redux';
import {setGeoJSON} from '../redux/actions/getGeoJsonReducer';
import {setMapState} from '../redux/actions/getMapstateReducer';
import { setSelectRoom } from "../redux/actions/setSelectedRoom";
import { Button, Divider, Text } from '@rneui/base';
import Icon from 'react-native-vector-icons/FontAwesome6';



function computeCenterLabelPosition(givenMarkers){
  if (givenMarkers.length === 0) {
    return [];
  }
  var max0 = givenMarkers[0].coords[0];
  var max1 = givenMarkers[0].coords[1];
  var min0 = givenMarkers[0].coords[0];
  var min1 = givenMarkers[0].coords[1];
  for (let i = 1; i < givenMarkers.length; i++) {
    if(givenMarkers[i]!= undefined){
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
    let midvalue = Math.cos(centerPitch*Math.PI/180)*59959*Math.pow(2,-zoomLevel);
    let lon = Math.sin(heading*Math.PI/180)*midvalue*0.0103;
    let lat = Math.cos(heading*Math.PI/180)*midvalue*0.0072;

    

    let camera_projection_position = [center[0]-lon,center[1]-lat]
    
    // console.log("camera_projection_position",camera_projection_position)
    return {coords: camera_projection_position, color: ""};
  }

  const raise = (position,height,roomID) => {
    let cameraProj = findCameraProj();
    let zoomLevel = mapState.properties.zoom;
    let heading = mapState.properties.heading;
    let pitch = mapState.properties.pitch;
    let center = mapState.properties.center;
    let centerPitch = 90-pitch;
    let copyPosition = position.slice();
    if(cameraProj){
      let vector  =[position[0]-cameraProj.coords[0],position[1]-cameraProj.coords[1]];
      const length = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
      let CameraHeight = Math.sin(centerPitch*Math.PI/180)*59959.436*Math.pow(2,-zoomLevel)*39;
      // console.log("CameraHeight",CameraHeight);
      if(CameraHeight>height){        
        let distanceBetweenRaisedMarkerAndMarker = height*length/(CameraHeight-height);
        const extendVector = [
          vector[0] / length * distanceBetweenRaisedMarkerAndMarker,
          vector[1] / length * distanceBetweenRaisedMarkerAndMarker
        ];
        copyPosition[0]= copyPosition[0]+ extendVector[0];
        copyPosition[1]= copyPosition[1]+ extendVector[1];
        // console.log("position",copyPosition)
        return {coords: copyPosition,color: "",id:roomID};
      }
      
    }
    
    return {coords: position,color: "",id:roomID, title:"",info:"",building:buildingName};
    
  };

  
  const dispatch = useDispatch();
  let markerCoordinates = [];
  let textMarkers = [];
  let iconMarkers = [];
  let textRaisedMarkers = [];
  let iconRaisedMarkers = [];
  const selectedGeoJSON = useSelector((store)=>store.GeoJSONs.selectedGeoJSON);
  const floorNumber = useSelector(store=>store.Filter.filter)[0]
  const isCameraMoving = useSelector((store)=>store.IsCameraMoving.isCameraMoving);
  const [TextMarkers, setTextMarkers] = useState([]);
  const [IconMarkers, setIconMarkers] = useState([]);
  // const [selectedMarker, setSelectedMarker] = useState(null);
  // const [markerPosition, setMarkerPosition] = useState({ x: 0, y: 0 });

  const handleMarkerPress = (marker) => {
    const coordinate = marker.coords;
    // setSelectedMarker(marker);
    // setMarkerPosition({ x:coordinate[0], y:coordinate[1] });
    dispatch(setSelectRoom(marker));
  }
  // const [TextMarkers, setTextMarkers] = useState([]);
  // console.log("selectedGeoJson",selectedGeoJSON);

  const updateLabel = () =>{

    console.log("updating")
    let buildingName = selectedGeoJSON.name;

    if(buildingName.split("_").includes("BA")){
      buildingName = "Bahen Centre for Information Technology"
    }

      if( selectedGeoJSON !== null && Object.keys(selectedGeoJSON).length !== 0 && selectedGeoJSON.features !== null && selectedGeoJSON.features !== {}){

        const features = selectedGeoJSON.features;
        markerCoordinates = (() => {
        
          let updatedCoordinates = [];
          for (const feature of features) {
            const geometry = {
              latlons: feature.geometry.coordinates.flat(2),
              base_height: feature.properties.base_height,
              height: feature.properties.height,
              roomID:feature.properties.room
            };
            updatedCoordinates = updatedCoordinates.concat(geometry);
          }
          
          return updatedCoordinates; // Return the updated state
        })();
        // console.log("markerCoordinates",markerCoordinates)
      }
    
      if (markerCoordinates.length !== 0) {
      let roomList = []
      let labelIndex = 0;
      for (const markerCoordinate of markerCoordinates){
        if (markerCoordinate.height-1 == 0){
          const roomNUM = markerCoordinate.roomID;

          if(!roomList.includes(roomNUM)){       

              const newMarker = markerCoordinate.latlons.map((latlons,index,coordArray) => {
              if(index%2==0){
                  return {
                  coords: [latlons,coordArray[index+1]],
                  title:"",
                  building:buildingName,
                  info:"",
                  color: "",

                };
                }
                
              });

              let centerLabel = computeCenterLabelPosition(newMarker);   
              // console.log("markers is",centerLabel)
              // textMarkers.push({coords: centerLabel.position, color: "", room: roomNUM})
            // }
            
            if(roomNUM !== "S" && roomNUM !== "E"&& roomNUM !== "FW" && roomNUM !== "MW"){
              roomList.push(roomNUM);
              textMarkers.push({coords: centerLabel.position, color: "", id: roomNUM,title: "",info: "",building:buildingName})
            }else{
              labelIndex=labelIndex+1;
              switch (roomNUM) {
                case 'S':
                  iconMarkers.push({id:"stairs"+labelIndex,coordinates: centerLabel.position,  icon: <Icon name="stairs" size={30} color="grey" />})
                  break;
                case 'E':
                  iconMarkers.push({id:"stairs"+labelIndex,coordinates: centerLabel.position,  icon: <Icon name="stairs" size={30} color="grey" />})

                  break;
                case 'FW':
                  iconMarkers.push({id:"stairs"+labelIndex,coordinates: centerLabel.position,  icon: <Icon name="stairs" size={30} color="grey" />})

                  break;
                case 'MW':
                  iconMarkers.push({id:"stairs"+labelIndex,coordinates: centerLabel.position, icon: <Icon name="stairs" size={30} color="grey" />})

                  break;
                default:
                  console.log('Invalid room entered.');
                }
              
            }
            
            
            
          
          }
        }else{
          const roomNUM = markerCoordinate.roomID

          if(!roomList.includes(roomNUM)){
                       
            const newMarker = markerCoordinate.latlons.map((latlons,index,coordArray) => {
            if(index%2==0){
                return {
                coords: [latlons,coordArray[index+1]],
                title:"",
                building:buildingName,
                info:"",
                color: "",

              };
              }
              
            });
            let height = markerCoordinate.height/21.42
            let centerLabel = computeCenterLabelPosition(newMarker);  
            
            if(roomNUM !== "S" && roomNUM !== "E"&& roomNUM !== "FW" && roomNUM !== "MW"){
              roomList.push(roomNUM);
              textRaisedMarkers.push(raise(centerLabel.position,height,roomNUM))
            }else{
              // switch (roomNUM) {
              //   case 'S':
              //     iconRaisedMarkers.push(raise(centerLabel.position,height,"stairs"))
              //     break;
              //   case 'E':
              //     iconRaisedMarkers.push(raise(centerLabel.position,height,"elevator"))
              //     break;
              //   case 'FW':
              //     iconRaisedMarkers.push(raise(centerLabel.position,height,"female"))
              //     break;
              //   case 'MW':
              //     iconRaisedMarkers.push(raise(centerLabel.position,height,"male"))
              //     break;
              //   default:
              //     console.log('Invalid room entered.');
              //   }
              
            }

            

          }
          
        }
      }

      setTextMarkers(textMarkers.concat(textRaisedMarkers));
      // console.log(textMarkers)

      const geoJSONMarkers = iconMarkers.map(marker => ({
        type: 'Feature',
        properties: {
          id: marker.id,
          iconComponent: <Icon size={30} color="grey" name="stairs" />,
        },
        geometry: {
          type: 'Point',
          coordinates: marker.coordinates,
        },
      }));

      setIconMarkers(geoJSONMarkers);
      // setIconMarkers(iconMarkers.concat(iconRaisedMarkers));

    }else{
      console.log("markerCoordinates.length = 0")
      setTextMarkers([]);
      setIconMarkers([]);
    }
    // console.log(IconMarkers)
    


  }




  useEffect(() => {
    console.log("isCameraMoving",isCameraMoving);
    let intervalId;
    if (mapState) {
      // Start the interval when isActive is true
      console.log("update the label");
      updateLabel()
      // intervalId = setInterval(updateLabel, 200); // Call the function every 1000 milliseconds (1 second)
    }

    // Clean up the interval when the component unmounts or isActive becomes false
    return () => {
      
    };

  }, [mapState,selectedGeoJSON,floorNumber]);

  // const icon = Icon.getImageSourceSync('rocket', 40, 'blue');


  return (
    <>
    {TextMarkers.map((AllMarker, i) => {
          return (
            <MapboxGL.MarkerView
              key={`RaisedMarkerView-${i}-${AllMarker.coords.join("-")}`}
              coordinate={AllMarker.coords}
              allowOverlap={false}

            > 
              {/* <View style={{ borderColor: 'black', borderWidth: 1.0, width: 60 }}>
              <Text>"this is my life"</Text>  
              </View> */}
              
              <TouchableOpacity
              onPress={() => handleMarkerPress(AllMarker)}
              >

              
                <Text style={[{
                    color: 'grey',
                    fontSize: 11,
                    fontWeight: 'bold',
                  }]}>
                    {AllMarker.id}
                </Text>

              </TouchableOpacity>  
            </MapboxGL.MarkerView>
            

          );
        }
        )
        }
    

        
      {/* <MapboxGL.ShapeSource id="symbolSource" shape={IconMarkers}>
      <MapboxGL.SymbolLayer
          id="symbolLayer"
          style={(feature) => ({
            iconImage: MapboxGL.Image.fromComponent(feature.properties.icon),
            iconSize: 0.5,
          })}
        />
      </MapboxGL.ShapeSource> */}

        
        


    </>
  );


}
export default IndoorLabel;
