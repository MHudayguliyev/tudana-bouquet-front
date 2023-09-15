import { AllMaterialsType } from "./queryReturnTypes"

export type GetOrderProps = {
    page: number
    limit: number
    startDate: string
    endDate: string
    warehouseGuids: Array<string>
    userGuids: Array<string>
    statusGuids: Array<string>
    partnerGuids: Array<string>
    calculateValue: string
    calculateMin: string
    calculateMax: string
    search: string,
    mfd: string
}

export interface ConfirmOrder {
    order_code: string
    order_valid_dt: string
    order_delivery_dt: string
    mat_unit_amount: number
    order_desc: string
    order_total: number
    partner_guid: string
    warehouse_guid: string
    status_guid: string
    orders_line: {
        row_id: number
        ord_line_amount: number
        ord_line_price_total: number
        ord_line_disc_percent: number
        ord_line_disc_amount: number
        ord_line_price_nettotal: number
        ord_line_desc: string | any
        ord_line_price: number
        price_type_guid: string
        line_row_id_front: number
    }[],
}

export interface ConfirmEditedOrder extends ConfirmOrder {
    order_guid: string
}

export type EditClient = {
    cl_code: string,
    cl_guid: string,
    cl_name: string,
    cl_full_name: string,
    cl_address: string,
    cl_telephone: string | number,
    cl_add_address?: string,
    cl_add_telephone?: string | number
}

export type AllMaterialList = {
    total_row_count: number
    data: AllMaterialsType[]
}

export type ExistImageItemTypes = {
    row_id: number
    image_guid: string
    mtrl_attr_unit_row_id: number
    image_name: string
    is_image_main: boolean
}

export type ExistImageTypes = {
    status: string
    data: ExistImageItemTypes[]
    imagesPath: string
}