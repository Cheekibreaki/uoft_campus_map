const initialState ={
    isCameraMoving: false,

};

function IsCameraMovingReducer (state = initialState,action) {
    switch (action.type) {
        case 'SET_ISCAMERAMOVING':
            return {
                ...state,
                isCameraMoving: action.payload
            };
        
        default:
            return state;    
    }
    
}






export default IsCameraMovingReducer;