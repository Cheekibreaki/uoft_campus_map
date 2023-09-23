import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SearchBar } from '@rneui/themed';

import Realm from 'realm';
import styles from '../styles/searchBar'

const SwitchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (searchQuery) => {
    setSearchQuery(searchQuery);
    // Realm.open({ schema: [Building] })
    //   .then((realm) => {
    //     const results = realm.objects('Building').filtered(
    //       
    //     );
    //     setSearchResults(results);
    //   })
    //   .catch((error) => {
    //     console.error('Error opening Realm:', error);
    //   });
  };



  return (
    <View style={styles.container}>
      <SearchBar
      placeholder="Search for a building/room"
      onChangeText={handleSearch}
      round={true}
      lightTheme = {true}
      value = {searchQuery}
      />
    </View>
  );

  // return (
  //   <View style={styles.container}>
  //     <View style={styles.searchContainer}>
  //       <TextInput
  //         style={styles.input}
  //         placeholder="Search for a building/room"
  //         onChangeText={(text) => setSearchQuery(text)}
  //         onSubmitEditing={handleSearch}
  //       />
  //     </View>
  //     <FlatList
  //       style={styles.results}
  //       data={searchResults}
  //       keyExtractor={(item) => item.id.toString()}
  //       renderItem={({ item }) => (
  //         <View>
  //           <Text>{item.name}</Text>
  //           {/* Render other place details */}
  //         </View>
  //       )}
  //     />
  //   </View>
  // );
};



export default SwitchComponent;