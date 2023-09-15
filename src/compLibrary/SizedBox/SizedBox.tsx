import React from 'react';
import { toRem } from "@utils/helpers";

type SizedBoxProps = {
   height?: number
   width?: number
}

const SizedBox = (props: SizedBoxProps): JSX.Element => {

   const {
      height,
      width,
   } = props;

   return (
      <div style={{
         height: height ? toRem(height) : 0,
         width: width ? toRem(width) : 0,
      }} />
      
   )
}

export default SizedBox;