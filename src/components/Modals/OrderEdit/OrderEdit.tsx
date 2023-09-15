import React from 'react';
// common types
import CommonModalI from "../commonTypes";

import commonStyles from '../CommonModalStyles.module.scss';
import { Modal } from "@app/compLibrary";

interface OrderEditProps extends CommonModalI {
    translate: Function
}

const OrderEdit = (props: OrderEditProps) => {
    const {
        show,
        setShow,
        translate,
    } = props;

    return (
        <Modal isOpen={show} close={() => setShow(false)}
            header={
                <></>
                // <h3 className={commonStyles.modalTitle}>
                //    {translate('addAddress')}
                // </h3>
            }
            footer={
                <></>
                // <div className={commonStyles.footerBtn}>
                //    <Button
                //       color="primary"
                //       fullWidth rounded center
                //       onClick={() => setShow(false)}
                //    >
                //       {translate('save')}
                //    </Button>
                // </div>
            }
        >
            <>
                asdfasdf
            </>
        </Modal>
    )
}

export default OrderEdit;