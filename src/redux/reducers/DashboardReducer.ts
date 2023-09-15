import { AnyAction } from "redux";
import {InitialDashboardState} from '../types/DashboardTypes'

const initialState: InitialDashboardState = {
    dashboardStatistics: [],
    generalDashboardData: {total_income: 0, total_orders: 0, total_sales: 0, clients_count: 0},
    latestOrders: [],
    topCustomers: [],
    calendarData: [],
    dashboardLoading: false,
    statusId: ''
}

const DashboardReducer = (state=initialState, action:AnyAction) => {
    switch(action.type) {
        case 'SET_DASHBOARD_LOADING': 
            return {
                ...state, 
                dashboardLoading: action.payload
            }
        case 'SET_DASHBOARD_STATISTICS':
            return {
                ...state, 
                dashboardStatistics: action.payload
            }

        case 'SET_GENERAL_DASHBOARD_DATA': 
            return {
                ...state,
                generalDashboardData: action.payload
            }
        case 'SET_TOP_CUSTOMERS': 
            return {
            ...state,
            topCustomers: action.payload
        }
        case 'SET_LATEST_ORDERS': 
            return {
            ...state,
            latestOrders: action.payload
        }
        case 'SET_CALENDAR_DATA': 
            return {
                ...state,
                calendarData: action.payload
            }
        case 'SET_STATUS_ID': 
            return {
                ...state,
                statusId: action.payload
            }
        default: 
            return state
    }
}

export default DashboardReducer