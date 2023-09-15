import React, { useEffect, useMemo, useState } from 'react';

// logo
import logo from '@app/assets/images/logo.png';
// custom styles
import styles from './TableRowMaterials.module.scss';

// own component library
import { Button, Input, SizedBox } from '@app/compLibrary';

// types
import { MaterialList } from '@app/api/Types/queryReturnTypes';
// helpers
import { isEmpty, isSelectedMaterial } from '@utils/helpers';
// typed redux hooks
import { useAppDispatch, useAppSelector } from '@app/hooks/redux_hooks';
// material action creators
import MaterialActions from '@app/redux/actions/MaterialAction';
import { current } from '@reduxjs/toolkit';


type TableRowMaterialsProps = {
    data: MaterialList
    index: number
    translate: Function,
    realIndex: number
}


const getCount = (bufferMaterials: MaterialList[], data: MaterialList) => {
    return bufferMaterials?.find(material =>
        isSelectedMaterial(material, data)
    )?.amount || 0;
}

const TableRowMaterials = (props: TableRowMaterialsProps) => {

    const {
        translate,
        data,
        index,
        realIndex
    } = props;



    const dispatch = useAppDispatch();
    const bufferMaterials = useAppSelector(state => state.materialReducer.bufferMaterials)
    const amount = useMemo(() => {
        return bufferMaterials?.find(material =>
            isSelectedMaterial(material, data)
        )?.amount
    }, [bufferMaterials]);
    const [count, setCount] = useState<number | string>(getCount(bufferMaterials, data));

    useEffect(() => {
        const materialCopy = { ...data };
        materialCopy.amount = count !== '' ? count as number : 0;
        dispatch(MaterialActions.setBufferMaterialAmount(materialCopy))
    }, [count]);

    useEffect(() => {
        setCount(amount || 0)
    }, [amount]);


    return (
        <tr className={styles.customTableRow} >
            <td>{index}</td>
            <td>{data.attribute_name}</td>
            <td>{data.stock_amount}</td>
            <td style={{ textTransform: 'none' }}>{data.unit_det_name}</td>
            <td>{Number(data.price_value).toFixed(2)}</td>
            <td>
                <div className={styles.calculationArea}>
                    <Button
                        circle
                        center
                        isIconContent
                        type='text'
                        onClick={() => {
                            if (bufferMaterials.length > 0)
                                bufferMaterials.forEach(material => {
                                    if (isSelectedMaterial(material, data)) {
                                        if (material.amount === 1) {
                                            dispatch(MaterialActions.removeFromBuffer(material))
                                        }
                                        else if (material.amount > 1)
                                            dispatch(MaterialActions.decreaseBufferMaterial(material))
                                    }
                                })
                        }}
                    >
                    <div className={styles.icon}>
                        <i className='bx bx-minus' ></i>
                    </div>
                    </Button>
                    <Input
                        tabIndex={2}
                        type='number'
                        fontSize='big'
                        fontWeight='bold'
                        placeholder='0'
                        maxLength={5}
                        className={styles.countInputStyle}
                        value={count.toString()}
                        onChange={(e) => {
                            // let value: number = parseInt(e.currentTarget.value)
                            // if (value <= 999999) {
                            //     setCount(value)
                            // }
                            const value = parseFloat(e.currentTarget.value);
                            const {maxLength}: any = e.target
                            const init: any = value.toString()  /// note: we stringify value to slice it then
                            const message: string = init.slice(0, maxLength);        
                            const res = parseFloat(message)
                            if(res < 99999){
                                setCount(res)
                            }
                            if(isNaN(res)){
                                setCount(1)
                            }
                        }}
                    />
                    <Button
                        circle
                        center
                        isIconContent
                        type='text'
                        onClick={() => {
                            if (bufferMaterials.length > 0)
                            bufferMaterials.forEach(material => {
                                    if (isSelectedMaterial(material, data)) {
                                        if (material.amount < 9999999) {
                                            dispatch(MaterialActions.increaseBufferMaterial(material))
                                        }
                                    } else {
                                        dispatch(MaterialActions.addToBuffer(data))
                                    }
                                })
                            else {
                                dispatch(MaterialActions.addToBuffer(data))
                            }
                          
                        }}
                    >
                        <div className={styles.icon}>
                            <i className='bx bx-plus' ></i>
                        </div>
                    </Button>
                </div>
            </td>
            <td>{(isEmpty(amount) ? 0 : amount! * (isEmpty(data.price_value) ? 0 : parseFloat(data.price_value))).toFixed(2)}</td>
        </tr>
    )
}

export default TableRowMaterials