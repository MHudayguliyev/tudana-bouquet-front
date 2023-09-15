import React, { ChangeEvent, CSSProperties, useEffect, useState } from 'react';

// own component library
import { Checkbox, Dropdown, Input } from '@app/compLibrary';
// custom styles
import styles from './DropDownSelect.module.scss';
import classNames from "classnames/bind";
// for translation
import { useTranslation } from 'react-i18next';
//own component library
import Preloader from '@app/compLibrary/Preloader/Preloader';
import usePrevious from '@app/hooks/usePrevious';

const cx = classNames.bind(styles);


export type SearchValues = {
   label: string | any
   value: string | number
}

interface DropDownSelectProps<T> {
   title?: any
   data: T 
   onChange: (value: SearchValues) => void
   dropDownContentStyle?: CSSProperties
   fetchStatuses: { isLoading: boolean, isError: boolean }
   /** @default false */
   titleSingleLine?: boolean
   value?: SearchValues
   maintitleOutside?: SearchValues
   isInputField?: boolean,
   wasSelected?: boolean
   locale?: string | any,
   disable?: boolean,
   id?: string
}

function DropDownSelect<T extends SearchValues[]>(props: DropDownSelectProps<T>) {

   const {
      title,
      data,
      onChange,
      dropDownContentStyle,
      fetchStatuses,
      titleSingleLine,
      value,
      maintitleOutside,
      isInputField,
      locale,
      disable,
      id
   } = props;

   // for translation
   const { t } = useTranslation();
   // array of selected elements
   const [arrSearch, setArrSearch] = useState<T | SearchValues[]>(data);
   const [mainTitle, setMainTitle] = useState<SearchValues | undefined>(value ? value : undefined);
   const prevMainTitle = usePrevious(maintitleOutside)

   useEffect(() => {
      setMainTitle(value)
   }, [value])

   useEffect(() => {
      if (prevMainTitle?.value !== maintitleOutside?.value)
         setMainTitle(maintitleOutside)
   }, [maintitleOutside])

   useEffect(() => {
      setArrSearch(data);
   }, [fetchStatuses.isLoading, fetchStatuses.isError]);

   useEffect(() => {
      if (mainTitle?.value)
      onChange(mainTitle);
   }, [mainTitle])


   // later will change
function handleSearch<T extends SearchValues[]>(event: ChangeEvent<HTMLInputElement>, data: T) {
   const value = event.currentTarget.value?.toLowerCase();
   const result = [];
   for (let i = 0; i < data.length; i++) {
      const sentence = data[i]?.label[locale]?.toLowerCase();
      if (sentence.includes(value)) {
         result.push({ ...data[i] });
      }
   }
   return result;
}


   return (
      <Dropdown disabled={disable} dropDownContentStyle={dropDownContentStyle} customToggle={() => {
         return (
            <div className={styles.toggleWrapper}>
               <span className={
                  cx({
                     toggleTitle: true,
                     singleLine: titleSingleLine
                  })
               }>
                  {
                     mainTitle?.label[locale] ? mainTitle?.label[locale] : mainTitle?.label ? mainTitle?.label : title
                  }
               </span>
               <i className='bx bx-chevron-down'></i>
            </div>
         )
      }} customElement={() => {
         return (
            <div className={styles.customElementWrapper}>
               {
                  fetchStatuses.isLoading ?
                     <div className={styles.preloader}>
                        <Preloader />
                     </div>
                     :
                     !fetchStatuses.isError ?
                        <>
                        
                         <div >
                            {
                               isInputField ? 
                               <div className={styles.searchWrapper}>
                                     <Input
                                        type='text'
                                        placeholder={`${t('search')}...`}
                                        onChange={(e) => setArrSearch(handleSearch(e, data))}
                                        id={id}
                                     />
                               </div> : ''
                            }
                         </div>
                        
                           <div className={styles.itemsWrapper}>
                              {
                                 arrSearch ? arrSearch.length > 0 ?
                                    arrSearch.map((item: any, index: number) => {
                                       return (
                                          <span key={index} onClick={() => {
                                             setMainTitle(arrSearch[index])
                                          }} className={styles.item}>
                                             {!!locale ? item.label[locale] : item.label.tm ? item.label.tm : item.label}
                                          </span>
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

export default DropDownSelect;