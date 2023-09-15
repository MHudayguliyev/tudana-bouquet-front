import React, { useState, useEffect, ChangeEvent } from 'react'
import styles from './ProductEdit.module.scss'
// bu new-feature branch

import { AllMaterialsType, PriceValuesTypes } from '@app/api/Types/queryReturnTypes';
import { useAppSelector } from '@app/hooks/redux_hooks';
import { Button, Input, Modal, Paper, SizedBox, TextArea } from '@app/compLibrary';
import { Tooltip } from '@mui/material'
import toast from 'react-hot-toast'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import authToken from '@api/service/auth_token'
import { BASE_URL } from '@api/axiosInstance'
import { get, patch } from '@app/api/service/api_helper';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import DropDownSelect from '../DropDownSelect/DropDownSelect';
import { getAttributeList, getGroupList, getPriceTypes } from '@app/api/Queries/Getters';
import { useQuery } from 'react-query';
import InputNumber from '../InputNumber/InputNumber';
import { fileToURL, getImageName } from '@utils/helpers';
import {  ExistImageTypes } from '@app/api/Types/types';

interface ProductEditTypes {
    showEditModal: boolean;
    setShowEditModal: Function;
    editData: AllMaterialsType | undefined;
    setEditData: Function;
    existImageFiles: any[];
    setExistImageFiles: Function;
    allServerImages: any[];
    setAllServerImages: Function;
    priceValues: PriceValuesTypes[];
    setPriceValues: Function;
}

type DropdownSelectTypes = {
    label: string
    value: string
}


interface FormikValues extends AllMaterialsType {
    sales_price?: string | number
    purchase_price?: string | number
}

const cx = classNames.bind(styles)

const ProductEdit = (props: ProductEditTypes) => {
    const {
        editData,
        setEditData,

        setShowEditModal,
        showEditModal,

        existImageFiles,
        setExistImageFiles,

        allServerImages,
        setAllServerImages,

        priceValues,
        setPriceValues

    } = props;
    const theme = useAppSelector(state => state.themeReducer)
    const { t } = useTranslation()

    const initialFormValues = {
        mtrl_code: '',
        mtrl_name: '',
        unit_det_code: '',
        group_name: '',
        attribute_name: '',
        price_value: 0,
        row_num: 0,
        mtrl_attr_unit_row_id: 0,
        mtrl_guid: '',
        group_guid: '',
        attr_guid: '',
        price_type_guid: '',
        mtrl_desc: ''
    }
    // states
    const [formValues, setFormValues] = useState<AllMaterialsType>(initialFormValues)
    const [purchasePrice, setPurchasePrice] = useState<string>("")
    const [salesPrice, setSalesPrice] = useState<string>("")
    const [materialDesc, setMaterialDesc] = useState<string>(editData?.mtrl_desc || '')
    const [groupNameValue, setGroupNameValue] = useState<DropdownSelectTypes>({ label: '', value: '' })
    const [attributeNameValue, setAttributeNameValue] = useState<DropdownSelectTypes>({ label: '', value: '' })
    const [purchasePriceTypesValue, setPurchasePriceTypesValue] = useState<DropdownSelectTypes>({ label: '', value: '' })
    const [salesPriceTypesValue, setSalesPriceTypesValue] = useState<DropdownSelectTypes>({ label: '', value: '' })
    const [purchaseErrors, setPurchaseErrors] = useState("")
    const [salesErrors, setSalesErrors] = useState("")
    const [purchaseTypesErrors, setPurchaseTypesErrors] = useState("")
    const [salesTypesErrors, setSalesTypesErrors] = useState("")


    const handleUploadImages = (e: ChangeEvent<HTMLInputElement>) => {

        const selectedImages = Array.from(new Set(e.target.files))
        if (selectedImages.length === 0) {
            return;
        }
        const selectedImageArray = []
        for (const image of selectedImages) {
            //@ts-ignore
            image.is_image_main = false
            //@ts-ignore
            image.is_pc_image = true
            selectedImageArray.push(image)
        }

        const joinedLength = existImageFiles.length + selectedImageArray.length
        if (joinedLength > 5) {
            return toast.error('Only 5 images can be uploaded. \n Please select less than 5 images')
        } else {
            if (existImageFiles.length === 0) {
                //@ts-ignore
                selectedImageArray[0].is_image_main = true
                setExistImageFiles([...existImageFiles, ...selectedImageArray])
            } else {
                for (const selectedImage of selectedImageArray) {
                    for (const existImgFile of existImageFiles) {
                        if (getImageName(existImgFile.name) === getImageName(selectedImage.name)) {
                            return toast.error('Image already exist')
                        }
                    }
                }
                setExistImageFiles([...existImageFiles, ...selectedImageArray])

            }
        }
    }


    const closeModal = () => {
        setShowEditModal(false)
        setFormValues(initialFormValues)
        setPurchasePrice("")
        setSalesPrice("")
        setExistImageFiles([])
        setAllServerImages({})
        setMaterialDesc("")
        setEditData({})
        setGroupNameValue({ label: '', value: '' })
        setAttributeNameValue({ label: '', value: '' })
        setPurchasePriceTypesValue({ label: '', value: '' })
        setSalesPriceTypesValue({ label: '', value: '' })
        setPriceValues([])
    }




    const formik = useFormik<FormikValues>({
        enableReinitialize: true,
        initialValues: formValues,
        validationSchema: Yup.object({
            mtrl_code: Yup.string().required(),
            mtrl_name: Yup.string().required(),
            unit_det_code: Yup.string().required(),
            group_name: Yup.string().nullable(true),
            attribute_name: Yup.string().nullable(true),
            price_value: Yup.number().required(),
            row_num: Yup.number().required(),
            mtrl_attr_unit_row_id: Yup.number().required(),
            mtrl_guid: Yup.string().uuid().required(),
            group_guid: Yup.string().uuid().required(),
            attr_guid: Yup.string().uuid().required(),
            price_type_guid: Yup.string().uuid().required()

        }),
        onSubmit: async (values: any, { resetForm }) => {
            try {
                console.log('attributeNameValue: ', attributeNameValue)

                groupNameValue.value.length === 0 && formik.setFieldError('group_name', `${t('materialEdit.group_name')} must be select`)
                attributeNameValue.value.length === 0 && formik.setFieldError('attribute_name', `${t('materialEdit.attr_name')} must be select`)
                purchasePrice.length === 0 && setPurchaseErrors(`${t('materialEdit.purchase_price')} can't be empty`)
                salesPrice.length === 0 && setSalesErrors(`${t('materialEdit.sale_price')} can't be empty`)
                purchasePriceTypesValue.value.length === 0 && setPurchaseTypesErrors(`${t('materialEdit.purchase_price_types')} must be select`)
                salesPriceTypesValue.value.length === 0 && setSalesTypesErrors(`${t('materialEdit.sale_price_types')} must be select`)

                if (groupNameValue.value.length > 0 && attributeNameValue.value.length > 0 && purchasePrice.length > 0 && salesPrice.length > 0) {
                    values.changed_group_name = groupNameValue
                    values.changed_attr_name = attributeNameValue
                    values.mtrl_desc = materialDesc
                    values.purchase_price = +purchasePrice
                    values.sales_price = +salesPrice
                    values.purchase_price_types = purchasePriceTypesValue
                    values.sales_price_types = salesPriceTypesValue
                    console.log('values: ', values)
                    const editDataRes: any = await patch('/general/edit-material', values)
                    if (editDataRes?.status === 'success') {
                        toast.success('Material successfully updated')
                        closeModal()
                        resetForm()
                    }
                }
            } catch (e) {
                toast.error('Unkown error')
            }
        }
    })

    useEffect(() => {
        setFormValues(Object.assign({}, editData))
        if (editData) {
            setMaterialDesc(editData.mtrl_desc || "")
            setGroupNameValue({ label: editData.group_name || '', value: editData.group_guid || '' })
            setAttributeNameValue({ label: editData.attribute_name || '', value: editData.attr_guid || '' })
        }
    }, [editData])

    useEffect(() => {
        groupNameValue.value.length > 0 && formik.setFieldError('group_name', "")
    }, [groupNameValue])

    useEffect(() => {
        console.log('attributeNameValue: ', attributeNameValue)
        attributeNameValue.value.length > 0 && formik.setFieldError('attribute_name', "")
    }, [attributeNameValue])

    useEffect(() => {
        purchasePrice.length > 0 && setPurchaseErrors("")
    }, [purchasePrice])

    useEffect(() => {
        salesPrice.length > 0 && setSalesErrors("")
    }, [salesPrice])

    useEffect(() => {
        purchasePriceTypesValue.value.length > 0 && setPurchaseTypesErrors("")
    }, [purchasePriceTypesValue])

    useEffect(() => {
        salesPriceTypesValue.value.length > 0 && setSalesTypesErrors("")
    }, [salesPriceTypesValue])

    useEffect(() => {
        const purchasePriceValue = priceValues.find(item => !item.pt_used_in_sale)
        const salesPriceValue = priceValues.find(item => item.pt_used_in_sale)
        setPurchasePrice(String(purchasePriceValue?.price_value))
        setSalesPrice(String(salesPriceValue?.price_value))
    }, [priceValues])

    const {
        data: groupsData,
        isLoading: isGroupsloading,
        isError: isGroupsError
    } = useQuery('get_groups', () => getGroupList())
    const {
        data: attrbutesData,
        isLoading: isAttributesloading,
        isError: isAttributesError
    } = useQuery('get_attributes', () => getAttributeList())
    const {
        data: priceTypesData,
        isLoading: isPriceTypesloading,
        isError: isPriceTypesError
    } = useQuery('get_price_types', () => getPriceTypes())


    const handleSaveImages = async () => {
        try {
            const checkExistImages: ExistImageTypes = await get(`/general/get-images-by-material?mtrl_attr_unit_row_id=${editData?.mtrl_attr_unit_row_id}`)
            if (checkExistImages.status === 'success') {
                if (checkExistImages.data.length === 0) {
                    closeModal()
                }
            }
            const serverImages = [...existImageFiles.filter(file => file.is_server_image)]
            const pcImages = [...existImageFiles.filter(file => file.is_pc_image)]
            const serverImageNames = [...serverImages.map(img => img.name)]
            const assigned_images = [...existImageFiles.filter(item => !item.is_pc_image && !item.is_server_image)]
            const assigned_image_names = [...assigned_images.map(item => item.name)]
            const formData = new FormData()
            for (const img of pcImages) {
                formData.append('productImages', img)
            }
            const main_image_name = existImageFiles.length > 0 ? existImageFiles.find((file: any) => file.is_image_main === true).name : null
            const token = authToken()
            const resImages: any = (await axios({
                method: 'post',
                url: `${BASE_URL}/general/upload-material-images?mtrl_attr_unit_row_id=${editData?.mtrl_attr_unit_row_id}&main_image_name=${main_image_name}&server_image_names=${JSON.stringify(serverImageNames)}&assigned_image_names=${JSON.stringify(assigned_image_names)}`,
                data: formData,
                headers: { 'Content-Type': 'multipart/formData-data', 'Authorization': `Bearer ${token}` }
            })).data
            if (resImages) {
                toast.success('Success')
                closeModal()
            }
        } catch (e) {
            console.log(e)
            toast.error(JSON.stringify(e))
        }
    }




    return (
        <Modal
            isOpen={showEditModal}
            close={closeModal}
            header={
                <div style={{ color: theme.mode == 'theme-mode-dark' ? 'rgb(254,255,244)' : '#202020' }}>
                    {editData?.mtrl_name} - Edit mode
                </div>
            }
            styleOfModalBody={{ color: theme.mode == 'theme-mode-dark' ? 'rgb(254,255,244)' : '#202020' }}
            footer={
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', width: '100%', }}>
                    <Button
                        color='theme'
                        center
                        rounded
                        htmlType='submit'
                        onClick={handleSaveImages}
                        fullWidth
                    >
                        Save images
                    </Button>
                    <div style={{ width: '160%' }}>
                        <Button
                            color='theme'
                            center
                            rounded
                            htmlType='submit'
                            fullWidth
                            form='form1'
                        >
                            Save data
                        </Button>
                    </div>
                </div>
            }
            fullScreen
            style={{
                top: 0,
                left: 0,
                right: 0
            }}

        >
            <main className={styles.mainContainer}>
                <div className={styles.sectionsWrapper}>
                    <section className={styles.imageSection}>

                        <div className={styles.imagePreviewsWrapper}>
                            {
                                existImageFiles.length !== 0 ?
                                    <div className={styles.imageListWrapper}>
                                        {
                                            existImageFiles.map((item: any, index: number) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className={
                                                            cx({
                                                                imgWrapperDivDefault: true,
                                                                imgWrapperDiv: item.is_image_main
                                                            })
                                                        }
                                                    >
                                                        <img
                                                            src={fileToURL(item)}
                                                            alt={"Image"}
                                                            onClick={() => {
                                                                setExistImageFiles([...existImageFiles.map((image: any) => {
                                                                    if (image.name === item.name) {
                                                                        image.is_image_main = true
                                                                    } else {
                                                                        image.is_image_main = false
                                                                    }
                                                                    return image
                                                                })])
                                                            }}
                                                        />
                                                        <Tooltip title='Delete'>
                                                            <button type='button' onClick={() => {
                                                                const filteredImageFiles = existImageFiles.filter((image: any) => image.name !== item.name)
                                                                // console.log(filteredImageFiles)
                                                                // console.log('item: ', item)
                                                                // console.log('existImageFiles: ', existImageFiles)
                                                                // console.log('index: ', index)
                                                                if (item.is_image_main && index !== 0) {
                                                                    filteredImageFiles.map((image: any, i: number) => {
                                                                        existImageFiles[index - 1].is_image_main = true
                                                                        return image
                                                                    })
                                                                } 
                                                                // else {
                                                                //     filteredImageFiles.map((image: any, i: number) => {
                                                                //         existImageFiles[index + 1].is_image_main = true
                                                                //         return image
                                                                //     })
                                                                // }
                                                                setExistImageFiles([...filteredImageFiles])
                                                                if (item?.is_server_image) {
                                                                    setAllServerImages((prev: any) => ([...prev, item]))
                                                                }
                                                            }}>
                                                                <i className="bx bx-x-circle"></i>
                                                            </button>
                                                        </Tooltip>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div> :
                                    <div>
                                        Entak hic hili surat dakylmadyk
                                    </div>
                            }
                        </div>
                        <div>
                            {/* Upload image from computer */}
                            <div className={styles.imageUploaderWrapper}>
                                <label
                                    htmlFor="product_images"
                                    className={styles.imageLabel}
                                >
                                    +  Select images for product
                                    <span>up to max. 5 images</span>
                                </label>
                                <input
                                    type="file"
                                    name="product_images"
                                    id="product_images"
                                    accept='image/png, image/jpeg, image/jpg, image/webp'
                                    multiple
                                    className={styles.imageInput}
                                    onChange={handleUploadImages}
                                    onClick={(e: any) => e.target.value = ''}
                                />

                            </div>
                        </div>
                        <hr />
                        <div>
                            {/* Get images all  section here */}
                            <div className={styles.imagePreviewsWrapper}>
                                <div className={styles.imageListWrapper}>
                                    {
                                        allServerImages.length > 0 ? allServerImages.map((item: any, index: number) => {
                                            return (
                                                <div key={index} className={
                                                    cx({
                                                        imgWrapperDivDefault: true,
                                                    })
                                                }

                                                >
                                                    <img
                                                        src={fileToURL(item)}
                                                        alt={"Image"}
                                                    />
                                                    <span
                                                        className={styles.imageCover}
                                                        onClick={() => {
                                                            if (existImageFiles.length < 5) {
                                                                if (existImageFiles.length > 0) {
                                                                    for (const existImgFile of existImageFiles) {
                                                                        if (getImageName(existImgFile.name) === getImageName(item.name)) {
                                                                            return toast.error('Image already exist')
                                                                        }
                                                                    }
                                                                } else {
                                                                    item.is_image_main = true
                                                                }

                                                                setExistImageFiles((prev: any) => ([...prev, item])) // Yokarky suratlara suraty goshyar
                                                                setAllServerImages([...allServerImages.filter((img: any) => img.name !== item.name)]) // Yokara goshuljak suraty ashakdan ayyryar


                                                            } else {
                                                                toast.error('Images can be max. 5 images')
                                                            }
                                                        }}
                                                    >
                                                        +
                                                    </span>
                                                </div>
                                            )
                                        }) : (
                                            <div className={styles.noImagesAll}>
                                                <span>
                                                    Hic hili surat yok
                                                </span>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>


                        </div>

                    </section>
                    <section className={styles.dataSection}>
                        <form onSubmit={formik.handleSubmit} id='form1' >
                            <div>
                                <label htmlFor='mtrl_name'>{t("materialEdit.mtrl_name")}</label>
                                <SizedBox height={10} />
                                <Paper fullWidth rounded removeShadow  >
                                    <Input
                                        value={formik.values.mtrl_name || ''}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        type='text'
                                        name='mtrl_name'
                                        id='mtrl_name'
                                        autoComplete="off"
                                    />
                                </Paper>
                                {
                                    formik.errors.mtrl_name && formik.touched.mtrl_name ?
                                        <div className={styles.emptySection} >
                                            <span className={styles.errorTxt}>{formik.errors.mtrl_name}</span>
                                        </div>
                                        : <div className={styles.emptySection} />
                                }
                            </div>
                            <div className={styles.halfDiv}>
                                <div>
                                    <label htmlFor="mtrl_code">{t("materialEdit.mtrl_code")}</label>
                                    <SizedBox height={10} />
                                    <Paper fullWidth rounded removeShadow >
                                        <Input
                                            value={formik.values.mtrl_code || ''}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            type='text'
                                            name='mtrl_code'
                                            id='mtrl_code'
                                            autoComplete="off"
                                        />
                                    </Paper>
                                    {
                                        formik.errors.mtrl_code && formik.touched.mtrl_code ?
                                            <div className={styles.emptySection} >
                                                <span className={styles.errorTxt}>{formik.errors.mtrl_code}</span>
                                            </div>
                                            : <div className={styles.emptySection} />
                                    }
                                </div>
                                <div >
                                    <div>
                                        <label htmlFor="unit_det_code">{t("materialEdit.unit_det_code")}</label>
                                        <SizedBox height={10} />
                                        <Paper fullWidth rounded removeShadow >
                                            <Input
                                                value={formik.values.unit_det_code || ''}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                type='text'
                                                name='unit_det_code'
                                                id='unit_det_code'
                                                autoComplete="off"
                                                disabled
                                            />
                                        </Paper>
                                        <div className={styles.emptySection} />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.halfDiv}>
                                <div >
                                    <span>{t("materialEdit.group_name")}</span>
                                    <SizedBox height={10} />
                                    <div className={styles.dropdownWrapperStyle}>
                                        <DropDownSelect
                                            title={t("select")}
                                            data={groupsData || []}
                                            fetchStatuses={{
                                                isLoading: isGroupsloading,
                                                isError: isGroupsError
                                            }}
                                            onChange={(item: any) => {
                                                setGroupNameValue(item)
                                            }}
                                            dropDownContentStyle={{ right: '0', width: '100%' }}
                                            maintitleOutside={groupNameValue}
                                        />
                                    </div>
                                    {
                                        formik.errors.group_name && formik.touched.group_name ?
                                            <div className={styles.emptySection} >
                                                <span className={styles.errorTxt}>{formik.errors.group_name}</span>
                                            </div>
                                            : <div className={styles.emptySection} />
                                    }
                                </div>
                                <div >
                                    <span>{t("materialEdit.attr_name")}</span>
                                    <SizedBox height={10} />
                                    <div className={styles.dropdownWrapperStyle}>
                                        <DropDownSelect
                                            title={t("select")}
                                            data={attrbutesData || []}
                                            fetchStatuses={{
                                                isLoading: isAttributesloading,
                                                isError: isAttributesError
                                            }}
                                            onChange={(item: any) => {
                                                setAttributeNameValue(item)
                                            }}
                                            dropDownContentStyle={{ right: '0', width: '100%' }}
                                            maintitleOutside={attributeNameValue}
                                        />
                                    </div>
                                    {
                                        formik.errors.attribute_name && formik.touched.attribute_name ?
                                            <div className={styles.emptySection} >
                                                <span className={styles.errorTxt}>{formik.errors.attribute_name}</span>
                                            </div>
                                            : <div className={styles.emptySection} />
                                    }
                                </div>
                            </div>
                            <div className={styles.halfDiv}>
                                <div >
                                    <label htmlFor="purchase_price">{t("materialEdit.purchase_price")}</label>
                                    <SizedBox height={10} />
                                    <div>
                                        <InputNumber
                                            setInputNumberValue={setPurchasePrice}
                                            inputNumberValue={purchasePrice}
                                            maxLength={5}
                                            id="purchase_price"
                                        />
                                    </div>
                                    {
                                        purchaseErrors.length > 0 ?
                                            <div className={styles.emptySection} >
                                                <span className={styles.errorTxt}>{purchaseErrors}</span>
                                            </div>
                                            : <div className={styles.emptySection} />
                                    }
                                </div>
                                <div>
                                    <span>{t("materialEdit.purchase_price_types")}</span>
                                    <SizedBox height={10} />
                                    <div className={styles.dropdownWrapperStyle}>
                                        <DropDownSelect
                                            title={t("select")}
                                            data={priceTypesData?.purchase_price_types || []}
                                            fetchStatuses={{
                                                isLoading: isPriceTypesloading,
                                                isError: isPriceTypesError
                                            }}
                                            onChange={(item: any) => {
                                                setPurchasePriceTypesValue(item)
                                            }}
                                            dropDownContentStyle={{ right: '0', width: '100%' }}
                                            maintitleOutside={{
                                                label: priceValues.find(item => !item.pt_used_in_sale)?.price_type_name || '',
                                                value: priceValues.find(item => !item.pt_used_in_sale)?.price_type_guid || ''
                                            }}
                                        />
                                    </div>
                                    {
                                        purchaseTypesErrors.length > 0 ?
                                            <div className={styles.emptySection} >
                                                <span className={styles.errorTxt}>{purchaseTypesErrors}</span>
                                            </div>
                                            : <div className={styles.emptySection} />
                                    }
                                </div>
                            </div>
                            <div className={styles.halfDiv}>
                                <div >
                                    <label htmlFor="sale_price">{t("materialEdit.sale_price")}</label>
                                    <SizedBox height={10} />
                                    <div>
                                        <InputNumber
                                            setInputNumberValue={setSalesPrice}
                                            inputNumberValue={salesPrice}
                                            maxLength={5}
                                            id='sale_price'
                                        />
                                    </div>
                                    {
                                        salesErrors.length > 0 ?
                                            <div className={styles.emptySection} >
                                                <span className={styles.errorTxt}>{salesErrors}</span>
                                            </div>
                                            : <div className={styles.emptySection} />
                                    }
                                </div>
                                <div>
                                    <span>{t("materialEdit.sale_price_types")}</span>
                                    <SizedBox height={10} />
                                    <div className={styles.dropdownWrapperStyle}>
                                        <DropDownSelect
                                            title={t("select")}
                                            data={priceTypesData?.sales_price_types || []}
                                            fetchStatuses={{
                                                isLoading: isPriceTypesloading,
                                                isError: isPriceTypesError
                                            }}
                                            onChange={(item: any) => {
                                                setSalesPriceTypesValue(item)
                                            }}
                                            dropDownContentStyle={{ right: '0', width: '100%' }}
                                            maintitleOutside={{
                                                label: priceValues.find(item => item.pt_used_in_sale)?.price_type_name || '',
                                                value: priceValues.find(item => item.pt_used_in_sale)?.price_type_guid || ''
                                            }}
                                        />
                                    </div>
                                    {
                                        salesTypesErrors.length > 0 ?
                                            <div className={styles.emptySection} >
                                                <span className={styles.errorTxt}>{salesTypesErrors}</span>
                                            </div>
                                            : <div className={styles.emptySection} />
                                    }
                                </div>
                            </div>
                            <div>
                                <label htmlFor='mtrl_desc'>{t("materialEdit.mtrl_desc")}</label>
                                <SizedBox height={10} />
                                <TextArea
                                    maxLength={255}
                                    onChange={(e) => setMaterialDesc(e.target.value)}
                                    rows={5}
                                    id='mtrl_desc'
                                    value={materialDesc}
                                />
                                <div className={styles.textareaLength}>
                                    <i>
                                        {materialDesc.length === 0 ? 0 : materialDesc.length}/255
                                    </i>
                                </div>
                            </div>

                        </form>
                    </section>
                </div>
            </main>

        </Modal>
    )
}

export default ProductEdit