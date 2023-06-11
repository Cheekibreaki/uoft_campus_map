import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { Slider } from '@rneui/base';

import sheet from '../styles/sheet';
import colors from '../styles/colors';
import indoorMapGeoJSON from '../assets/indoor_3d_map.json';
import Page from '../common/Page';
import BaseExamplePropTypes from '../common/BaseExamplePropTypes';




const styles = StyleSheet.create({
  slider: {
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'center',
    maxHeight: 60,
    paddingHorizontal: 24,
  },
});

const layerStyles = {
  building: {
    fillExtrusionOpacity: 0.5,
    fillExtrusionHeight: ['get', 'height'],
    fillExtrusionBase: ['get', 'base_height'],
    fillExtrusionColor: ['get', 'color'],
    // fillExtrusionColorTransition: {duration: 2000, delay: 0},
  },
};

// const IndoorBuilding = memo((props: BaseExampleProps) => {
//     const [sliderValue, setSliderValue] = useState(-80);
//     const [selectedGeoJSON, setSelectedGeoJSON] = useState(null);
//     const onPress = async onPress(e) {
//         console.log("test2")
//         const { screenPointX, screenPointY } = e.properties;

//         const featureCollection = await map.queryRenderedFeaturesAtPoint(
//             [screenPointX, screenPointY],
//             null,
//             ['building3d'],
//         );

//         if (featureCollection.features.length) {
//             setSelectedGeoJSON(featureCollection);
//             // console.log( JSON.stringify(this.state.selectedGeoJSON, null, 2) );
//             console.log(this.state.selectedGeoJSON);
//         } else {
//             setSelectedGeoJSON(null);
//         }
//     }

//     const onSliderChange = (value) => {
//         setSliderValue(value);
//       };
    

//     return (
//         <Page {...props} >
//           <MapboxGL.MapView
//             ref={(ref) => (map = ref)}
//             onPress={onPress}
//             style={sheet.matchParent}
//           >
//             <MapboxGL.Camera
//               zoomLevel={16}
//               pitch={40}
//               heading={20}
//               centerCoordinate={[-87.61694, 41.86625]}
//             />
  
//             <MapboxGL.Light
//               style={{ position: [5, 90, sliderValue] }}
//             />
  
//             <MapboxGL.ShapeSource
//               id="indoorBuildingSource"
//               shape={indoorMapGeoJSON}
//             >
//               <MapboxGL.FillExtrusionLayer
//                 id="building3d"
//                 style={layerStyles.building}
//               />
//             </MapboxGL.ShapeSource>
//           </MapboxGL.MapView>
  
//           <View style={styles.slider}>
//             <Slider
//               value={sliderValue}
//               onValueChange={onSliderChange}
//               thumbTintColor={colors.primary.blue}
//               minimumValue={-180}
//               maximumValue={180}
//               thumbTouchSize={{ width: 44, height: 44 }}
//               maximumTrackTintColor={colors.secondary.purpleLight}
//               minimumTrackTintColor={colors.secondary.purpleDark}
//             />
//           </View>
//         </Page>
//       );

// });

const IndoorBuilding = (props: BaseExampleProps) => {
  const [sliderValue, setSliderValue] = useState(-80);
  const [selectedGeoJSON, setSelectedGeoJSON] = useState(null);

  const onPress = async (e) => {
    console.log("test2");
    const { screenPointX, screenPointY } = e.properties;

    const featureCollection = await map.queryRenderedFeaturesAtPoint(
      [screenPointX, screenPointY],
      null,
      ['building3d']
    );

    if (featureCollection.features.length) {
      setSelectedGeoJSON(featureCollection);
      console.log(selectedGeoJSON);
    } else {
      setSelectedGeoJSON(null);
    }
  };

  const onSliderChange = (value) => {
    setSliderValue(value);
  };

  return (
    <Page {...props}>
      <MapboxGL.MapView
        ref={(ref) => (map = ref)}
        onPress={onPress}
        style={sheet.matchParent}
      >
        <MapboxGL.Camera
          zoomLevel={16}
          pitch={40}
          heading={20}
          centerCoordinate={[-87.61694, 41.86625]}
        />

        <MapboxGL.Light style={{ position: [5, 90, sliderValue] }} />

        <MapboxGL.ShapeSource id="indoorBuildingSource" shape={indoorMapGeoJSON}>
          <MapboxGL.FillExtrusionLayer id="building3d" style={layerStyles.building} />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>

      <View style={styles.slider}>
        <Slider
          value={sliderValue}
          onValueChange={onSliderChange}
          thumbTintColor={colors.primary.blue}
          minimumValue={-180}
          maximumValue={180}
          thumbTouchSize={{ width: 44, height: 44 }}
          maximumTrackTintColor={colors.secondary.purpleLight}
          minimumTrackTintColor={colors.secondary.purpleDark}
        />
      </View>
    </Page>
  );
};






// class IndoorBuilding extends React.Component {
//   static propTypes = {
//     ...BaseExamplePropTypes,
//   };
  
//   constructor(props) {
//     super(props);
//     console.log(props); 
//     this.state = {
//       sliderValue: -80,
//       ...this.emptyState,
      
//     };
    
//     this.onPress = this.onPress.bind(this);
//     this.onSliderChange = this.onSliderChange.bind(this);
//     console.log("abc");
//     console.log(this.state.label);
//   }

//   componentDidMount() {
//     console.log('Component mounted');
//   }

//   get emptyState() {
//     return { selectedGeoJSON: null, selectedCommunityDistrict: -1 };
//   }


//   async onPress(e) {
//     console.log("test2")
//     const { screenPointX, screenPointY } = e.properties;

//     const featureCollection = await this.map.queryRenderedFeaturesAtPoint(
//       [screenPointX, screenPointY],
//       null,
//       ['building3d'],
//     );

//     if (featureCollection.features.length) {
//       this.setState({
//         selectedGeoJSON: featureCollection,
//       });
//       // console.log( JSON.stringify(this.state.selectedGeoJSON, null, 2) );
//       console.log(this.state.selectedGeoJSON);
//     } else {
//       this.setState(this.emptyState);
//     }
//   }

//   onSliderChange(value) {
//     this.setState({ sliderValue: value });
//   }

//   render() {
//     return (
//       <Page {...this.props} >
//         <MapboxGL.MapView
//           ref={(ref) => (this.map = ref)}
//           onPress={this.onPress}
//           style={sheet.matchParent}
//         >
//           <MapboxGL.Camera
//             zoomLevel={16}
//             pitch={40}
//             heading={20}
//             centerCoordinate={[-87.61694, 41.86625]}
//           />

//           <MapboxGL.Light
//             style={{ position: [5, 90, this.state.sliderValue] }}
//           />

//           <MapboxGL.ShapeSource
//             id="indoorBuildingSource"
//             shape={indoorMapGeoJSON}
//           >
//             <MapboxGL.FillExtrusionLayer
//               id="building3d"
//               style={layerStyles.building}
//             />
//           </MapboxGL.ShapeSource>
//         </MapboxGL.MapView>

//         <View style={styles.slider}>
//           <Slider
//             value={this.state.sliderValue}
//             onValueChange={this.onSliderChange}
//             thumbTintColor={colors.primary.blue}
//             minimumValue={-180}
//             maximumValue={180}
//             thumbTouchSize={{ width: 44, height: 44 }}
//             maximumTrackTintColor={colors.secondary.purpleLight}
//             minimumTrackTintColor={colors.secondary.purpleDark}
//           />
//         </View>
//       </Page>
//     );
//   }
// }

export default IndoorBuilding;
