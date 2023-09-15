import React from 'react';
// common types
import CommonModalI from "../commonTypes";

import commonStyles from '../CommonStyles.module.scss';
import styles from './OrderDetails.module.scss'
import { Modal, Table } from "@app/compLibrary";
import { useQuery } from 'react-query';
import { getMaterialsOfOrder } from '@app/api/Queries/Getters';
import { Preloader } from '@app/compLibrary';


interface OrderDetailsProps extends CommonModalI {
   tranlate: Function
   orderGuid: string
   orderCode: string
}

const OrderDetails = (props: OrderDetailsProps) => {
   const {
      show,
      setShow,
      orderGuid,
      orderCode,
      tranlate
   } = props;
   
   const {
      isLoading,
      isError,
      data
   } = useQuery(['materialsOfOrder', orderGuid], () => getMaterialsOfOrder(orderGuid), {enabled: !!orderGuid});

   return (
      <Modal isOpen={show} close={() => setShow(false)}
         header={
            <h3 className={commonStyles.modalTitle}>
               {orderCode}
            </h3>
         }
      >
         <div className={styles.modalOrderDetailBody}>
            {
               isLoading ?
                  <Preloader />
                  :
                  <Table
                     bodyData={data ? data : []}
                     headData={
                        [
                           tranlate('tb'),
                           tranlate('materialName'), tranlate('character'),
                           tranlate('totalAmount'), tranlate('price'),
                           tranlate('total'), tranlate('discount'),
                           tranlate('nettotal'), tranlate('note')
                        ]
                     }
                     renderHead={(data, index) => {
                        return (
                           <th key={index}>{data}</th>
                        )
                     }}
                     renderBody={(data, index) => {
                        return (
                           <tr key={index} className={styles.tableRow}>
                              <td>{index}</td>
                              <td>{data.mtrl_name}</td>
                              <td>{data.attribute_name ? data.attribute_name : '-'}</td>
                              <td>{data.ord_line_amount}</td>
                              <td>{data.ord_line_price_value}</td>
                              <td>{data.ord_line_total}</td>
                              <td>{data.ord_line_discount_percent}</td>
                              <td>{data.ord_line_nettotal}</td>
                              <td>{data.ord_line_desc}</td>
                           </tr>
                        )
                     }}
                  />
            }
         </div>
      </Modal>
   )
}

export default OrderDetails;