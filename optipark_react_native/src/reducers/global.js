let defaultState = {
    selected: {},
    path:[],
    sensor:"",
}


const global = (state = defaultState, action) => {
    switch (action.type) {
        case 'START-SESSION':{
            return{
                ...state,
                isParked:action.payload
            }
        }
        case 'SET-SELECTED':
            return{
                ...state,
                selected:action.payload,
            };
        case 'ASSIGN-SPOT':        
            return{
                ...state,
                path:action.payload.path,
                sensor:action.payload.spot,
            };
        default:        
            return state;
    }
}

export default global;