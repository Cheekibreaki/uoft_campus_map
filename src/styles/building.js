import { StyleSheet } from 'react-native';

let styles = StyleSheet.create({
    Contour:{
        fillExtrusionOpacity: 0.5,
        fillExtrusionHeight: ["get", "height"],
        fillExtrusionBase: ["get", "base_height"],
        fillExtrusionColor: ["get", "color"],
      },

    IndoorBuilding: {
        fillExtrusionOpacity: 0.5,
        fillExtrusionHeight: ["get", "height"],
        fillExtrusionBase: ["get", "base_height"],
        fillExtrusionColor: ["get", "color"],
      },

  });

export default styles;