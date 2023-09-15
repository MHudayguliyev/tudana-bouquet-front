import { AnyAction } from "redux";
import { SetColor, SetMode, ToggleSidebar } from "../types/ThemeTypes";


type Actions = SetMode | SetColor | ToggleSidebar;

const initialState = {
  mode: '',
  color: '',
  isOpenSidebar: false,
  isFixedOrderFilter: false,
}

const ThemeReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload,
      };
    case 'SET_COLOR':
      return {
        ...state,
        color: action.payload,
      };
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        isOpenSidebar: action.payload,
      };
    case 'TOGGLE_ORDER_FILTER':
      return {
        ...state,
        isFixedOrderFilter: action.payload,
      };
    default:
      return state;
  }
};

export default ThemeReducer;
