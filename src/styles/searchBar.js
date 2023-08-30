import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 25,
        left:20,
        width: '100%'
      },
      searchContainer: {
        backgroundColor: 'white',
        width: '80%', 
        marginTop: 0, 
      },
      input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 8,
      },
      results: {
        flex: 1,
        width: '80%', 
        marginTop: 20, 
      },
});

export default styles;