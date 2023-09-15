import React, { useEffect, useMemo, useState } from 'react';

// logo
import logo from '@app/assets/images/logo.png';
// custom styles
import styles from './MaterialCard.module.scss';

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



type MaterialCardProps = {
    data: MaterialList
    translate: Function
}

const getCount = (materials: MaterialList[], data: MaterialList) => {
    return materials.find(material =>
        isSelectedMaterial(material, data)
    )?.amount || '';
}

const MaterialCard = (props: MaterialCardProps) => {

    const {
        translate,
        data
    } = props;
    const dispatch = useAppDispatch();
    const materials = useAppSelector(state => state.materialReducer.materials);
    const amount = useMemo(() => {
        return materials.find(material =>
            isSelectedMaterial(material, data)
        )?.amount
    }, [materials]);
    const [count, setCount] = useState<number | string>(getCount(materials, data));

    useEffect(() => {
        const materialCopy = { ...data };
        materialCopy.amount = count !== '' ? count as number : 0;
        dispatch(MaterialActions.setMaterialAmount(materialCopy))
    }, [count]);

    useEffect(() => {
        setCount(amount || 0)
    }, [amount]);

    return (
        <div className={styles.cardWrapper}>
            <div className={styles.cardImageWrapper}>
                <img className={styles.cardImage} src={data?.image ? `http://localhost:8081/src/assets/img/${data.image}.webp` : logo} />
            </div>
            <SizedBox height={10} />
            <div className={styles.mtrlName}>
                {data.mtrl_name}
            </div>
            <SizedBox height={10} />
            <div className={styles.flex}>
                <div className={styles.attributeName}>
                    {data.attribute_name}
                </div>
                <div className={styles.priceValue}>
                    {data.unit_det_name} = {Number(data.price_value).toFixed(2)}
                </div>
            </div>
            <SizedBox height={10} />
            <div className={styles.calculationAreaFlex}>
                <div className={styles.calculationArea}>
                    <Button
                        circle
                        center
                        isIconContent
                        type='text'
                        onClick={() => {
                            if (materials.length > 0)
                                materials.forEach(material => {
                                    if (isSelectedMaterial(material, data)) {
                                        if (material.amount === 1) {
                                            dispatch(MaterialActions.removeMaterial(material))
                                        }
                                        else if (material.amount > 1)
                                            dispatch(MaterialActions.decreaseMaterialAmount(material))
                                    }
                                })
                        }}
                    >
                        <div className={styles.icon}>
                            <i className='bx bx-minus' ></i>
                        </div>
                    </Button>
                    <Input
                        type='number'
                        fontSize='big'
                        fontWeight='bold'
                        className={styles.countInputStyle}
                        value={count}
                        onChange={(e) => {
                            const value = isEmpty(e.currentTarget.value) ? '' : parseFloat(e.currentTarget.value);
                            if (value <= 9999999) {
                                setCount(value)
                            }
                        }}
                    />
                    <Button
                        circle
                        center
                        isIconContent
                        type='text'
                        onClick={() => {
                            if (materials.length > 0)
                                materials.forEach(material => {
                                    if (isSelectedMaterial(material, data)) {
                                        if (material.amount < 9999999) {
                                            dispatch(MaterialActions.increaseMaterialAmount(material))
                                        }
                                    } else {
                                        dispatch(MaterialActions.addMaterial(data))
                                    }
                                })
                            else {
                                dispatch(MaterialActions.addMaterial(data))
                            }
                        }}
                    >
                        <div className={styles.icon}>
                            <i className='bx bx-plus' ></i>
                        </div>
                    </Button>
                </div>
                <span>=</span>
                {(isEmpty(amount) ? 0 : amount! * (isEmpty(data.price_value) ? 0 : parseFloat(data.price_value))).toFixed(2)}
            </div>
        </div >
    )
}

export default MaterialCard;