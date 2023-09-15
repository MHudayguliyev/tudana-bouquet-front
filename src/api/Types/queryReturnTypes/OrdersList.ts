export type Orders = {
    order_guid: string
    order_code: string
    order_valid_dt: string
    mat_unit_amount: string
    order_total: string
    order_nettotal: string
    order_desc: string
    order_delivery_dt: string
    partner_name: string
    partner_guid: string
    partner_code: string
    partner_telephone: string
    partner_address: string
    status_name: string
    status_guid: string
    user_guid: string
    user_name: string
    wh_name: string
    isselected: boolean,
    edit_ord_allowed: boolean,
    status_code: string
}

export type OrdersList = {
    totalRowCount: number,
    ordersCount: number
    ordersTotalAmount: number
    ordersTotalNettotal: number
    orders: Orders[]
}
