const initialState ={
    selectRoom: {},
};

function SelectRoomReducer (state = initialState,action) {
    switch (action.type) {
        case 'SET_SELECTROOM':
            return {
                ...state,
                selectRoom: action.payload
            };
        
        default:
            return state;    
    }
    
}






export default SelectRoomReducer;