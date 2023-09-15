import {
    SetGeneralDashboardData,
    SetDashboardStatistics,
    SetTopCustomers,
    SetLatestOrders,
    SetCalendarData,
    SetStatusId
} from '../types/DashboardTypes'


const setDashboardLoading = (bool: boolean) => {
    return {
        type: 'SET_DASHBOARD_LOADING',
        payload: bool
    }
}

const setGeneralDashboardData = (data: any): SetGeneralDashboardData => {
    return {
        type: 'SET_GENERAL_DASHBOARD_DATA',
        payload: data
    }
}

const setDashboardStatistics = (data: any): SetDashboardStatistics => {
    return {
        type: 'SET_DASHBOARD_STATISTICS',
        payload: data
    }
}

const setTopCustomers = (data: any): SetTopCustomers => {
    return {
        type: 'SET_TOP_CUSTOMERS',
        payload: data
    }
}

const setLatestOrders = (data: any): SetLatestOrders => {
    return {
        type: 'SET_LATEST_ORDERS',
        payload: data
    }
}

const setCalendarData = (data: any): SetCalendarData => {
    return {
        type: "SET_CALENDAR_DATA",
        payload: data
    }
}

const setStatusId = (id: string): SetStatusId => {
    return {
        type: 'SET_STATUS_ID',
        payload: id
    }
}

const exportDefault = {
    setDashboardLoading,
    setGeneralDashboardData,
    setDashboardStatistics,
    setLatestOrders,
    setTopCustomers,
    setCalendarData,
    setStatusId
}

export default exportDefault
