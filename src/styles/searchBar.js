import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%'
  },
  barContainer: {
    backgroundColor: 'transparent', // Make container transparent
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent'
  },
  inputContainerStyle: {
    backgroundColor: 'white', // Make container transparent
    borderBottomColor: 'white',
    borderTopColor: 'white'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
  }
});

export default styles;