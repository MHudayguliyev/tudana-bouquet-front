import React, { cloneElement, ReactElement, ReactNode, useEffect, useMemo } from "react";

// custom styles
import styles from './Checkbox.module.scss';
import classNames from 'classnames/bind';
import { capitalize } from '@utils/helpers';

const cx = classNames.bind(styles);

type CheckBoxProps = {
   checked: boolean
   icon: ReactElement
   checkedIcon: ReactElement,
   unCheckedIcon?: boolean,
   disabled?: boolean
   /** @description needs to connect label with checkbox */
   id?: string
   onClick: (value: boolean) => void
   /** @default medium
    * @description padding size of around of checkbox
    */
   pSize?: 'small' | 'medium' | 'big'
   label?: ReactNode
   checkedClassName?: string
   removePadding?: boolean
}

const Checkbox = (props: CheckBoxProps) => {

   const {
      checked = false,
      icon,
      checkedIcon,
      unCheckedIcon, //// used to deselect one item of checkOrder(array)
      disabled,
      id,
      onClick,
      pSize = 'medium',
      label,
      checkedClassName = '',
      removePadding,
   } = props;


   const checkboxContent = useMemo(() => {
      return (
         <>
            <input type="checkbox" onClick={() => { disabled ? undefined : onClick(!checked) }} id={id} className={styles.checkBoxInput} defaultChecked={checked}/>
            <div  className={
               cx({
                  baseStyle: true,
                  [`padding${capitalize(pSize)}`]: true,
                  removePadding: removePadding,
                  disabled: disabled,
               })
            }
               onClick={() => { disabled ? undefined : onClick(!checked) }}
            >
               {
                  checked ? cloneElement(checkedIcon, { className: `${checkedClassName} ${styles.iconCheck}` }) 
                  : unCheckedIcon ? icon : icon
               }
            </div>
         </>
      )
   }, [checked, id, pSize, disabled, checkedIcon, icon])

   return (
      <>
         {
            label ?
               <div className={styles.checkboxWrapper}>
                  {
                     checkboxContent
                  }
                  <label htmlFor={id} className={
                     cx({
                        labelStyles: true,
                        disabled: disabled
                     })
                  }>{label}</label>
               </div>
               :
               checkboxContent
         }
      </>
   )
}

export default Checkbox;