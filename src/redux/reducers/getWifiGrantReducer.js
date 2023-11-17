const initialState ={
    isGranted: false,

};

function IsGrantedReducer (state = initialState,action) {
    switch (action.type) {
        case 'SET_WIFIGRANT':
            return {
                ...state,
                isGranted: action.payload
            };
        
        default:
            return state;    
    }
    
}