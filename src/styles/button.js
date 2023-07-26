import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    buttonPanelContainer: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      flexDirection: 'column',
      alignItems: 'center',
    },
    button: {
      width: 20,
      height: 20,
      backgroundColor: 'blue', // Customize the button color here
      borderRadius: 0,
      marginVertical: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white', // Customize the button text color here
      fontSize: 18,
    },
  });

export default styles;