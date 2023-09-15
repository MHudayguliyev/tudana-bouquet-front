import React from 'react';
// custom styles
import styles from './OrderCard.module.scss';
import classNames from 'classnames/bind';
// own component library
import { Accordion, Paper } from '@app/compLibrary';
import { convertToValidDatePostgresqlTimestamp } from '@utils/helpers';

const cx = classNames.bind(styles);

type OrderCardProps = {
   guid: string,
   orderCode: string
   orderDate: string
   delivDate: string
   comment: string
   status: string
   status_code: string
   stock: string
   totalAmount: string
   nettotal: string
   client: string
   user: string
   onClickDetail: (guid: string, orderCode: string) => void
   onClickEdit: (guid: string) => void
   onCheck: () => void
   checked: boolean
   isSelectionMode: boolean
   phone: string
   address: string,
   eda: boolean,
   view: string,
}

const OrderCard = (props: OrderCardProps) => {

   const {
      guid,
      orderCode,
      orderDate,
      delivDate,
      comment,
      status,
      status_code,
      stock,
      totalAmount,
      nettotal,
      client,
      user,
      onClickDetail,
      onClickEdit,
      onCheck,
      isSelectionMode,
      checked,
      phone,
      address,
      eda,
      view
   } = props;

   return (
      <Paper rounded>
         <div  className={
            cx({
               cardWrapper: true,
               [`cardStatus_${status_code}`]: true,
               cardChecked: checked && isSelectionMode,
               isSelectionMode: isSelectionMode,
            })
         }>
            <div onClick={() => isSelectionMode && onCheck()}>
            <div className={styles.cardFlex}>
               <div className={styles.cardItem}>
                  <span className={styles.cardIcon}>
                     <i className='bx bx-file' ></i>
                  </span>
                  <span className={styles.cardTxt}>
                     {orderCode}
                  </span>
               </div>
               <div className={styles.cardItem}>
                  <span className={styles.cardIcon}>
                     <i className='bx bxl-stripe' ></i>
                  </span>
                  <span title={status} className={cx({
                     cardTxt: true,
                     [`ordStatus_${status_code}`]: true
                  })}>
                     {status}   
                  </span>
               </div>
            </div>
            <div className={styles.cardFlex}>
               <div className={styles.cardItem}>
                  <span className={styles.cardIcon}>
                     <i className='bx bx-package'></i>
                  </span>
                  <span className={styles.cardTxt}>
                     {totalAmount}
                  </span>
               </div>
               <div className={styles.cardItem}>
                  <span className={styles.cardIcon}>
                     <i className='bx bx-money' ></i>
                  </span>
                  <span className={`${styles.cardTxt} ${styles.cardNettotal}`}>
                     {nettotal}
                  </span>
               </div>
            </div>
            <div className={styles.cardFlex}>
               <div className={styles.cardItem}>
               <span className={styles.cardIcon}>
                  <i className='bx bx-calendar'></i>
               </span>
               <span className={styles.cardTxt}>
                  {convertToValidDatePostgresqlTimestamp(orderDate)}
               </span>

               </div>
               <div className={`${styles.cardItem} ${styles.cardItemMin}`} title={stock}>
                  <span className={styles.cardIcon}>
                     <i className='bx bx-store'></i>
                  </span>
                  <span className={styles.cardTxt} title={stock}>
                     {stock}
                  </span>
               </div>
            </div>
            <div className={styles.cardInline}>
            <span className={styles.cardIcon}>
                     <i className='bx bx-calendar-check' ></i>
                  </span>
                  <span className={styles.cardTxt}>
                     {convertToValidDatePostgresqlTimestamp(delivDate)}
                  </span>
            </div>
            <div className={styles.cardInline}>
               <span className={styles.cardIcon}>
                  <i className='bx bx-message-dots' ></i>
               </span>
               <span className={styles.cardInlineTxt} title={comment}>
                  {comment}
               </span>
            </div>
            <div className={`${styles.cardFlex} ${styles.borderTop}`}>
               <div className={styles.cardItem}>
                  <span className={styles.cardIcon}>
                     <i className='bx bx-user-circle'></i>
                  </span>
                  <span className={styles.cardTxt} title={client}>
                     {client}
                  </span>
               </div>
               <div className={styles.cardItem}>
                  <span className={styles.cardIcon}>
                     <i className='bx bx-user' ></i>
                  </span>
                  <span className={styles.cardTxt} title={user}>
                     {user}
                  </span>
               </div>
            </div>
            </div>
            <Accordion rightContent={
               <div className={styles.accordionActions}>
                  <span className={styles.accordionActionIcon} onClick={() => onClickEdit(guid)}>
                     <i className='bx bx-edit' ></i>
                  </span>
                  <span className={styles.accordionActionIcon} onClick={() => onClickDetail(guid, orderCode)}>
                     <i className='bx bx-info-circle' ></i>
                  </span>
               </div>
            }>
               <div className={styles.cardInline}>
                  <span className={styles.cardIcon}>
                     <i className='bx bx-phone'></i>
                  </span>
                  <span className={styles.cardInlinePhone}>
                     {phone}
                  </span>
               </div>
               <div className={styles.cardInline}>
                  <span className={styles.cardIcon}>
                     <i className='bx bx-map-pin' ></i>
                  </span>
                  <span className={styles.cardInlineAddr} title={address}>
                     {address}
                  </span>
               </div>
            </Accordion>
         </div>
      </Paper>
   )
}

export default OrderCard;