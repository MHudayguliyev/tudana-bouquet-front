import React, { useCallback, useMemo, useState, useEffect, ChangeEvent } from 'react';

// own component library
import { Col, Input, Modal, Preloader, Row, Table, Button } from '@app/compLibrary';
// custom styles
import styles from './Materials.module.scss';
import commonStyles from '../CommonStyles.module.scss';
// types
import CommonModalI from '../commonTypes';
// queries
import { useQuery } from 'react-query';
import { getMaterialList } from '@app/api/Queries/Getters';
import MaterialCard from '@app/components/MaterialCard/MaterialCard';
import TableRow from '@app/components/TableRow/TableRow';
import TableRowMaterials from '@app/components/TableRowMaterials/TableRowMaterials';
import { useTranslation } from 'react-i18next'
import MaterialList from '@api/Types/queryReturnTypes/MaterialList'
import  MaterialActions  from '@app/redux/actions/MaterialAction';
import { useAppDispatch, useAppSelector } from '@app/hooks/redux_hooks';

import toast from 'react-hot-toast'

interface MaterialsProps extends CommonModalI {
    translate: Function
    materialGuid: string
}

const Materials = (props: MaterialsProps) => {

    const bufferMaterials = useAppSelector(state => state.materialReducer.bufferMaterials)

    const {
        show,
        setShow,
        translate,
        materialGuid
    } = props;
    const { t } = useTranslation()

    const dispatch = useAppDispatch()
    // queries
    const {
        isLoading,
        isError,
        data: materialsData
    } = useQuery(['materials', materialGuid], () => getMaterialList(materialGuid), { enabled: !!materialGuid })

    const [searchData, setSearchData] = useState(materialsData || [])


    useEffect(() => {
        setSearchData(materialsData || [])
    }, [materialsData])

    const handleSearch = <T extends MaterialList[]>(e: ChangeEvent<HTMLInputElement>, data: T) => {
        const value = e.currentTarget.value?.toLowerCase();
        const result = [];
        for (let i = 0; i < data.length; i++) {
            const attr_name = data[i].attribute_name?.toLowerCase()
            const stock_amount = data[i].stock_amount?.toString().toLowerCase()
            const unit_type = data[i].unit_det_name?.toLowerCase()
            const price_value = data[i].price_value?.toString().toLowerCase()
            if (attr_name.includes(value)) {
                result.push({ ...data[i] });
            } else if (stock_amount.includes(value)) {
                result.push({ ...data[i] });
            } else if (price_value.includes(value)) {
                result.push({ ...data[i] });
            } else if (unit_type.includes(value)) {
                result.push({ ...data[i] });
            }
        }
        return result;
    }



    return (
        <Modal
            isOpen={show} 
            close={() => {
                dispatch(MaterialActions.clearBuffer())
                setShow(false)
            }}
            header={
                <div className={styles.modalHeaderWrapper} >
                    <h3 className={commonStyles.modalTitle} title='Material name'>
                        {materialsData && materialsData[0].mtrl_name}
                    </h3>
                    <Input
                        autoFocus
                        tabIndex={1}
                        placeholder='Search'
                        className={styles.searchStyle}
                        type='search'
                        onChange={(e) => setSearchData(handleSearch(e, materialsData ? materialsData : []))}
                    />
                </div>
            }
        >
            <div className={styles.materialModalBody} id={styles.materialModalBody}>
                <Row rowGutter={5} colGutter={5}>
                    {
                        isLoading ?
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <Preloader />
                            </div>
                            :
                            !isError && materialsData ?
                                <Table
                                    className={styles.customTable}
                                    headData={[
                                        '#',
                                        t("attr_name"),
                                        t("stock_amount"),
                                        t("unit_type"),
                                        t("price"),
                                        t("actions"),
                                        t("total_value")
                                    ]}
                                    bodyData={searchData}
                                    renderHead={(data, index) => {
                                        return <th key={index}>{data}</th>;
                                    }}
                                    renderBody={(data, index) => {
                                        return (
                                            <TableRowMaterials
                                                key={index}
                                                index={index + 1}
                                                data={data}
                                                translate={t}
                                                realIndex={index}
                                            />
                                        )
                                    }}

                                />
                                :
                                translate('noData')
                    }
                </Row>
            </div>
            <div className={styles.materialsModalFooter}>
                <div>

                </div>
                <div className={styles.buttonWrapperRight}>
                    <Button
                        tabIndex={4}
                        rounded
                        color='grey'
                        onClick={() => {
                            dispatch(MaterialActions.clearBuffer())
                            setShow(false)
                        }}
                    >
                        {t('cancel')}
                    </Button>
                    <Button

                        tabIndex={3}
                        rounded
                        color="theme"
                        onClick={() => {
                            if(bufferMaterials.length > 0){
                                dispatch(MaterialActions.moveToMaterials())
                                toast.success(t('addToBasketMsg'), {
                                    duration: 1600
                                })
                                setShow(false)
                            }
                        }}
                    >
                        {t('confirm')}
                    </Button>
                </div>
            </div>

        </Modal >
    )
}

export default Materials;