
const initialState ={
    selectedGeoJSON: {},

};

function GeoJsonReducer (state = initialState,action) {
    switch (action.type) {
        case 'SET_GEOJSON':
            return {
                ...state,
                selectedGeoJSON: action.payload
            };
        
        default:
            return state;    
    }
    
}






export default GeoJsonReducer;