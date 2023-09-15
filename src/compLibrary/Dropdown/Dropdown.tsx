import React, { CSSProperties, ReactNode, useRef, useState, useEffect } from "react";

// custom hook
import useClickOutsideDropdown from "@hooks/useClickOutsideDropdown";

// custom styles
import styles from "./Dropdown.module.scss";
import className from "classnames/bind";

type SearchValues = {
  label: string
  value: string | number,
  isChecked: boolean
}


interface DropdownProps<T> {
  icon?: string
  badge?: string
  customToggle?: () => ReactNode
  contentData?: Array<T>
  renderItems?: (data: T, index: number) => ReactNode
  renderFooter?: () => ReactNode
  customElement?: () => ReactNode
  dropDownContentStyle?: CSSProperties
  /** @default false */
  disabled?: boolean,
  data?: SearchValues[] | any,
  checkedAll?: boolean,
  onChange?: any
  arr2?: SearchValues[] | any,
  partnerList?: Array<string>,
  warehouseList?: Array<string>,
  statusList?: Array<string>
  usersList?: Array<string>
}

const cx = className.bind(styles);

function Dropdown<T>(props: DropdownProps<T>) {

  const {
    renderItems,
    badge,
    contentData,
    customToggle,
    icon,
    renderFooter,
    customElement,
    dropDownContentStyle,
    disabled = false,
    onChange,
    arr2,
    partnerList,
    warehouseList,
    statusList,
    usersList
  } = props;


  // for dropdown active | deactive
  const dropdown_content_el = useRef(null);
  const toggle_ref = useRef(null);
  const [showDropdown] = useClickOutsideDropdown(dropdown_content_el, toggle_ref);

  useEffect(() => {
    if(!showDropdown){
      var arrCopy: SearchValues[] = []
      if((
        partnerList?.length === 0 || 
        warehouseList?.length === 0 || 
        statusList?.length === 0 || 
        usersList?.length === 0
      ) && arr2?.length){
        arrCopy = arr2?.map((item:any) => item && {...item, isChecked: true})
        onChange(arrCopy?.map(item => item as SearchValues))
      }
    }

  }, [showDropdown, 
    !!partnerList, 
    !!warehouseList, 
    !!statusList, 
    !!usersList])


  return (
    <div className={styles.dropdown}>
      <button type="button" disabled={disabled} className={
        cx({
          dropdown__toggle: true,
          disabled: disabled
        })
      } ref={toggle_ref}>
        {icon ? <i className={icon}></i> : ""}
        {badge ? (
          <span className={styles.dropdown__toggle_badge}>{badge}</span>
        ) : ""}
        {customToggle ? customToggle() : ""}
      </button>

      <div ref={dropdown_content_el} style={dropDownContentStyle} className={
        cx({
          dropdown__content: true,
          active: showDropdown
        })
      }>
        {
          customElement ?
            customElement() :
            (contentData && renderItems)
              ? contentData.map((item, index: number) =>
                renderItems(item, index)
              )
              : ""
        }
        {
          renderFooter ? (
            <div className={styles.dropdown__footer}>{renderFooter()}</div>
          ) : (
            ""
          )
        }
      </div>
    </div>
  );
};

export default Dropdown;
