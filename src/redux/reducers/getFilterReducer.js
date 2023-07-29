const initialState ={
    filter:[['==', 'room', 'contour'],['>','floor',9]],

};

function FilterReducer (state = initialState,action) {
    switch (action.type) {
        case 'SET_FILTER':
            return {
                ...state,
                filter: action.payload
            };
        
        default:
            return state;    
    }
    
}






export default FilterReducer;