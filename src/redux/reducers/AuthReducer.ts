import { AnyAction } from "redux";


const initialState = {
   isAuthorized: false,
}
const AuthReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'SET_IS_AUTHORIZED':
      return {
        ...state,
        isAuthorized: action.payload,
      };
    default:
      return state;
  }
};

export default AuthReducer;
