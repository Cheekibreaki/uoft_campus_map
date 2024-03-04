import React, { useState, Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SearchBar, ButtonGroup } from '@rneui/themed';
import { useSelector, useDispatch } from "react-redux";
import { setGeoJSON } from "../redux/actions/getGeoJsonReducer";
import Realm from 'realm';
import styles from '../styles/searchBar'

class SwitchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      searchResults: [1,2,3,4,5,6,7],
    };
  }

  // const selectedGeoJSON = useSelector(
  //   (store) => store.GeoJSONs.selectedGeoJSON
  // );

  handleSearch = (searchQuery) => {
    this.setState({ searchQuery });
    // Realm.open({ schema: [Building] })
    //   .then(realm => {
    //     const results = realm.objects('Building').filtered();
    //     this.setState({ searchResults: results });
    //   })
    //   .catch(error => {
    //     console.error('Error opening Realm:', error);
    //   });
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
        />
        {/* <View style={{ height: 200 }}>
          <ScrollView showsVerticalScrollIndicator={true}>
            <ButtonGroup
              buttons={this.state.searchResults}
              
              vertical = {true}
            />
            </ScrollView>
          </View> */}
      </View>
    );
  }
}

export default SwitchComponent;

