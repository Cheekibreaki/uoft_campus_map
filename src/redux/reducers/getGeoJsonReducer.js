const initialState ={
    selectedGeoJSON: [],
};

export default (state = initialState,action)=>{
    switch (action.type) {
        case 'GET_GEOJSON':
            return {
                selectedGeoJSON: action.payload
            };
        default:
            return state;    
    }
    
};