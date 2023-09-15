import MaterialList from "./MaterialList"

type OrderData = {
    order_guid: string
    order_code: string
    order_valid_dt: string
    order_delivery_dt: string
    mat_unit_amount: string
    order_total: string
    order_nettotal: string
    order_desc: string
    wh_guid: string
    partner_guid: string
    user_guid: string
    status_guid: string
    order_products: MaterialList[]
    wh_name: string
    partner_name: string
    status_name: string
}

export default OrderData;