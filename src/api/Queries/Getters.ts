import { get } from "@app/api/service/api_helper";
import { AllMaterialList, GetOrderProps } from "../Types/types";
import { ClientList, ClientsListFull, FirmsList, MaterialCategories, MaterialGroups, MaterialList, MaterialsByOrderGuid, OrderData, OrdersList, PrintData, StatusList, UserList, WareHouseList, DashboardStatistcsTypes, TopCustomersType, LatestOrdersType, GroupListType, PriceTypeTypes, PriceValuesTypes, GroupsWithImagesTypes, AllServerImagesTypes } from "../Types/queryReturnTypes";
import { CalendarDataType } from "../Types/queryReturnTypes/DashboardCalendar";
import ClientsForClientsPage from "../Types/queryReturnTypes/ClientsForClientsPage";

export const getWarehouseList = (): Promise<WareHouseList[]> => {
    return get('/orders/get-warehouse-list');
}

export const getStatusList = (): Promise<StatusList[]> => {
    return get('/orders/get-status-list');
}

export const getClientList = (): Promise<ClientList[]> => {
    return get('/orders/get-client-list');
}

export const GetClients = (limit: number, page: number, searchQuery: string): Promise<ClientsForClientsPage[] | any> => {  //// for clients page
    return get(`/clients/get-clients?limit=${limit}&page=${page - 1}&search=${searchQuery}`);
}

export const getUserList = (): Promise<UserList[]> => {
    return get('/orders/get-user-list');
}

export const getMaterialsOfOrder = (guid: string): Promise<MaterialsByOrderGuid[]> => {
    return get<MaterialsByOrderGuid[]>(`/orders/get-materials-by-order?ord_guid=${guid}`);
}

export const getFirms = (): Promise<FirmsList[]> => {
    return get<FirmsList[]>(`/general/get-firms`);
}

export const getClientsFull = (): Promise<ClientsListFull[]> => {
    return get<ClientsListFull[]>(`/create-order/client_list`);
}

export const getMaterialGroups = (): Promise<MaterialGroups[]> => {
    return get<MaterialGroups[]>(`/create-order/groups`);
}

export const getMaterialCategories = (groupGuid: string): Promise<MaterialCategories[]> => {
    return get<MaterialCategories[]>(`/create-order/categories?group_guid=${groupGuid}`);
}

export const getMaterialCategoriesAll = (): Promise<MaterialCategories[]> => {
    return get<MaterialCategories[]>(`/create-order/all_categories`)
}

export const getMaterialList = (mtrlGuid: string): Promise<MaterialList[]> => {
    return get<MaterialList[]>(`/create-order/materials?mtrl_guid=${mtrlGuid}`);
}

export const getPrintData = (clientGuids: string[], orderGuids: string[], config = {}): Promise<PrintData[]> => {
    return get<PrintData[]>(`/orders/get-print-datas?order_guids=${orderGuids}&client_guids=${clientGuids}`, { ...config });
}

export const getOrderCode = (): Promise<string> => {
    return get<string>(`/create-order/generate-code?code=order`);
}

export const getClientCode = (): Promise<string> => {
    return get<string>(`/create-order/generate-code?code=client`);
}

export const getDashboardGeneral = (): any => {
    return get<any>(`dashboard/get-general-statistics`)
}

export const getDashboardStatistcs = (statusId = ''): Promise<DashboardStatistcsTypes[]> => {
    return get<DashboardStatistcsTypes[]>(`dashboard/get-dashboard-statistics?status_id=${statusId}`)
}

export const getTopCustomers = (): Promise<TopCustomersType[]> => {
    return get<TopCustomersType[]>(`dashboard/get-top-customers`)
}


export const getLatestOrders = (): Promise<LatestOrdersType[]> => {
    return get<LatestOrdersType[]>(`dashboard/get-latest-orders`)
}

export const getCalendarData = (minDate: string, maxDate: string, statusId = ''): Promise<CalendarDataType[]> => {
    return get<CalendarDataType[]>(`dashboard/get-calendar-data?minDate=${minDate}&maxDate=${maxDate}&status_id=${statusId}`)
}

export const getGroupList = (where: string = 'dropdown'): Promise<GroupListType[]> => {
    return get<GroupListType[]>(`/create-order/groups?where=${where}`);
}

export const getAttributeList = (): Promise<GroupListType[]> => {
    return get<GroupListType[]>(`/general/get-all-attributes`);
}

export const getOrders = ({
    page, limit, startDate, endDate,
    warehouseGuids, userGuids, statusGuids,
    calculateValue, calculateMin, calculateMax,
    partnerGuids, search, mfd
}: GetOrderProps): Promise<OrdersList> => {
    return get(`/orders/get-all-orders?page=${page - 1}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&warehouseGuids=${warehouseGuids}&userGuids=${userGuids}&statusGuids=${statusGuids}&partnerGuids=${partnerGuids}&calculateValue=${calculateValue}&calculateMin=${calculateMin}&calculateMax=${calculateMax}&search=${search}&mfd=${mfd}&sortColumn=o.order_valid_dt&sortDirection=desc`)
}

export const getOrderData = (orderGuids: string): Promise<OrderData> => {
    return get<OrderData>(`/general/get-orders-data-for-edit?order_guid=${orderGuids}`);
}


export const getAllMaterialList = (start: number, size: number, globalFilter: string, filters: any[], sorting: any[]): Promise<AllMaterialList> => {
    return get<AllMaterialList>(`/general/all-materials?start=${start}&size=${size}&globalFilter=${globalFilter}&filters=${filters}&sorting=${sorting}`)
}

export const getPriceTypes = (): Promise<PriceTypeTypes> => {
    return get<PriceTypeTypes>(`/general/get-price-types`)
}

export const getPriceValues = (row_id: number): Promise<PriceValuesTypes> => {
    return get<PriceValuesTypes>(`/general/get-price-values-by-pt?mtrl_attr_unit_row_id=${row_id}`)
}

export const getGroupsWithImages = (): Promise<GroupsWithImagesTypes> => {
    return get<GroupsWithImagesTypes>(`/general/get-groups-with-images`)
}

export const getAllServerImages = (): Promise<AllServerImagesTypes> => {
    return get<AllServerImagesTypes>(`/general/get-all-images`)
}