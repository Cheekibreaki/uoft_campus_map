const initialState ={
    GeoJSONInScreen: {},

};

function GeoJsonInScreenReducer (state = initialState,action) {
    switch (action.type) {
        case 'SET_GEOJSONINSCREEN':
            return {
                ...state,
                GeoJSONInScreen: action.payload
            };
        
        default:
            return state;    
    }
    
}






export default GeoJsonInScreenReducer;