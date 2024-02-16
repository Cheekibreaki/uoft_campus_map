import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import { View, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { Slider } from "@rneui/base";
import { Position } from "geojson";
import { Camera, Logger, MapView, MarkerView, Images } from "@rnmapbox/maps";
import sheet from "../styles/sheet";
import colors from "../styles/colors";
import buttonStyles from "../styles/button";
import Page from "../common/Page";
import BaseExamplePropTypes from "../common/BaseExamplePropTypes";
import { useSelector, useDispatch } from "react-redux";
import { setGeoJSON } from "../redux/actions/getGeoJsonReducer";
import { setMapState } from "../redux/actions/getMapstateReducer";
import { setSelectRoom } from "../redux/actions/setSelectedRoom";
import { Button, Divider, Text } from "@rneui/base";
import stairs_img from "../assets/Label_Asset/stairs.png";
import elevator_img from "../assets/Label_Asset/elevator.png";
import man_img from "../assets/Label_Asset/man.png";
import woman_img from "../assets/Label_Asset/woman.png";

function computeCenterLabelPosition(givenMarkers) {
  if (givenMarkers.length === 0) {
    return [];
  }
  var max0 = givenMarkers[0].coords[0];
  var max1 = givenMarkers[0].coords[1];
  var min0 = givenMarkers[0].coords[0];
  var min1 = givenMarkers[0].coords[1];
  for (let i = 1; i < givenMarkers.length; i++) {
    if (givenMarkers[i] != undefined) {
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

  return { position };
}

const IndoorLabel = () => {
  const mapState = useSelector((store) => store.MapState.mapState);

  const findCameraProj = () => {
    let zoomLevel = mapState.properties.zoom;
    let heading = mapState.properties.heading;
    let pitch = mapState.properties.pitch;
    let center = mapState.properties.center;
    let centerPitch = 90 - pitch;
    let midvalue =
      Math.cos((centerPitch * Math.PI) / 180) * 59959 * Math.pow(2, -zoomLevel);
    let lon = Math.sin((heading * Math.PI) / 180) * midvalue * 0.0103;
    let lat = Math.cos((heading * Math.PI) / 180) * midvalue * 0.0075;

    let camera_projection_position = [center[0] - lon, center[1] - lat];

    // console.log("camera_projection_position",camera_projection_position)
    return { coords: camera_projection_position, color: "" };
  };

  const raise = (position, height) => {
    let cameraProj = findCameraProj();
    let zoomLevel = mapState.properties.zoom;
    let heading = mapState.properties.heading;
    let pitch = mapState.properties.pitch;
    let center = mapState.properties.center;
    let centerPitch = 90 - pitch;
    let copyPosition = position.slice();
    if (cameraProj) {
      let vector = [
        position[0] - cameraProj.coords[0],
        position[1] - cameraProj.coords[1],
      ];
      const length = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
      let CameraHeight =
        Math.sin((centerPitch * Math.PI) / 180) *
        2338418 *
        Math.pow(2, -zoomLevel);
      // console.log("CameraHeight",CameraHeight);
      if (CameraHeight > height) {
        let distanceBetweenRaisedMarkerAndMarker =
          (height * length) / (CameraHeight - height);
        const extendVector = [
          (vector[0] / length) * distanceBetweenRaisedMarkerAndMarker,
          (vector[1] / length) * distanceBetweenRaisedMarkerAndMarker,
        ];
        copyPosition[0] = copyPosition[0] + extendVector[0];
        copyPosition[1] = copyPosition[1] + extendVector[1];
        // console.log("position",copyPosition)
        return copyPosition;
      }
    }

    return position;
  };

  const dispatch = useDispatch();
  let markerCoordinates = [];
  let textMarkers = [];
  let iconMarkers = [];
  let textRaisedMarkers = [];
  let iconRaisedMarkers = [];
  const selectedGeoJSON = useSelector(
    (store) => store.GeoJSONs.selectedGeoJSON
  );
  const floorNumber = useSelector((store) => store.Filter.filter)[0];
  const isCameraMoving = useSelector(
    (store) => store.IsCameraMoving.isCameraMoving
  );
  const [TextMarkers, setTextMarkers] = useState([]);
  const [IconMarkers, setIconMarkers] = useState([]);
  // const [TextMarkers, setTextMarkers] = useState([]);
  // console.log("selectedGeoJson",selectedGeoJSON);

  const handleMarkerPress = (marker) => {
    const coordinate = marker.coords;
    // setSelectedMarker(marker);
    // setMarkerPosition({ x:coordinate[0], y:coordinate[1] });
    dispatch(setSelectRoom(marker));
  }

  const updateLabel = () => {
    // console.log("selectedGeoJSON", selectedGeoJSON);
    let buildingName = selectedGeoJSON.name;
    if (buildingName !== null && buildingName !== undefined) {
      if(buildingName.split("_").includes("BA")){
      buildingName = "Bahen Centre for Information Technology"
    }
    }
    

    if (
      selectedGeoJSON !== null &&
      Object.keys(selectedGeoJSON).length !== 0 &&
      selectedGeoJSON.features !== null &&
      selectedGeoJSON.features !== undefined
    ) {
      const features = selectedGeoJSON.features;
      markerCoordinates = (() => {
        let updatedCoordinates = [];
        for (const feature of features) {
          const geometry = {
            latlons: feature.geometry.coordinates.flat(2),
            base_height: feature.properties.base_height,
            height: feature.properties.height,
            roomID: feature.properties.room,
          };
          // console.log("roomID is", feature.properties.room)
          updatedCoordinates = updatedCoordinates.concat(geometry);
        }

        return updatedCoordinates; // Return the updated state
        
      })();
      // console.log("updated coordinates", markerCoordinates)
      // console.log("markerCoordinates",markerCoordinates)
    }

    if (markerCoordinates.length !== 0) {
      let roomList = [];
      let labelIndex = 0;
      for (const markerCoordinate of markerCoordinates) {
        if (markerCoordinate.height - 1 == 0) {
          const roomNUM = markerCoordinate.roomID;
          if (!roomList.includes(roomNUM)) {
            const newMarker = markerCoordinate.latlons.map(
              (latlons, index, coordArray) => {
                if (index % 2 == 0) {
                  return {
                    coords: [latlons, coordArray[index + 1]],
                    color: "",
                    building: buildingName
                  };
                }
              }
            );

            let centerLabel = computeCenterLabelPosition(newMarker);

            

            if (
              /^FW\d+/.test(roomNUM) ||
              /^MW\d+/.test(roomNUM) ||
              /^S\d+/.test(roomNUM) ||
              /^E\d+/.test(roomNUM) 
              // roomNUM !== "S" &&
              // roomNUM !== "E" &&
              // roomNUM !== "FW" &&
              // roomNUM !== "MW"
            ) {
              // console.log("find icon. RoomNUM is ", roomNUM)
              labelIndex = labelIndex + 1;
              
              // switch (roomNUM) {
              //   case /^S\d+$/.test(roomNUM):
              //     iconMarkers.push({
              //       id: "stairs" + labelIndex,
              //       coordinates: centerLabel.position,
              //       icon: "stairs",
              //     });
              //     break;
              //   case /^E\d+$/.test(roomNUM):
              //     iconMarkers.push({
              //       id: "elevator" + labelIndex,
              //       coordinates: centerLabel.position,
              //       icon: "elevator",
              //     });
              //     break;
              //   case /^FW\d+$/.test(roomNUM):
              //     iconMarkers.push({
              //       id: "woman_washroom" + labelIndex,
              //       coordinates: centerLabel.position,
              //       icon: "woman_washroom",
              //     });
              //     break;
              //   case  /^MW\d+$/.test(roomNUM):
              //     iconMarkers.push({
              //       id: "man_washroom" + labelIndex,
              //       coordinates: centerLabel.position,
              //       icon: "man_washroom",
              //     });
              //     break;
              //   default:
              //     console.log("Invalid room entered.");
              // }

              if(/^S\d+/.test(roomNUM)){
                iconMarkers.push({
                  id: roomNUM,
                  coordinates: centerLabel.position,
                  icon: "stairs",
                });
              }else if(/^E\d+/.test(roomNUM)) {
                iconMarkers.push({
                  id: roomNUM,
                  coordinates: centerLabel.position,
                  icon: "elevator",
                });
              }else if(/^FW\d+/.test(roomNUM)){
                iconMarkers.push({
                  id: roomNUM,
                  coordinates: centerLabel.position,
                  icon: "woman_washroom",
                });  
              }else if(/^MW\d+/.test(roomNUM)){
                iconMarkers.push({
                  id: roomNUM,
                  coordinates: centerLabel.position,
                  icon: "man_washroom",
                });
              } 
             
            } else {
              roomList.push(roomNUM);
              textMarkers.push({
                coords: centerLabel.position,
                color: "",
                id: roomNUM,
                building:buildingName
              });
            }
          }
        } else {
          const roomNUM = markerCoordinate.roomID;

          if (!roomList.includes(roomNUM)) {
            const newMarker = markerCoordinate.latlons.map(
              (latlons, index, coordArray) => {
                if (index % 2 == 0) {
                  return {
                    coords: [latlons, coordArray[index + 1]],
                    color: "",
                    buidling: buildingName
                  };
                }
              }
            );
            let height = markerCoordinate.height / 21.42;
            let centerLabel = computeCenterLabelPosition(newMarker);

            if (
              // roomNUM !== "S" &&
              // roomNUM !== "E" &&
              // roomNUM !== "FW" &&
              // roomNUM !== "MW"
              /^FW\d+/.test(roomNUM) ||
              /^MW\d+/.test(roomNUM) ||
              /^S\d+/.test(roomNUM) ||
              /^E\d+/.test(roomNUM) 
            ) {
              if(/^S\d+/.test(roomNUM)){
                iconMarkers.push({
                  id: "stairs" + labelIndex,
                  coordinates: raise(centerLabel.position, height),
                  icon: "stairs",
                });
              }else if(/^E\d+/.test(roomNUM)) {
                iconMarkers.push({
                  id: "elevator" + labelIndex,
                  coordinates: raise(centerLabel.position, height),
                  icon: "elevator",
                });
              }else if(/^FW\d+/.test(roomNUM)){
                iconMarkers.push({
                  id: "woman_washroom" + labelIndex,
                  coordinates: raise(centerLabel.position, height),
                  icon: "woman_washroom",
                });  
              }else if(/^MW\d+/.test(roomNUM)){
                iconMarkers.push({
                  id: "man_washroom" + labelIndex,
                  coordinates: raise(centerLabel.position, height),
                  icon: "man_washroom",
                });
              } 
            } else {
              roomList.push(roomNUM);
              textMarkers.push({
                coords: raise(centerLabel.position, height),
                color: "",
                id: roomNUM,
                building: buildingName
              });
            }
          }
        }
      }

      setTextMarkers(textMarkers.concat(textRaisedMarkers));

      const geoJSONMarkers = {
        features: iconMarkers.map((marker) => ({
          type: "Feature",
          id: marker.id,
          properties: {
            icon: marker.icon,
          },
          geometry: {
            type: "Point",
            coordinates: marker.coordinates,
          },
        })),
        type: "FeatureCollection",
      };
      // console.log(geoJSONMarkers);
      setIconMarkers(geoJSONMarkers);
    } else {
      console.log("markerCoordinates.length = 0");
      setTextMarkers([]);
      setIconMarkers([]);
    }
  };

  useEffect(() => {
    console.log("isCameraMoving", isCameraMoving);
    let intervalId;
    if (mapState) {
      // Start the interval when isActive is true
      // console.log("update the label");
      updateLabel();
    }
  }, [mapState, selectedGeoJSON, floorNumber]);

  const isIconMarkersNotEmpty = Object.keys(IconMarkers).length > 0;
  // console.log("IconMarkers",IconMarkers)
  // console.log(isIconMarkersNotEmpty)
  return (
    <>
      {TextMarkers.map((AllMarker, i) => {
        return (
          <MapboxGL.MarkerView
            key={`RaisedMarkerView-${i}-${AllMarker.coords.join("-")}`}
            coordinate={AllMarker.coords}
            allowOverlap={false}
          >
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
      })}

      <Images
        images={{
          stairs: stairs_img,
          elevator: elevator_img,
          man_washroom: man_img,
          woman_washroom: woman_img,
        }}
      />
      {isIconMarkersNotEmpty && (
        <MapboxGL.ShapeSource id="symbolSource" shape={IconMarkers}>
          <MapboxGL.SymbolLayer
            id="symbolLayer"
            minZoomLevel={1}
            style={{
              iconImage: "{icon}",
              iconSize: 0.5,
              iconAllowOverlap: true,
            }}
          />
        </MapboxGL.ShapeSource>
      )}
    </>
  );
};
export default IndoorLabel;
