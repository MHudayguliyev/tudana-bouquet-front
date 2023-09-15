import React, { ReactNode } from "react";
import classNames from "classnames/bind";

import styles from "./Badge.module.scss";
import { capitalize } from "@utils/helpers";

const cx = classNames.bind(styles);

type BadgeProps = {
  type: 'danger' | 'success' | 'primary' | 'warning' | 'closed'
  content: ReactNode
}

const Badge = (props: BadgeProps) => {

  const {
    type,
    content
  } = props;

  return <span className={
    cx({
      badge: true,
      [`badge${capitalize(type)}`]: true,
    })
  }>
    {content}
  </span>;
};

export default Badge;
