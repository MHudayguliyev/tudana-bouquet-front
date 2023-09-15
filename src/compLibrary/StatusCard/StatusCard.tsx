import React from "react";
// custom styles
import styles from "./StatusCard.module.scss";

type StatusCardProps = {
  icon: string
  count:any
  title: string 
}

const StatusCard = (props: StatusCardProps) => {

  const {
    icon,
    count,
    title,
  } = props;

  return (
    <div className={styles.status_card}>
      <div className={styles.status_card__icon}>
        <i className={icon}></i>
      </div>
      <div className={styles.status_card__info}>
        <h4 className={styles.number}>{count}</h4>
        <span>{title}</span>
      </div>
    </div>
  );
};

export default StatusCard;
