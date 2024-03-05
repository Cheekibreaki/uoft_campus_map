import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { View, StyleSheet, Pressable, ActivityIndicator,PermissionsAndroid} from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { Slider, Text} from "@rneui/base";
import { Position } from "geojson";
import { Camera, Logger, MapView, MarkerView } from '@rnmapbox/maps';
import colors from "../styles/colors";
import Page from "../common/Page";
import BaseExamplePropTypes from "../common/BaseExamplePropTypes";
import {useSelector, useDispatch} from 'react-redux';
import {setGeoJSON} from "../redux/actions/setGeoJsonAction";
import {setMapState} from "../redux/actions/setMapstateAction";
import IndoorLabel from '../component/IndoorLabel'
import ButtonPanel from "../component/button";
import GeojsonFiles from "../component/renderGeojsonFiles";
import { setIsCameraMoving } from "../redux/actions/setIsCameraMovingAction";
import { setGeoJSONInScreen } from "../redux/actions/setFeatureInScreen";
import { setSelectRoom } from "../redux/actions/setSelectedRoom";
import { setHideUIElement } from "../redux/actions/setHideUIElements";
import {setWifiGrant} from "../redux/actions/setWifiGrant";
// import { setGeoJsonData } from "../redux/actions/setGeoJSONData";
MapboxGL.setAccessToken("pk.eyJ1IjoiamlwaW5nbGkiLCJhIjoiY2xoanYzaGZ1MGxsNjNxbzMxNTdjMHkyOSJ9.81Fnu3ho6z2u8bhS2yRJNA");
import getGeoJSON from "../assets/dataBase/getGeoJSONFromRealm";
import SearchBar from "../component/searchBar";
import fs from 'react-native-fs';
import { Keyboard} from 'react-native';


// import WifiManager from "../component/wifiManager";
import WifiManaging from "react-native-wifi-reborn";
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
    //const zoomLevel = 16;
    const pitch = 40;
    const heading = 30;
    const centerCoordinate = [-79.3973449417775, 43.65997911110146]
    const southwestCoordinate = [ -79.4022460785109, 43.65546033058593]
    const northeastCoordinate = [-79.38955386618444, 43.669756887468886]
    
    let counter = 0
    
    let map = useRef();
    let camera = useRef();
    
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [dataInitialized, setDataInitialized] = useState(false);
    const [cameraPosition, setCameraPosition] = useState(centerCoordinate);
    const [zoomLevel, setzoomLevel] = useState(16);
    
    const dispatch = useDispatch();

    const selectedGeoJSON = useSelector(store=>store.GeoJSONs.selectedGeoJSON);
    // console.log("selectedGeoJSON",selectedGeoJSON);
    const mapState = useSelector(store=>store.MapState.mapState);
    
    // console.log("mapState",mapState);
    // const [selectedGeoJSON, setSelectedGeoJSON] = useState(null);
    const [allowOverlap, setAllowOverlap] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [mapInitialized, setMapInitialized] = useState(false);

    let selectedMarker = useSelector(store=>store.SelectRoom.selectRoom);
    let floorNumber = useSelector(store=>store.Filter.filter)[0]
    const GeoJsonFiles = useSelector(store=>store.AllGeoJSONs.geojsonData);
    let NeedHideUIElement =  useSelector(store=>store.HideUIElements.hideUIElements);
    // console.log("need hide UI? ", NeedHideUIElement)

    const onMapInitialized = () => {
      // This function is called when the map is fully initialized
      setMapInitialized(true);
    };

    const [wifiList, setWifiList] = useState([]);



    useEffect(() => {
      // Listener to detect keyboard opening
      const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
          setKeyboardVisible(true); // Keyboard is visible
      });
      // Listener to detect keyboard closing
      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
          setKeyboardVisible(false); // Keyboard is not visible
      });

      // Clean up function to remove listeners when component unmounts
      return () => {
          keyboardDidShowListener.remove();
          keyboardDidHideListener.remove();
      };
    }, []); // The empty array ensures this effect is only run on mount and unmount



    useEffect(() => {
      const getpremission = async () => {
        let granted;
        try{
            granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Location permission is required for WiFi connections',
                message:
                'This app needs location permission as this is required  ' +
                'to scan for wifi networks.',
                buttonNegative: 'DENY',
                buttonPositive: 'ALLOW',
              },
            );
        }finally{
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // You can now use react-native-wifi-reborn
            console.log('get the premission sucessfully!')
            dispatch(setWifiGrant(true))    
          }
        }
        
        
      }
      getpremission();
      
    }, []);

    useEffect(() => {
      // Fetch WiFi information when the component mounts
      fetchWifiInfo();

      // Optional: You can set up a timer to periodically refresh WiFi information
      const refreshInterval = setInterval(fetchWifiInfo, 10000); // Refresh every 10 seconds

      // Cleanup the interval when the component is unmounted
      return () => clearInterval(refreshInterval);
    }, []);

    const fetchWifiInfo = async () => {
      try {
        const wifiArray = await WifiManaging.loadWifiList();
        setWifiList(wifiArray);
    
      } catch (error) {
        console.error('Error fetching WiFi information:', error);
      }
    };


    useEffect(()=>{
      console.log("WIFI IS: ",wifiList)
    },[wifiList])

    useEffect(() => {
      // This function will be called only once when the component is mounted
      // You can place your initialization code here
      const initializeApp = async () => {
      console.log('App initialized');
      
      
      try{
        await getGeoJSON();
        //setGeojsonData(data)
        setDataInitialized(true)
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        await fs.readFile(fs.DocumentDirectoryPath+ '/BA_Indoor_1_room.json', 'utf8')
        .then((fileData) => {
          const geoJsonObject = JSON.parse(fileData);
          dispatch(setGeoJSON(geoJsonObject))
        })
        .catch((err) => {
          console.log('Error reading JSON file:', err);
        });

        setTimeout(() => {
          setIsLoading(false); 
        }, 3000); 
        } 
      }
      initializeApp();
      
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
        for (const feature of featureCollection.features) {
          const geometry = feature.geometry;
          const roomID = feature.properties.room;
          const isWithinRoom = computePointWithinRoom(geometry.coordinates[0],cursorCoordinate)
          if (isWithinRoom === true) {
            let buildingName = selectedGeoJSON.name;
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


    const renderGeojsonFiles = () =>{ 
      if (mapInitialized && dataInitialized) {
        return (
          <GeojsonFiles />
        );
      }
    }

    
    const renderIndoorLabel = () =>{
      if (typeof mapState !== 'undefined'){
        const zoomlevel = mapState.properties.zoom;
        if (mapInitialized && dataInitialized &&zoomlevel > 17) {
        return (
          <>
            <IndoorLabel/>   
          </>  
        );
      }
      }
      
    }

    const renderButtonPanel = () => {
      // Function to render IndoorLabel on the map
      if (typeof mapState !== 'undefined'){
        const zoomlevel = mapState.properties.zoom;
    
        if (!isKeyboardVisible && mapInitialized && dataInitialized && NeedHideUIElement == false && zoomlevel > 17) {
          return (
            < View>
              <ButtonPanel/>   
            </View>
            
          );
        } else {
          return null;
        }
      }
    };

    const renderSearchBar = () => {
      // Function to render IndoorLabel on the map
      if (mapInitialized) {
        //const GeoJsonFiles = useSelector(store=>store.AllGeoJSONs.geojsonData);
        const updateCameraPosition = (cameraPosition) => {
          setCameraPosition(cameraPosition);
        };

        const updateZoomLevel = (zoomLevel) =>{
          setzoomLevel(zoomLevel);
        }
        return (
          < >
            <SearchBar updateCameraPosition = {updateCameraPosition} updateZoomLevel = {updateZoomLevel}/>   
          </>
          
        );
      } else {        
        return null;
      }
    };

    const LoadingAnimation = () => {
      return (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator animating={isLoading} size="large" color="#007AFF" />
        </View>
      );
    };

    const renderSelcetedMarker = () => {
      // Function to render IndoorLabel on the map
      if (typeof mapState !== 'undefined'){
        const zoomlevel = mapState.properties.zoom;
      
        if (selectedMarker !== null && Object.keys(selectedMarker).length !== 0 
            && mapInitialized && dataInitialized && NeedHideUIElement == false && zoomlevel > 17) {
            
          return (   
          <View style={{ position: 'absolute', bottom: 20, left: 20, width: '80%' }}>
            <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 5 }}>
              <Text>{selectedMarker.id}</Text>
              <Text>{selectedMarker.building}</Text>
            </View>
          </View>
          );
        } else {
          return null;
        }
      }
    };

    // const renderWifiMananger = () => {
    //   // Function to render IndoorLabel on the map
    //   if (mapInitialized) {
        
    //     return (
    //       < >
    //         <WifiManager/>   
    //       </>
          
    //     );
    //   } else {        
    //     return null;
    //   }
    // };

    return (
        // <View ref={componentRef} onLayout={measureComponent}>
      <>
      {isLoading ? (
        
        <LoadingAnimation />
      ) : (
        
        <>
          <MapView 
            ref={map}
            onPress={onPress}
            styleURL={style}
            style={{ flex: 1 }}
            attributionEnabled = {false}
            logoEnabled = {false}
            compassEnabled = {false}
            // compassEnabled={true} 
            // compassStyle={{ top: 16, left: 16 }}
            onWillStartRenderingFrame = {(_state)=>{
              
            }}
            onCameraChanged={(_state) => {
              
              // console.log("_state",_state)
              counter++
              // console.log("yes")
              dispatch(setMapState(_state));
              // queryLayerFeatures()
              //avoid_queryLayerFeatures()
              dispatch(setIsCameraMoving(true))
            }}

            onMapIdle = {() => {
              onMapInitialized()
              dispatch(setIsCameraMoving(false))
             
            }}
            // onDidFinishLoadingMap={onMapInitialized}
            onDidFinishLoadingMap={onMapInitialized}
            scaleBarEnabled = {false}
          >
      
            <Camera
              
              zoomLevel={zoomLevel}
              pitch={pitch}
              heading={heading}
              centerCoordinate={cameraPosition}
              ref={camera}
              bounds={southwestCoordinate, northeastCoordinate}
            />  
            
            {renderGeojsonFiles()}
            {renderIndoorLabel()}

          </MapView>

          {renderSearchBar()}
          {renderButtonPanel()}
          {renderSelcetedMarker()}
          

        </>
      )}
      </>
    );

};

export default MapBoxApp;