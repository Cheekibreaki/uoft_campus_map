const initialState ={
    geojsonData: {},

};

function GeoJsonDataReducer (state = initialState,action) {
    switch (action.type) {
        case 'SET_GEOJSONDATA':
            return {
                ...state,
                geojsonData: action.payload
            };
        
        default:
            return state;    
    }
    
}






export default GeoJsonDataReducer;