import React, { useState , useEffect, useCallback  } from 'react';
import { View, StyleSheet , Pressable} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { Slider } from '@rneui/base';
import { Position } from 'geojson';
// import { Camera, Logger, MapView, MarkerView } from '@rnmapbox/maps';
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

function computeLabelPosition(array){
  if(array.length === 0){
    return {position:null};
  }
  let max = array[0];
  let min = array[0];
  for(let i = 1 ; i < array.length;i++){
    if(array[i][0] > max[0]){
      max[0] = array[i][0];
    }
    if(array[i][1] > max[1]){
      max[1] = array[i][1];
    }
    if(array[i][0] < min[0]){
      min[0] = array[i][0];
    }
    if(array[i][1] <min[1]){
      min[1] = array[i][1];
    }
  }
  
  position = [(max[0]+min[0])/2,(max[1]+min[1])/2];

  

  return {position};
}

type MarkerConfig = {
coords: Position;
color: string;
};

const layerStyles = {
building: {
    fillExtrusionOpacity: 0.5,
    fillExtrusionHeight: ['get', 'height'],
    fillExtrusionBase: ['get', 'base_height'],
    fillExtrusionColor: ['get', 'color'],
},
};

const IndoorBuilding = (props: BaseExampleProps) => {

const [markers, setMarkers] = useState([]);
const [markerCoordinates, setMarkerCoordinates] = useState([]);
const [sliderValue, setSliderValue] = useState(-80);
const [selectedGeoJSON, setSelectedGeoJSON] = useState(null);
const [allowOverlap, setAllowOverlap] = useState(false);
// const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  const onPress = async (e) => {
    
    const { screenPointX, screenPointY } = e.properties;
    console.log("screenPointX, screenPointY", screenPointX, screenPointY)
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

// const SetMarkerCoordinates = useCallback(() => {
//     const newMarkers = new Array(markerCount).fill(0).map((o, i) => {
//         return {
//         coords: [
//             centerCoord[0] + (Math.random() - 0.5) * 0.008,
//             centerCoord[1] + (Math.random() - 0.5) * 0.008,
//         ],
//         color: allColors[i % allColors.length],
//         };
//     });

//     setMarkers(newMarkers);
//     }, []);


// useEffect(() => {
//     const handleMapRenderComplete = () => {
//         // Perform actions after map and layers have finished rendering
//         console.log('Map and layers rendered completely');
//       };

//     MapboxGL.onDidFinishRenderingMapFully(handleMapRenderComplete);

//     return () => {
//         MapboxGL.offDidFinishRenderingMapFully(handleMapRenderComplete);
//       };
//     // SetMarkerCoordinates();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
// }, []);


const [isMapRendered, setIsMapRendered] = useState(false);
const [isCameraMoving, setIsCameraMoving] = useState(false);
const handleMapRenderComplete = useCallback(() => {
setIsMapRendered(true);
}, []);

const handleRegionDidChange = async () => {
    setIsCameraMoving(false);
    console.log('Camera movement completed');
    // Perform actions after camera movement is completed
    const featureCollection = await map.queryRenderedFeaturesInRect(
        [],
        null,
        ['building3d']
    );
      
      
      if (featureCollection.features.length) {
        setSelectedGeoJSON(featureCollection);
        console.log(selectedGeoJSON);
      } else {
        console.log("no JSON found")
        setSelectedGeoJSON(null);
      }
  };

  const handleRegionChanging = async () => {
    setIsCameraMoving(true);
    console.log("moving")
    
    const featureCollection = await map.queryRenderedFeaturesInRect(
      [],
      null,
      ['building3d']
    );
    if (featureCollection.features.length) {
      setSelectedGeoJSON(featureCollection);
    }
    const features = selectedGeoJSON.features;
    console.log(features.length)
    setMarkerCoordinates([])

    setMarkerCoordinates((prevCoordinates) => {
      let updatedCoordinates = prevCoordinates.slice(); // Create a copy of the previous state
    
      for (const feature of features) {
        const geometry = {"latlons": feature.geometry.coordinates.flat(),"base_height": feature.properties.base_height, "height": feature.properties.height };
        updatedCoordinates = updatedCoordinates.concat(geometry);
      }
    
      return updatedCoordinates; // Return the updated state
    });


    // console.log(markerCoordinates);
    
    // setMarkers(markerCoordinates[0].latlons)
    // console.log(markerCoordinates[0].latlons) 
    
    // const newMarkers = new Array(markers.length).fill(0).map((o, i) => {

    //         const position = computeLabelPosition(markerCoordinates[0].latlons);
      
    //         return {
    //           coords: position,
    //           color: allColors[255],
    //         };
    //     });
      
      
    // setMarkers(newMarkers)
    // console.log(markers)

    

    // useEffect(() => {
    //   
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);
    



    // Perform actions before camera movement starts
  };

useEffect(() => {
if (isMapRendered) {
    const fetchData = async () => {
        if (isMapRendered) {
          console.log('Map and layers rendered completely');
        }
      };
    
      fetchData();
}
}, [isMapRendered]);

const onSliderChange = (value) => {
    setSliderValue(value);
};

return (
    <Page {...props}>
    <MapboxGL.MapView
        ref={(ref) => (map = ref)}
        onPress={onPress}
        style={sheet.matchParent}
        onLayout={handleMapRenderComplete}
        
        onCameraChanged={handleRegionChanging}
        onMapIdle={handleRegionDidChange}

    >
        <MapboxGL.Camera
        zoomLevel={16}
        pitch={40}
        heading={30}
        centerCoordinate={[-87.61694, 41.86625]}
        />

        {markers.map((marker, i) => {
          return (
            <MapboxGL.MarkerView
              key={`MarkerView-${marker.coords.join('-')}`}
              coordinate={marker.coords}
              
              allowOverlap={allowOverlap}
              isSelected={i === selectedIndex}
              style={{ display: show ? 'flex' : 'none' }}
            >
              {/* <Pressable
                style={[
                  styles.markerBox,
                  { backgroundColor: marker.color, padding: 4 * size },
                ]}
                onPress={() =>
                  setSelectedIndex((index) => (index === i ? -1 : i))
                }
              >
                <Text style={styles.markerText}>Marker {i + 1}</Text>
              </Pressable> */}
            </MapboxGL.MarkerView>
          );
        })}



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

export default IndoorBuilding;
