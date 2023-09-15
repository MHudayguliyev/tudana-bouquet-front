import axios from "axios"
import moment from "moment"
import { get } from "./api_helper"

export default function authToken() {
    const data = localStorage.getItem("authUser") as string
    const obj = JSON.parse(data)
    if (obj && obj.access_token) {
        return obj.access_token
    } else {
        return {}
    }
}

export async function refreshAccessToken() {
    const data = localStorage.getItem("authUser") as string
    let obj;
    try {
        obj = JSON.parse(data ? data : '');
    } catch (err) {
        obj = { refresh_token: '' };
    }
    try {
        const res: any = await get('/auth/load-user', {
            headers: { Authorization: `Bearer ${obj.refresh_token}` }
        })
        console.log(res)
        localStorage.setItem('authUser', JSON.stringify({ ...obj, access_token: res.access_token }));
        localStorage.setItem('accessTokenCreatedTime', moment(new Date()).format("YYYY-MM-DD HH:mm:ss"))
        return false;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            console.log(err.response)
            localStorage.removeItem('authUser')
            localStorage.removeItem('accessTokenCreatedTime')
        }
        console.log(err)
        return true
    }
}