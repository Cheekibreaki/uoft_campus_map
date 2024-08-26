import React, { useState, Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SearchBar, ButtonGroup } from '@rneui/themed';
import { useSelector, useDispatch } from "react-redux";
import { setGeoJSON } from "../redux/actions/getGeoJsonReducer";
import GeojsonFiles from "../component/renderGeojsonFiles";
import Realm from 'realm';
import {setCameraPosition} from "../redux/actions/getCameraPositionReducer";
import { connect } from 'react-redux';
import styles from '../styles/searchBar'
import MapboxGL from "@rnmapbox/maps";
import fs from 'react-native-fs';

const Building = require('../assets/dataBase/database.js').Building;
const Feature = require('../assets/dataBase/database.js').Feature;
const Geometry = require('../assets/dataBase/database.js').Geometry;

const centerCoordinate = [-79.3973449417775, 43.65997911110146]

function convertStringToCoordinates(inputString) {
  const coordinatesArray = inputString.split(',').map(Number);

  // Group the coordinates in pairs
  const groupedCoordinates = [];
  for (let i = 0; i < coordinatesArray.length; i += 2) {
    groupedCoordinates.push([coordinatesArray[i], coordinatesArray[i + 1]]);
  }

  // Wrap the groupedCoordinates array in another array
  const nestedArray = [groupedCoordinates];

  return nestedArray;
}

function computeCenterCameraPosition(roomPosition) {
  roomPosition = roomPosition[0];
  if (roomPosition.length === 0) {
    return [];
  }
  var max0 = roomPosition[0][0];
  var max1 = roomPosition[0][1];
  var min0 = roomPosition[0][0];
  var min1 = roomPosition[0][1];
  for (let i = 1; i < roomPosition.length; i++) {
    if (roomPosition[i] != undefined) {
      if (roomPosition[i][0] > max0) {
        max0 = roomPosition[i][0];
      }
      if (roomPosition[i][1] > max1) {
        max1 = roomPosition[i][1];
      }
      if (roomPosition[i][0] < min0) {
        min0 = roomPosition[i][0];
      }
      if (roomPosition[i][1] < min1) {
        min1 = roomPosition[i][1];
      }
    }
  }

  let position = [(max0 + min0) / 2, (max1 + min1) / 2];

  return { position };
}

class SwitchComponent extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      searchResults: [],
      isButtonGroupVisible: false
    };
    this.realm = null;
    this.AllSearchResult;
  }

  componentDidMount() {
    this.realm = new Realm({
      schema: [Building,Feature,Geometry], 
      path: fs.DocumentDirectoryPath+'/geoJson.realm', 
    });
  }



  handleSearch = (searchQuery) => {
    let AllSearchResult = new Map();
    // const searchRoomNum = searchQuery.substring(2);
    // const searchBuilding = searchQuery.substring(0,2);
    const match = searchQuery.match(/(\D+)(\d+)/);
    [searchBuilding,searchRoomNum] = ['',''] 
    if(match){
      [searchBuilding,searchRoomNum] = [match[1],match[2]];
    }else{
      searchBuilding = searchQuery;
    }
    searchBuilding=searchBuilding.trimEnd();
    searchRoomNum=searchRoomNum.trimEnd();
    
    //console.log('searchRoomNum is: ',searchRoomNum);
    this.setState({ searchQuery });
    //console.log(searchQuery);
    // Realm.open({ schema: [Building] })
    //   .then(realm => {
    //     const results = realm.objects('Building').filtered();
    //     this.setState({ searchResults: results });
    //   })
    //   .catch(error => {
    //     console.error('Error opening Realm:', error);
    //   });

    const buildings = this.realm.objects('Building');
    //console.log('All GeoJson objects:', buildings);
    const feature = this.realm.objects('Feature');
    const buildingsSearchResult = buildings.filtered('building_name BEGINSWITH[c] $0', searchQuery);

    buildings.forEach(building => {
      if((building.building_id.toLowerCase() == searchBuilding || building.building_id == searchBuilding || building.building_name.startsWith(searchBuilding)||building.building_name.toLowerCase().startsWith(searchBuilding)||building.building_name.toUpperCase().startsWith(searchBuilding))&&(searchBuilding !='' )){

        const buildingName = building.building_name
        console.log(buildingName)
        const buildingID = building.building_id
        const buildingFloorIndeices = building.building_floor_indicies
  
        //console.log('result is: ', buildingName);
        AllSearchResult.set(buildingName, centerCoordinate);
         
        for(let i =0; i <buildingFloorIndeices.length;i++){
          let features = feature.filtered(`feature_building_id == "${buildingID}" AND building_floor == "${buildingFloorIndeices[i]}"`)
  
          if(features.length!==0){
            const rooms = features.filtered('feature_type == "room"')
            rooms.map(room=>{
              if(searchRoomNum){
                if(AllSearchResult.size <= 20 && (room.feature_id).startsWith(searchRoomNum)){
                  AllSearchResult.set(room.feature_id,computeCenterCameraPosition(convertStringToCoordinates(room.feature_geometry.geometry_coordinates)));
                }
              }     
            })
          }   
        }
      }
    })
    //console.log("All search result is: ", AllSearchResult);
    this.state.searchResults = Array.from(AllSearchResult.keys());
    //console.log("search bar displayed result is: ", this.state.searchResults);
    this.AllSearchResult = AllSearchResult;
  };

  handleButtonPress = (index) => {
    // Handle button press based on the index
    console.log(`Button ${index + 1} pressed`);
    const cameraPosition = this.AllSearchResult.get(this.state.searchResults[index]).position;
    console.log("current camera position is: ", cameraPosition);
    this.props.updateCameraPosition(cameraPosition);
    if(this.state.searchResults[index] == 'Bahen Centre for Information Technology'){
      this.props.updateZoomLevel(17);
    }else{
      this.props.updateZoomLevel(20);
    }
    this.setState({ isButtonGroupVisible: false });
    
  };
  
  render() {
    return (
      <View style={styles.container}>
        {/* Assuming SearchBar is a component you have access to or have imported */}
        <SearchBar
          placeholder="Search for a building/room"
          lightTheme={true}
          onChangeText={this.handleSearch}
          value={this.state.searchQuery}
          round={true}
          containerStyle={styles.barContainer}
          inputContainerStyle={styles.inputContainerStyle}
          // onBlur={() => this.setState({ isButtonGroupVisible: false })}
          onFocus={() => this.setState({ isButtonGroupVisible: true })}
        />
        <View style={{ height: 200 }}>{
          this.state.isButtonGroupVisible && this.state.searchQuery.length > 0 &&(<ScrollView showsVerticalScrollIndicator={true}>
            <ButtonGroup
              buttons={this.state.searchResults}
              onPress={this.handleButtonPress}
              vertical = {true}
            />
            </ScrollView>)
        }
          
          </View>
      </View>
    );
  }
}

export default SwitchComponent;

