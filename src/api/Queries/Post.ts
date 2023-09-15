import {
  ConfirmEditedOrder,
  ConfirmOrder,
  EditClient,
} from "../Types/types";
import { post } from "../service/api_helper";

export const confirmOrder = ({
  partner_guid,
  order_code,
  order_valid_dt,
  order_delivery_dt,
  order_desc,
  status_guid,
  order_total,
  mat_unit_amount,
  warehouse_guid,
  orders_line,
}: ConfirmOrder) => {
  console.log(orders_line);
  return post(`/create-order/confirm-order`, {
    partner_guid,
    order_code,
    order_valid_dt,
    order_delivery_dt,
    order_desc,
    status_guid,
    order_total,
    mat_unit_amount,
    warehouse_guid,
    orders_line,
  });
};

export const confirmEditedOrder = ({
  order_guid,
  partner_guid,
  order_code,
  order_valid_dt,
  order_delivery_dt,
  order_desc,
  status_guid,
  order_total,
  mat_unit_amount,
  warehouse_guid,
  orders_line,
}: ConfirmEditedOrder) => {
  console.log(orders_line);
  return post(`/general/edit-order`, {
    order_guid,
    partner_guid,
    order_code,
    order_valid_dt,
    order_delivery_dt,
    order_desc,
    status_guid,
    order_total,
    mat_unit_amount,
    warehouse_guid,
    orders_line,
  });
};

export const editClient = ({
  cl_code,
  cl_guid,
  cl_name,
  cl_full_name,
  cl_address,
  cl_telephone,
  cl_add_address,
  cl_add_telephone,
}: EditClient) => {
  return post(`/clients/edit-client`, {
    cl_code,
    cl_guid,
    cl_name,
    cl_full_name,
    cl_address,
    cl_telephone,
    cl_add_address,
    cl_add_telephone,
  });
};

