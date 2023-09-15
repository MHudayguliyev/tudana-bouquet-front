type ClientsForClientsPage = {
    partner_guid: string
    partner_name: string
    partner_full_name: string
    partner_code: string
    partner_address: string
    partner_telephone: string
    partner_balance: number
    addition_addresses?: string
    addition_telephones?: string
    crt_upd_date?: Date | string | any
}

export default ClientsForClientsPage;
