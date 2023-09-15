import { combineReducers, configureStore } from '@reduxjs/toolkit';
// reducers
import AuthReducer from './reducers/AuthReducer';
import MaterialReducer from './reducers/MaterialReducer';
import ThemeReducer from './reducers/ThemeReducer';
import ClientsReducer from './reducers/ClientsReducer';
import DashboardReducer from './reducers/DashboardReducer';

const store = configureStore({
   reducer: {
      themeReducer: ThemeReducer,
      authReducer: AuthReducer,
      materialReducer: MaterialReducer,
      dashboardReducer: DashboardReducer,
      clientsReducer: ClientsReducer
   },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {themeReducer: ThemeReducer }
export type AppDispatch = typeof store.dispatch;