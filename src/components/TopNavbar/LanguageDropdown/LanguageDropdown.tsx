import React, { useMemo } from "react";

// own component library
import { SizedBox } from "@app/compLibrary";
// for translation
import { useTranslation } from "react-i18next";

// custom styles
import styles from './LanguageDropdown.module.scss';
// data for demonstration
import languages from "@app/assets/JsonData/language";



// User custom toggler for dropdown component
type UserToggleProps = {
   data: {
      icon: string;
      label: string;
      value: string;
   }[]
}

export const UserToggle = (props: UserToggleProps) => {

   const {
      data,
   } = props;
   const { i18n } = useTranslation()

   const selectedLanguage = useMemo(() => {
      return data.find(item => item.value === i18n.language)
   }, [i18n.language])

   return (
      <div className={styles.topnav__right_user} >
         <img src={selectedLanguage?.icon} alt="Language flag image" width={30} />
         <SizedBox width={10} />
         <div className={styles.topnav__right_user__name}>{selectedLanguage?.label}</div>
      </div >
   )
};

// select language menu component
type SelectLanuageMenuProps = typeof languages[0]

export const SelectLanuageMenu = (props: SelectLanuageMenuProps) => {
   const {
      icon,
      label,
      value,
   } = props;
   const { i18n } = useTranslation()
   const changeLanuage = (value: string) => {
      i18n.changeLanguage(value);
      localStorage.setItem('language', value);
   }
   return (
      <div className={styles.notification_item} onClick={() => changeLanuage(value)}>
         <img src={icon} alt="Language flag image" width={30} />
         <SizedBox width={10} />
         <span>{label}</span>
      </div>
   )
}