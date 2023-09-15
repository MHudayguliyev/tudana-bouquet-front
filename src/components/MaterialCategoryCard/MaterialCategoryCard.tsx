import React from 'react';
// logo
import logo from '@app/assets/images/logo.png';
// custom styles
import styles from './MaterialCategoryCard.module.scss';
import classNames from 'classnames/bind';
// own component library
import { SizedBox } from '@app/compLibrary';
import { MaterialCategories } from '@app/api/Types/queryReturnTypes';
import { useAppSelector } from '@app/hooks/redux_hooks';

type MaterialCategoryCardProps = {
    data: MaterialCategories
    onClick: (guid: string) => void
    translate: Function
}
const MaterialCategoryCard = (props: MaterialCategoryCardProps) => {

    const {
        data,
        onClick,
        translate
    } = props;

    const materials = useAppSelector(state => state.materialReducer.materials)

    return (
        <div className={styles.cardWrapper} onClick={() => onClick(data.mtrl_guid)}>
            <div className={styles.cardImageWrapper}>
                <img className={styles.cardImage} src={data.image_name ? `http://localhost:5002/src/images/compressed/${data.image_name}` : logo} />
            </div>
            <SizedBox height={5} />
            <div className={styles.title}>
                {data.mtrl_code}
            </div>
            <SizedBox height={5} />
            <div className={styles.title}>
                {data.mtrl_name}
            </div>
            <SizedBox height={10} />
            <div className={styles.flex}>
                <div className={styles.countsWrapper}>
                    <div className={styles.countTxt}>
                        {translate('count')}
                    </div>
                    <SizedBox height={10} />
                    <div className={styles.countTxt}>
                        {data.count}
                    </div>
                </div>
                <div className={styles.countsWrapper}>
                    <div className={styles.countTxt}>
                        {translate('selectedCount')}
                    </div>
                    <SizedBox height={10} />
                    <div className={styles.countTxt}>
                        {materials.filter(material => material.mtrl_guid === data.mtrl_guid && material.amount > 0)?.length}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MaterialCategoryCard;