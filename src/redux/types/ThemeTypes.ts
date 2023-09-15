export type ThemeMode = 'theme-mode-light' | 'theme-mode-dark';
export type ThemeColors = 'theme-color-blue' | 'theme-color-red' | 'theme-color-cyan' | 'theme-color-green' | 'theme-color-orange';

export interface SetMode {
   type: "SET_MODE",
   payload: ThemeMode
}
export interface SetColor {
   type: "SET_COLOR",
   payload: ThemeColors
}
export interface ToggleSidebar {
   type: "TOGGLE_SIDEBAR",
   payload: boolean
}
export interface ToggleFixedOrderFilter {
   type: "TOGGLE_ORDER_FILTER",
   payload: boolean
}