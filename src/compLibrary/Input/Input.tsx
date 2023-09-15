import React, { InputHTMLAttributes, useRef } from "react";
// custom styles
import styles from './Input.module.scss';
import classNames from 'classnames/bind';
// helpers
import { capitalize } from "@utils/helpers";

const cx = classNames.bind(styles);

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
   /** @default medium */
   fontSize?: 'small' | 'medium' | 'big'
   /** @defualt medium */
   fontWeight?: 'normal' | 'medium' | 'bold'
   autoFocus?: boolean
   maxLength?: number
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref): JSX.Element => {
   const {
      fontSize = 'medium',
      fontWeight = 'medium',
      className,
      autoFocus,
   } = props;

   return (
      <input  autoFocus={autoFocus} ref={ref} {...props} className={`${className} ${cx({
            input: true,
            [`fontSize${capitalize(fontSize)}`]: true,
            [`fontWeight${capitalize(fontWeight)}`]: true,
         })}
      `} />
   )
})

export default Input;