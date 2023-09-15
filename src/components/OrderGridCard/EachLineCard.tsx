import React, {useState, useEffect, useMemo} from 'react'
import { useDispatch } from 'react-redux'
import {useTranslation} from 'react-i18next'
///redux 
import MaterialActions from '@app/redux/actions/MaterialAction'
import styles from './EachLineCard.module.scss'
import logo from '@app/assets/images/logo.png'
import { HiPencilAlt } from 'react-icons/hi'
import { BiMoney } from 'react-icons/bi'
import { TbSum } from 'react-icons/tb'

import {
    Button,
    Input,
    Paper,
    TextArea,
  } from "@app/compLibrary";
import {  isSelectedMaterial } from '@utils/helpers'
import { MaterialList } from '@app/api/Types/queryReturnTypes'
import DropDownSelect from '../DropDownSelect/DropDownSelect'

const selectPriceType = [
    {   
        value: 'manual',
        label: {en:'Manual', tm: 'Öz bahasy', ru: 'Ручная'}
    },
    {   
        value: 'any',
        label: {en:'Any', tm: 'Islendik baha', ru: 'Произвольная'}
    }
    ]

const lang:string | any = localStorage.getItem('language');

type EachLineCardProps = {
    data: any,
    materials: MaterialList[],
    setDataForDeletion: Function,
    setShowModal: Function,
    setIdentityLabel: Function,
    onClick?: Function | any
}

const EachLineCard = ({data, materials, setDataForDeletion, setShowModal, setIdentityLabel, onClick}: EachLineCardProps) => {
    const {t} = useTranslation()
    const dispatch = useDispatch()
    
  const getCount = (materials: MaterialList[], data: MaterialList) => {
    return materials?.find(material =>
        isSelectedMaterial(material, data, true)
    )?.amount || '';
  }




    const [priceType, setPriceType] = useState<any>('')
    const [count, setCount] = useState<number | string>(getCount(materials, data))
    const amount = useMemo(() => {
      return materials?.find(material =>
          isSelectedMaterial(material, data, true)
      )?.amount
    }, [materials]);
    

    useEffect(() => {
      const materialCopy = {...data}
      materialCopy.amount = count !== '' ? count as number : 0;
      dispatch(MaterialActions.setMaterialAmount(materialCopy))
    }, [count]);
  
      useEffect(() => {
        setCount(amount || 0)
    }, [amount]);

    useEffect(() => {
        setPriceType(data.priceType)
    }, [])


  return (
    <Paper rounded style={{padding: '15px'}}>
        <div className={styles.lineName}>{data.mtrl_full_name}</div>
        <div className={styles.lineHeader}>
            <img src={logo} className={styles.lineLogo}/>
            <div className={styles.lineSubHeader}>
                <div className={styles.wordWrap}>{data.attribute_name}</div>
            </div>
        </div>

        <div className={styles.lineBody}>
            <div className={styles.calculationArea}>
                <div className={styles.firstLine}>
                    <div className={styles.buttonGroup}>
                        <Button
                            circle
                            center
                            isIconContent
                            type="text"
                            onClick={() => {
                                if (data.amount === 1) {
                                setShowModal(true);
                                setIdentityLabel("equalToOne");
                                setDataForDeletion(data);
                                } else if (data.amount > 1)
                                dispatch(MaterialActions.decreaseMaterialAmount(data));
                            }}
                            >
                            <div className={styles.lineIcon}>
                                <i className="bx bx-minus"></i>
                            </div>
                        </Button>
                        <Input
                            type='number'
                            fontSize='big'
                            fontWeight='bold'
                            maxLength={5}
                            className={styles.countInputStyle}
                            value={count.toString()}
                            onChange={(e) => {
                                const value = parseFloat(e.currentTarget.value);
                                const {maxLength}: any = e.target
                                const stringified: any = value.toString()  /// note: we stringify value to slice it then
                                const message: string = stringified.slice(0, maxLength);        
                                const res = parseFloat(message)
                                if(parseFloat(e.currentTarget.value) === 0){
                                    setShowModal(true)
                                    setIdentityLabel("equalToOne");
                                    setDataForDeletion(data)
                                }
                                if(isNaN(res)){
                                    setCount(1)
                                }
                                if(res < 99999){
                                    setCount(res)
                                }
                            }}
                        />
                        <Button
                        circle
                        center
                        isIconContent
                        type="text"
                        onClick={() => {
                            if (materials.length > 0){
                                dispatch(
                                    MaterialActions.increaseMaterialAmount(data)
                                )
                            }
                            else {
                              dispatch(MaterialActions.addMaterial(data));
                            }
                          }}
                        >
                        <div className={styles.lineIcon}>
                            <i className="bx bx-plus"></i>
                        </div>
                    </Button>
                    </div>
                    {priceType === 'manual' ? 
                    <div className={styles.linePriceValue}>
                        <div className={styles.lineAction}>
                            <BiMoney size={24}/>
                            <span>{Number(data.price_value)?.toFixed(3)}</span>   
                        </div>
                    </div>
                    : 
                    priceType === 'any' ? 
                    <div className={styles.linePriceInput}>
                        <BiMoney size={24}/>
                            <Input
                                type="number"
                                placeholder="0"
                                maxLength={5}
                                autoFocus
                                max={999}
                                value={data.changedPrice}
                                className={styles.inputPriceValue}
                                onChange={(e) => {
                                    let currentValue: number | any = e.currentTarget.value;
                                    if(currentValue.startsWith(0)){
                                        const res = currentValue.replace(0, '')
                                        currentValue = res
                                    }   
                                    if (isNaN(currentValue)) {
                                        currentValue = 0
                                    }
                                    let {maxLength}: any = e.target
                                    let message = currentValue.slice(0, maxLength);
                                    dispatch(MaterialActions.changePrice(data, message));
                                }}
                            />

                    </div>
                : 
                    <div className={styles.linePriceValue}>
                        <div className={styles.lineAction}>
                            <BiMoney size={24}/>
                            <span>{Number(data.price_value)?.toFixed(3)}</span>   
                        </div>
                    </div> 
                }

                </div>

                <div className={styles.firstLine}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <HiPencilAlt size={24}/>
                        {/* <select className={styles.lineSelection} onChange={e => {
                            setPriceType(e.target.value);
                            dispatch(MaterialActions.changePriceType(data, e.target.value));
                        }}>
                            <option value="manual">
                                {t("priceTypeManual")}
                            </option>
                            <option value="any">
                                {t("priceTypeAny")}
                            </option>
                        </select> */}
                        <DropDownSelect
                              dropDownContentStyle={{ right: '-10%' }}
                              onChange={e => {
                                setPriceType(e.value as string);
                                dispatch(MaterialActions.changePriceType(data, e.value as string));
                            }} 
                              fetchStatuses={{ isLoading: false, isError: false }}
                              title={t("priceTypeManual")}
                              titleSingleLine
                              data={selectPriceType}
                              locale={lang}

                           />
                    </div>
                    <div className={styles.lineAction}>
                        <TbSum size={24}/>
                        <span className={styles.sumLength}>
                            {
                                Number(data.amount) * (priceType === 'manual' ? 
                                +Number(Math.round(data.price_value).toFixed(3)) :  +Number(Math.round(data.changedPrice).toFixed(3))) || 0
                            }
                        </span>
                    </div>

                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{display: 'flex'}}>
                    <TextArea
                        annuleRightBorder
                        placeholder={t("note")}
                        rows={1}
                        maxLength={150}
                        value={data.ord_line_desc}
                        onChange={e => dispatch(MaterialActions.setMtrlDesc(data, e.currentTarget.value))}
                    />
                    <div className={styles.showDialog}>
                        <Button
                        fullHeight 
                            color='theme'
                            onClick={() => onClick(data)}
                        >
                            <i className='bx bx-expand-alt'></i>
                        </Button>
                    </div>
                    </div>

                    <div style={{marginLeft: 'auto'}}>
                        <Button
                            circle
                            color="red"
                            isIconContent
                            onClick={() => {
                            materials.length > 0 && setShowModal(true);
                            setIdentityLabel("deleteButton");
                            setDataForDeletion(materials?.find(item => item.line_row_id_front === data.line_row_id_front))
                        }}
                        >
                        <i className="bx bx-trash"></i>
                        </Button>
                    </div>
                </div>           

            </div>
        </div>
        </Paper>
  )
}

export default EachLineCard
