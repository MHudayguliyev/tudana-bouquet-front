import { AnyAction } from "redux";

const initialState = {
    show: false,
}

const ClientsReducer = (state = initialState, action: AnyAction) => {
    switch(action.type){
        case 'SET_MODAL':
            return {
                ...state,
                show: action.payload
            }
        default:
            return state
    }
}

export default ClientsReducer
 
