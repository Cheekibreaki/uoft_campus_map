const initialState ={
    MapState: {
        properties: {
          center: [0, 0],
          bounds: {
            ne: [0, 0],
            sw: [0, 0],
          },
          zoom: 0,
          heading: 0,
          pitch: 0,
        },
    },
};

function MapStateReducer (state = initialState,action) {
    switch (action.type) {
        case 'SET_MAPSTATE':
            return {
                ...state,
                mapState: action.payload
            };
        
        default:
            return state;    
    }
    
}






export default MapStateReducer;