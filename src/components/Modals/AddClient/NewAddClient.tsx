import React, {  useState, useEffect, useRef } from 'react';

// own component library
import { Button, Col, Input, Modal, Paper, Preloader, Row, SizedBox } from '@app/compLibrary';
import { useMatch } from '@tanstack/react-location';
// custom styles
import styles from './NewAddClient.module.scss';
// for form validation
import { useFormik } from 'formik';
import * as Yup from 'yup';
// types
import CommonModalI from '../commonTypes';
import { useTranslation } from 'react-i18next';
// queries
import { getClientCode } from '@app/api/Queries/Getters';
import { post } from '@app/api/service/api_helper';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAppDispatch} from '@app/hooks/redux_hooks';
import ClientsAction from "@app/redux/actions/ClientsAction";



type FormikValues = {
    partner_name: string
    partner_full_name: string
    partner_telephone: string
    partner_address: string
    addition_addresses: string
    addition_telephones: string
    partner_code?: string
    partner_guid?: string,
}




interface AddClientProps extends CommonModalI {
    translate: Function
    editData?: any,
    setEditMode?: Function | any,
    editMode?: boolean,
    onAdd: (object: any) => void,
    onUpdate?: any
    onSuccess?: any
}

interface PhoneTypes {
    partner_telephone: string,
    addition_telephones: string
}

const AddClient = (props: AddClientProps) => {
    const {
        show,
        setShow,
        translate,
        editData,
        setEditMode,
        editMode = false,
        onAdd,
        onUpdate,
        onSuccess
    } = props;



    // loading state for client code
    const [loadingOrderCode, setLoadingOrderCode] = useState(false);
    const [clientCode, setClientCode] = useState<any>('')
    const [isSubmitted, setSubmitted] = useState<boolean>(false)

    const [phoneErr, setPhoneErr] = useState<PhoneTypes>({
        partner_telephone: '',
        addition_telephones: ''
    })

    const codeRef = useRef()
    codeRef.current = clientCode

    

    const dispatch = useAppDispatch();
    const match = useMatch()
    const {t} = useTranslation()

    const setShowModal: Function = () => {
        dispatch(ClientsAction.setModal(false))
    }

    useEffect(() => {
        if(isSubmitted)
            getGenerateOrderCode()

    }, [isSubmitted])

    

    const formik = useFormik<FormikValues>({
        initialValues: {
            partner_code: editMode ? editData.partner_code : '',
            partner_guid: editMode ? editData.partner_guid : '',
            partner_name: editMode ? editData.partner_name : '',
            partner_full_name: editMode ? editData.partner_full_name : '',
            partner_telephone: editMode ? editData.partner_telephone: '',
            partner_address: editMode ? editData.partner_address : '',
            addition_addresses: editMode && editData.addition_addresses !== null  ? editData.addition_addresses : '',
            addition_telephones: editMode && editData.addition_telephones !== null ? editData.addition_telephones : '',
        },
        validationSchema: Yup.object({
            partner_name: Yup.string().min(3, translate('nameMin')).required(translate('requiredField')),
            partner_full_name: Yup.string().min(3, translate('nameMin')).required(translate('requiredField')),
            partner_telephone: Yup.string().matches(/^[0-9]+$/, translate("onlyDigit")).min(8, translate('exactDigit')).max(8, translate('exactDigit')).required(translate('requiredField')),
            partner_address: Yup.string().min(3, translate('addrMin')).required(translate('requiredField')),
            addition_addresses: Yup.string().min(3, translate('addrMin')).nullable(),
            addition_telephones: Yup.string().matches(/^[0-9]+$/, translate("onlyDigit")).min(8, translate('exactDigit')).max(8, translate('exactDigit')).nullable(),
            partner_balance: Yup.number(),
        }),
        onSubmit: async (values: any, { resetForm }) => {
            try {
                if(!editMode){
                    setSubmitted(true)
                    setTimeout(async () => {                   
                        const to = 
                        {
                            partner_name: values.partner_name,
                            partner_full_name: values.partner_full_name,
                            partner_telephone: values.partner_telephone,
                            partner_address: values.partner_address, 
                            addition_addresses: values.addition_addresses,
                            addition_telephones: values.addition_telephones,
                            partner_code: codeRef.current
                        }
                        const res: any = await post('/create-order/new-client', to)

                        if (res.status === 201 && match.id === 'contacts') {
                            const obj = res.response[0] ? res.response[0] : {}
                            onAdd(obj)
                            toast.success(translate('successfull'))
                            setClientCode('')
                            setShowModal();
                            setSubmitted(false)
                            resetForm()
                        }
                        if(res.status === 201 && match.id === 'orders/make-order/') {
                            await onSuccess()
                            toast.success(translate('successfull'))
                            setClientCode('')
                            setShow(false);
                            setSubmitted(false)
                            resetForm()
                        }
                    }, 2000)



                }  else {

                    const res:any = await post('/clients/edit-client', values)
                    if(res.msg === 'Partner Successfully edited!'){
                        const obj = res.response[0] ? res.response[0] : {}
                        onUpdate(obj)
                        toast.success(translate('successfull'))
                        setShowModal();
                        setEditMode(false)
                        resetForm()
                    }




                }
            } catch (err) { 
                if (axios.isAxiosError(err)){
                    console.log(err)
                    if(err.response){
                        if(err.response.data){
                            toast.error(`${err?.response?.data}`)
                        }else {
                            toast.error(`${err?.response}`)
                        }
                    }else {
                        toast.error(`${err}`)
                    }
                }
                    
            }
        }
    });

    // getting client code
    const getGenerateOrderCode = async () => {
        setLoadingOrderCode(true)
        try {
            const res = await getClientCode()
            setClientCode(res)
        } catch (err) {
            console.error(err)
        }
        setLoadingOrderCode(false)
    }
    return (
        <Modal
            className={styles.clientModal}
            isOpen={show}
            close={() => { 
                match.pathname == '/contacts' ? setShowModal() : setShow(false)
                editMode && setEditMode(false)
             }}
            header={
                <div className={styles.headerTxt}>
                    <h4 className={styles.txt}>
                        {translate('addClient')}
                    </h4>
                </div>
            }
        >
            <form onSubmit={formik.handleSubmit}>
                <div className={styles.modalClientBody} id='modalClientBody'>
                    <div className={styles.addClientModal}>
                        <div className={styles.formInputs}>
                            <div>
                                    <span className={styles.inputTitle}>
                                        {translate('shortName')}
                                    </span>
                                    <SizedBox height={10} />
                                    <Paper fullWidth rounded removeShadow>
                                        <div className={styles.inputInner}>
                                            <Input
                                                fontWeight='bold'
                                                fontSize='big'
                                                type='text'
                                                name="partner_name"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.partner_name}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                    </Paper>
                                    <SizedBox height={5} />
                                {formik.errors.partner_name && formik.touched.partner_name ? 
                                <div className={styles.emptySection}>
                                   <span className={styles.errorTxt}>{formik.errors.partner_name}</span>
                                </div>
                                    : <div className={styles.emptySection} />
                                }
                                <SizedBox height={10} />
                            </div>
                            <div>
                                    <span className={styles.inputTitle}>
                                        {translate('fullName')}
                                    </span>
                                    <SizedBox height={10} />
                                    <Paper fullWidth rounded removeShadow>
                                        <div className={styles.inputInner}>
                                            <Input
                                                fontWeight='bold'
                                                fontSize='big'
                                                type='text'
                                                name="partner_full_name"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.partner_full_name}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                    </Paper>
                                {/* </div> */}
                                <SizedBox height={5} />
                                {formik.errors.partner_full_name && formik.touched.partner_full_name ? 
                                <div className={styles.emptySection}>
                                    <span className={styles.errorTxt}>{formik.errors.partner_full_name}</span>
                                </div>
                                : <div className={styles.emptySection}/>
                                }
                                <SizedBox height={10} />
                            </div>
                        </div>
                        
                    <div className={styles.formInputs}>
                        <div>
                            {/* <div className={styles.formikInput}> */}
                                <span className={styles.inputTitle}>
                                    {translate('address')}
                                </span>
                                <SizedBox height={10} />
                                <Paper fullWidth rounded removeShadow>
                                    <div className={styles.inputInner}>
                                        <Input
                                            fontWeight='bold'
                                            fontSize='big'
                                            type='text'
                                            name="partner_address"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.partner_address}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </Paper>
                            {/* </div> */}
                            <SizedBox height={5} />
                            {formik.errors.partner_address && formik.touched.partner_address ? 
                            <div className={styles.emptySection}>
                                <span className={styles.errorTxt}>{formik.errors.partner_address}</span>
                            </div>
                            : <div className={styles.emptySection} />
                            }
                            <SizedBox height={10} />
                        </div>
                        <div>
                                <span className={styles.inputTitle}>
                                    {translate('additionAddress')}
                                </span>
                                <SizedBox height={10} />
                                <Paper fullWidth rounded removeShadow>
                                    <div className={styles.inputInner}>
                                        <Input
                                            fontWeight='bold'
                                            fontSize='big'
                                            type='text'
                                            name="addition_addresses"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.addition_addresses}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </Paper>
                                <SizedBox height={5} />
                                {formik.errors.addition_addresses && formik.touched.addition_addresses ? 
                                 <div className={styles.emptySection}>
                                    <span className={styles.errorTxt}>{formik.errors.addition_addresses}</span>
                                 </div>
                                : <div className={styles.emptySection} />
                                }
                            <SizedBox height={10} />
                        </div>
                    </div>

                    <div className={styles.formInputs}>
                        <div>
                                <span className={styles.inputTitle}>
                                    {translate('phoneNumber')}
                                </span>
                                <SizedBox height={10} />
                                <Paper fullWidth rounded removeShadow>
                                    <div className={styles.inputInner}>
                                        <div className={styles.phoneNm}>
                                            +993
                                        </div>
                                        <Input
                                            fontWeight='bold'
                                            fontSize='big'
                                            type='text'
                                            maxLength={8}
                                            onInput={(e) => {
                                                if(phoneErr.partner_telephone.length > 0){
                                                    setPhoneErr({partner_telephone: '', addition_telephones: ''})
                                                }
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/gi, "")
                                            }}
                                            name="partner_telephone"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.partner_telephone}
                                            style={{ width: '100%',paddingLeft: '45px' }}
                                        />
                                    </div>
                                </Paper>
                            <SizedBox height={5} />
                            {formik.errors.partner_telephone && formik.touched.partner_telephone ? 
                                <div className={styles.emptySection}>
                                    <span className={styles.errorTxt}>{formik.errors.partner_telephone}</span>
                                </div>
                            :  <div className={styles.emptySection} />
                            }
                            <SizedBox height={10} />
                        </div>
                        <div>
                                <span className={styles.inputTitle}>
                                    {translate('additionPhoneNumber')}
                                </span>
                                <SizedBox height={10} />
                                <Paper fullWidth rounded removeShadow>
                                    <div className={styles.inputInner}>
                                        <div className={styles.phoneNm}>
                                            +993 
                                        </div>
                                        <Input
                                            fontWeight='bold'
                                            fontSize='big'
                                            maxLength={8}
                                            type='text'
                                            onInput={(e) => {
                                                if(phoneErr.addition_telephones.length > 0){
                                                    setPhoneErr({partner_telephone: '', addition_telephones: ''})
                                                }
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/gi, "")
                                            }}
                                            name="addition_telephones"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.addition_telephones}
                                            style={{ width: '100%', paddingLeft: '45px'}}
                                        />
                                    </div>
                                </Paper>
                                <SizedBox height={5} />
                            {formik.errors.addition_telephones && formik.touched.addition_telephones ? 
                            <div className={styles.emptySection}>
                                <span className={styles.errorTxt}>{formik.errors.addition_telephones}</span>
                            </div>
                            : <div className={styles.emptySection}/>
                            }
                        <SizedBox height={10} />
                        </div>

                    </div>
                    </div>
                    <SizedBox height={10} />
                    <div className={styles.materialsModalFooter}>
                        <div className={styles.buttonWrapperRight}>
                        <div className={styles.generateCode}>
                        {
                        !loadingOrderCode ?
                            clientCode ?
                                <span className={styles.codeSpan} style={{ fontWeight: 'bold', lineHeight: '24px' }}>
                                    {translate('code')}:{" "}
                                    {clientCode}
                                </span>
                                : null
                            :
                            <Preloader />
                    }
                        {
                            editMode ? editData && editData.partner_code : !clientCode ?
                                // <>
                                //     <Button
                                //         rounded
                                //         color="theme"
                                //         onClick={() => getGenerateOrderCode()}
                                //         startIcon={<i className='bx bx-barcode-reader'></i>}
                                //     >
                                //         {translate('generateCode')}
                                //     </Button>
                                // </>
                                null
                                :
                                null
                        }
                        </div>
                            <div className={styles.btns}>
                            <Button rounded color='grey' center onClick={() => {
                                setShowModal()
                                setShow(false);
                                editMode && setEditMode(false)
                            }}>
                                {translate('cancel')}
                            </Button>
                            <Button rounded color='theme' center htmlType='submit'>
                                {translate('confirm')}
                            </Button>

                            </div>
                        
                        </div>  
                    </div>
                </div>
            </form>
        </Modal >
    )
}

export default AddClient;