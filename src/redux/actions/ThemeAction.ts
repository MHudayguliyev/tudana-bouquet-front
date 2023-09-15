import { ThemeColors, ThemeMode, SetMode, SetColor, ToggleSidebar, ToggleFixedOrderFilter } from "../types/ThemeTypes";



const setMode = (mode: ThemeMode): SetMode => {
  return {
    type: "SET_MODE",
    payload: mode,
  };
};

const setColor = (color: ThemeColors): SetColor => {
  return {
    type: "SET_COLOR",
    payload: color,
  };
};

const toggleSidebar = (isOpenSidebar: boolean): ToggleSidebar => {
  return {
    type: "TOGGLE_SIDEBAR",
    payload: isOpenSidebar
  }
}

const toggleFixedOrderFilter = (isOpenOrderFilter: boolean): ToggleFixedOrderFilter => {
  return {
    type: "TOGGLE_ORDER_FILTER",
    payload: isOpenOrderFilter
  }
}

const getTheme = () => {
  return {
    type: "GET_THEME",
  };
};

const exportDefault = {
  setColor,
  setMode,
  getTheme,
  toggleSidebar,
  toggleFixedOrderFilter
};

export default exportDefault;
