import React, { ChangeEvent, CSSProperties, useEffect, useMemo, useState } from 'react';

// own component library
import { Checkbox, Dropdown, Input } from '@app/compLibrary';
// custom styles
import styles from './DropDownFilter.module.scss';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import Preloader from '@app/compLibrary/Preloader/Preloader';

const cx = classNames.bind(styles)
// later will change
function handleSearch<T extends SearchValues[]>(event: ChangeEvent<HTMLInputElement>, data: T, arrCheckedValue: T) {
   const value = event.currentTarget.value?.toLowerCase();
   const result = [];
   for (let i = 0; i < data.length; i++) {
      const sentence = data[i].label?.toLowerCase();
      if (sentence.includes(value)) {
         result.push({ ...data[i] });
      }
   }
   // console.log('resu', result)

   const result2 = [];
   for (let x = 0; x < result.length; x++) {
      let flat = true;
      for (let y = 0; y < arrCheckedValue.length; y++) {
         if (result[x].value === arrCheckedValue[y].value && arrCheckedValue[y].isChecked === true) {
            const a = result[x];
            a.isChecked = true;
            result2.push(a);
            flat = false
         }
      }
      if (flat) {
         result2.push(result[x]);
      }
   }

   return result2;
}

const clearFN = <T extends SearchValues[]>(data: T) => {
   const res = [];
   for (let y = 0; y < data.length; y++) {
      const a = data[y];
      a.isChecked = true;
      res.push(a);
   }
   return res
}

type SearchValues = {
   label: string
   value: string | number,
   isChecked: boolean
}

interface DropDownFilterProps<T> {
   title: string | any
   data: T
   onChange: (values: Array<string>) => void
   dropDownContentStyle?: CSSProperties
   fetchStatuses: { isLoading: boolean, isError: boolean }
   clear: boolean
   setClear: Function
   partnerList?: Array<string>
   warehouseList?:Array<string>
   usersList?: Array<string>
   statusList?: Array<string>,
   identityLabel?: string
}

function DropDownFilter<T extends SearchValues[]>(props: DropDownFilterProps<T>) {

   const {
      title,
      data,
      onChange,
      dropDownContentStyle,
      fetchStatuses,
      clear,
      setClear,
      partnerList,
      warehouseList, 
      statusList,
      usersList,
      identityLabel,
   } = props;


   // for translation
   const { t } = useTranslation();
   // array of selected elements
   const [arrCheckedValue, setArrCheckedValue] = useState<SearchValues[]>(data);
   const [arrCheckedValue2, setArrCheckedValue2] = useState<SearchValues[]>(data);
   // check states 
   const [isCheckedAll, setCheckAll] = useState<boolean>(true)
 

   useEffect(() => {
      setArrCheckedValue(data)
      setArrCheckedValue2(data)
   }, [fetchStatuses.isLoading, fetchStatuses.isError])


   useEffect(() => {
      if (!fetchStatuses.isLoading && !fetchStatuses.isError)
         if (arrCheckedValue2){
            const dependencyFilter = arrCheckedValue2?.filter(item => !item.isChecked)
            if(isCheckedAll && dependencyFilter.length){
               setCheckAll(false)  /// note: set checkall false to remove it when one item is unchecked 
            }else if(!isCheckedAll && !dependencyFilter.length){
               setCheckAll(true)
            }
            onChange(arrCheckedValue2.filter(item => item.isChecked).map(item => item.value as string))
            
         }
   }, [arrCheckedValue2]);
   

   useEffect(() => {
      if (clear) {
         const cleared = clearFN(arrCheckedValue2)
         setCheckAll(true)
         setArrCheckedValue(cleared)
         setArrCheckedValue2(cleared)
         setClear(false)
      }
   }, [clear])

   // useEffect(() => {
   //    console.log('partnerList', partnerList)
   // }, [partnerList])


   const checkedCount = useMemo(() => {
      // console.log("arr value2", arrCheckedValue2)
      return arrCheckedValue2&&  arrCheckedValue2.filter(checked => checked.isChecked).length || 0
   }, [arrCheckedValue2])

   return (
      <Dropdown onChange={(options: any) => {
         if(options){
            setCheckAll(true)
            setArrCheckedValue2(options)
            setArrCheckedValue(options)
         }
      }} 
      partnerList={partnerList} 
      warehouseList={warehouseList} 
      statusList={statusList} 
      usersList={usersList}  
      arr2={arrCheckedValue2} dropDownContentStyle={dropDownContentStyle} customToggle={() => {
         return (
            <div className={styles.toggleWrapper}>
               <div>
                  {
                     checkedCount > 0 && checkedCount !== 1 && checkedCount !== 0?
                        <span className={styles.toggleTitle}>
                           [ {checkedCount} ]
                           </span>
                        : null
                  }
                  {
                     checkedCount === 1 ?
                     <span className={styles.longToggleTitle} >{title}</span> : <span className={styles.toggleTitle}>{ title}</span>
                  }
               </div>
               <i className='bx bx-chevron-down'></i>
            </div>
         )
      }} customElement={() => {
         return (
            <div className={cx({
               customElementWrapper: identityLabel !== 'clients',
               customClientsElement: identityLabel === 'clients'
            })}>
               {
                  fetchStatuses.isLoading ?
                     <div className={styles.preloader}>
                        <Preloader />
                     </div>
                     :
                     !fetchStatuses.isError ?
                        <>
                           <div className={styles.searchWrapper}>
                              <Input
                                 type='search'
                                 placeholder={`${t('search')}...`}
                                 onChange={(e) => setArrCheckedValue(handleSearch(e, data, arrCheckedValue2))}
                                 className={styles.search}
                              />
                           </div>
                           <div className={cx({
                              itemsWrapper: identityLabel !== 'clients',
                              itemsClientsWrapper: identityLabel === 'clients'
                           })}>
                              <div title={t('all')} className={styles.checkAll}>
                                 <Checkbox 
                                    checked={isCheckedAll}
                                    icon={
                                       <div className={styles.icon} >
                                          <i className='bx bx-checkbox'></i>
                                       </div>
                                    } checkedIcon={
                                       <div>
                                          <i className='bx bx-checkbox-checked'></i>
                                       </div>
                                    }
                                    onClick={(state) => {
                                       setCheckAll(state)
                                       let result = arrCheckedValue.map((item: any) => {
                                          if(item){
                                             return {...item, isChecked: state}
                                          }
                                       })
                                       setArrCheckedValue(result)
                                       setArrCheckedValue2(result) 
                                    }}
                                    checkedClassName={styles.icon}
                                    label={t('all')}
                                 />
                              </div>
                              {
                                 arrCheckedValue ? arrCheckedValue.length > 0 ?
                                    arrCheckedValue?.map((item, index) => {
                                       let convertedIndex = String(index)
                                       let titleName = String(item.label)
                                       return (
                                          <div title={titleName} key={index}>
                                             <Checkbox  icon={
                                                <div className={styles.icon} >
                                                   <i className='bx bx-checkbox'></i>
                                                </div>
                                             } checkedIcon={
                                                <div>
                                                   <i className='bx bx-checkbox-checked'></i>
                                                </div>
                                             }
                                                onClick={(state) => {
                                                   setArrCheckedValue([
                                                      ...arrCheckedValue.slice(0, index),
                                                      { label: arrCheckedValue[index].label, value: arrCheckedValue[index].value, isChecked: state },
                                                      ...arrCheckedValue.slice(index + 1)
                                                   ])
                                                   setArrCheckedValue2([
                                                      ...arrCheckedValue2.slice(0, index),
                                                      { label: arrCheckedValue2[index].label, value: arrCheckedValue2[index].value, isChecked: state },
                                                      ...arrCheckedValue2.slice(index + 1)
                                                   ])
                                                }}
                                                checked={item.isChecked}
                                                checkedClassName={styles.icon}
                                                label={item.label}
                                                id={item.label + item.value + convertedIndex}
                                             />
                                          </div>
                                       )
                                    })
                                    :
                                    t("noData")
                                    :
                                    null
                              }
                           </div>
                        </>
                        :
                        t('couldntFetch')
               }
            </div>
         )
      }} />
   )
}

export default DropDownFilter;