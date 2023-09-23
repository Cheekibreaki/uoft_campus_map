const initialState ={
    hideUIElements: false,

};

function HideUIElementsReducer (state = initialState,action) {
    switch (action.type) {
        case 'SET_HIDEUIELEMENT':
            return {
                ...state,
                hideUIElements: action.payload
            };
        
        default:
            return state;    
    }
    
}






export default HideUIElementsReducer;