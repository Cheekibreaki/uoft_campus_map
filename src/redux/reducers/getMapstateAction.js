const initialState ={
    MapState: {},
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