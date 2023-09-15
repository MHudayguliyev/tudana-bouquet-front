import React, { useEffect, useState, useMemo } from "react";
import { MaterialList } from "@app/api/Types/queryReturnTypes";
import { isEmpty, isSelectedMaterial } from "@utils/helpers";
import { useDispatch } from "react-redux";
import styles from "./TableRow.module.scss";
import { Button, Input } from "@app/compLibrary";
import MaterialActions from "@app/redux/actions/MaterialAction";
import logo from "@app/assets/images/logo.png";
import { useTranslation } from "react-i18next";
import DropDownSelect from "../DropDownSelect/DropDownSelect";

type TableRowProps = {
  data: MaterialList;
  setShowModal: Function;
  setDataForDeletion: Function;
  materials: MaterialList[];
  setIdentityLabel: Function;
  onClick?: Function | any
};

const TableRow = ({
  data,
  setShowModal,
  setDataForDeletion,
  materials,
  setIdentityLabel,
  onClick,
}: TableRowProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();


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


  const getCount = (materials: MaterialList[], data: MaterialList) => {
    return materials?.find(material =>
        isSelectedMaterial(material, data, true)
    )?.amount || 0;
  }


  // states for price type
  const [priceTypeSelect, setPriceTypeSelect] = useState<any>("manual");
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
    setPriceTypeSelect(data.priceType)
  }, [])



  return (
    <>
      <tr style={{ backgroundColor: "transparent" }} className={styles.tableRow} >
        <td rowSpan={2}>
          <img
            className={styles.mtrImage}
            src={logo}
            alt="Tudan logo"
          />
        </td>
        <td className={styles.mtrName}>
            <span>{data.mtrl_full_name}</span>
        </td>
        <td>
          <div className={styles.calculationArea}>
            <Button
              circle
              center
              isIconContent
              type="text"
              onClick={() => {
                // materials.forEach((material) => {
                  // if (isSelectedMaterial(material, data)) {
                    if (data.amount === 1) {
                      setShowModal(true);
                      setIdentityLabel("equalToOne");
                      setDataForDeletion(data);
                    } else if (data.amount > 1)
                      dispatch(MaterialActions.decreaseMaterialAmount(data));
                  // }
                // });
              }}
            >
              <div className={styles.icon}>
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
                  if(parseFloat(e.currentTarget.value) === 0){
                      setShowModal(true)
                      setIdentityLabel("equalToOne");
                      setDataForDeletion(data)
                  }
                  const {maxLength}: any = e.target
                  const init: any = value.toString() 
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
              <div className={styles.icon}>
                <i className="bx bx-plus"></i>
              </div>
            </Button>
          </div>
        </td>
        <td>
          <div className={styles.selecWrapper}>
            {/* <select
              onChange={(e) => {
                setPriceTypeSelect(e.target.value);
                dispatch(MaterialActions.changePriceType(data, e.target.value));
              }}
              defaultValue={data.priceType}
              className={styles.SelectStyle}
            >
              <option value="manual" className={styles.SelectStyle}>
                {t("priceTypeManual")}
              </option>
              <option value="any" className={styles.SelectStyle}>
                {t("priceTypeAny")}
              </option>
            </select> */}

            <DropDownSelect
              dropDownContentStyle={{ right: '-10%' }}
              onChange={e => {
                setPriceTypeSelect(e.value as string);
                dispatch(MaterialActions.changePriceType(data, e.value as string));
              }} 
              fetchStatuses={{ isLoading: false, isError: false }}
              title={t("priceTypeManual")}
              titleSingleLine
              data={selectPriceType}
              locale={lang}
            />
          </div>
        </td>
        <td>
          {priceTypeSelect === 'manual' ? (
            Number(data.price_value)?.toFixed(3)
          ) : (
            <Input
              autoFocus
              type="number"
              placeholder="0"
              maxLength={5}
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
          )}
        </td>
        <td>
          {Number(data.amount) *
            (priceTypeSelect === "manual"
              ? +Number(data.price_value).toFixed(3)
              : +Number(data.changedPrice).toFixed(3))}
        </td>
        <td>
          <Button
            color="red"
            isIconContent
            circle
            onClick={() => {
              setShowModal(true);
              setIdentityLabel("deleteButton");
              setDataForDeletion(data);
            }}
          >
            <i className="bx bx-trash"></i>
          </Button>
        </td>
      </tr>
      <tr className={styles.tableRowDescription}>
        <td className={styles.expandArea} colSpan={4}>
          <textarea
            autoFocus
            rows={1}
            maxLength={450}
            spellCheck={false}
            value={data.ord_line_desc && data.ord_line_desc}
            placeholder={t('commentTextareaMtrlDesc')}
            className={styles.textareStyles}
            onChange={(e) => {
                dispatch(MaterialActions.setMtrlDesc(data, e.currentTarget.value))
            }}
          />
        </td>

        <td></td>
        
        <td className={styles.showDialog}>
            <Button
            rounded
            fullHeight 
                color='theme'
                onClick={() => onClick(data)}
            >
            <i className='bx bx-expand-alt'></i>
            </Button>
        </td>
      </tr>
      
    </>
  );
};

export default TableRow;


