type PrintData = {
    ord_guid: string
    firm_full_name: string
    ord_code: string
    client_full_name: string
    ord_delivery_date: string
    client_code: string
    warehouse_name: string
    contact_telephone: string
    contact_address: string
    ord_desc: string
    products_data: {
        mtr_name: string
        ord_line_amount: number
        ord_line_price_value: number
        ord_line_nettotal: number
    }[]
}

export default PrintData;