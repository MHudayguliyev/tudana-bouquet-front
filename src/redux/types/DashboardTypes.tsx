import { DashboardGeneralTypes, DashboardStatistcsTypes, TopCustomersType, LatestOrdersType } from "@app/api/Types/queryReturnTypes"
import { CalendarDataType } from "@app/api/Types/queryReturnTypes/DashboardCalendar"

export type InitialDashboardState = {
    generalDashboardData: DashboardGeneralTypes,
    dashboardStatistics: DashboardStatistcsTypes,
    topCustomers: TopCustomersType[],
    latestOrders: LatestOrdersType[],
    calendarData: CalendarDataType[]
    dashboardLoading: boolean,
    statusId: string
}


export interface SetGeneralDashboardData  {
    type: 'SET_GENERAL_DASHBOARD_DATA',
    payload: DashboardGeneralTypes
}
export interface SetDashboardStatistics  {
    type: 'SET_DASHBOARD_STATISTICS',
    payload: DashboardStatistcsTypes
}
export interface SetTopCustomers  {
    type: 'SET_TOP_CUSTOMERS',
    payload: TopCustomersType[]
}
export interface SetLatestOrders  {
    type: 'SET_LATEST_ORDERS',
    payload: LatestOrdersType[]
}
export interface SetCalendarData {
    type: 'SET_CALENDAR_DATA',
    payload: CalendarDataType[]
}
export interface SetStatusId {
    type: 'SET_STATUS_ID',
    payload: string
}