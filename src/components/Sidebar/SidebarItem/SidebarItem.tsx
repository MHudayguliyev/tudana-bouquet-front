import React from "react";
// custom styles
import styles from "./SidebarItem.module.scss";
import className from "classnames/bind";

const cx = className.bind(styles);

type SidebarItemProps = {
  title: string;
  icon: string;
  active: boolean;
};

const SidebarItem = (props: SidebarItemProps): JSX.Element => {
  const { title, icon, active } = props;

  return (
    <div className={styles.sidebar__item}>
      <div
        className={cx({
          sidebar__item_inner: true,
          active: active,
        })}
      >
        <i className={icon}></i>
        <span className={styles.title}>{title}</span>
      </div>
    </div>
  );
};

export default SidebarItem;
