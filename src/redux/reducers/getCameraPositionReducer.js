const initialState = {
    CameraPosition: [],

};

function CameraPositionReducer (state = initialState,action) {
    switch (action.type) {
        case 'SET_CAMERAPOSITION':
            return {
                ...state,
                CameraPosition: action.payload
            };
        
        default:
            return state;    
    }
    
}