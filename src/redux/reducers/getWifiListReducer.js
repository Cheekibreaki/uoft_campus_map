const initialState ={
    wifiList: [],

};

function IsGrantedReducer (state = initialState,action) {
    switch (action.type) {
        case 'SET_WIFILIST':
            return {
                ...state,
                wifiList: action.payload
            };
        
        default:
            return state;    
    }
    
}