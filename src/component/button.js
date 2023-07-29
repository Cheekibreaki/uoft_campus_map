import buttonStyles from "../styles/button";
import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { View,Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import {useSelector, useDispatch} from 'react-redux';
import {setFilter} from '../redux/actions/setFilterAction';

const ButtonPanel = () => {
    let floorNumbers = ['B', 1, 2, 3, 4, 5, 6, 7, 8];
    floorNumbers = floorNumbers.reverse()
    
    const dispatch = useDispatch();

    const handleButtonPress = (floorNumber) => {
        console.log(floorNumber);
         dispatch(setFilter([['all',['==', 'room', 'contour'],['!=', 'floor', floorNumber]],['all',['!=', 'room', 'contour'],['==', 'floor', floorNumber]]])); 
    };


    return (
      <View style={buttonStyles.buttonPanelContainer}>
        {floorNumbers.map((floorNumber) => (
          <TouchableOpacity 
          key={floorNumber} 
          style={buttonStyles.button}
          onPress={()=>handleButtonPress(floorNumber)}
          >
            <Text style={buttonStyles.buttonText}>{floorNumber}</Text>
            
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  export default ButtonPanel;