import React from 'react';
// custom styles
import styles from './SidebarSubItem.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

type SidebarSubItemProps = {
   title: string
   icon: string
   active: boolean
}

const SidebarSubItem = (props: SidebarSubItemProps) => {

   const {
      title,
      icon,
      active,
   } = props;

   return (
      <div className={styles.sidebar__sub_item}>
         <div className={
            cx({
               sidebar__sub_item_inner: true,
               active: active
            })
         }>
            <i className={icon}></i>
            <span>{title}</span>
         </div>
      </div>
   );
};

export default SidebarSubItem;