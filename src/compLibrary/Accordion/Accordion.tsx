import React, { useState, useRef } from 'react';
import styles from './Accordion.module.scss';
import classNames from 'classnames/bind';

export type AccordionProps = {
   children: React.ReactNode,
   /** @defaultValue false */
   expanded?: boolean,
   /** @defaultValue false */
   disable?: boolean,
   /** @default false */
   showEndIcon?: boolean
   rightContent?: React.ReactNode
}

const cx = classNames.bind(styles);

const Accordion = (props: AccordionProps): JSX.Element => {
   const {
      children,
      expanded = false,
      rightContent,
   } = props;

   const contentRef = useRef<null | HTMLParagraphElement>(null)
   const [isExpanded, setIsExpanded] = useState(expanded);

   return (
      <>
         <div ref={contentRef} style={{
            height: isExpanded ? contentRef.current?.scrollHeight : '0px'
         }} className={
            cx({
               notExpanded: !isExpanded,
               expanded: isExpanded,
            })
         }>
            {children}
         </div>
         <div className={styles.mainBlock}>
            <button className={styles.button} onClick={() => setIsExpanded(!isExpanded)}>
               {
                  isExpanded ?
                     <i className='bx bx-chevron-up'></i>
                     :
                     <i className='bx bx-chevron-down'></i>
               }
            </button>
            {rightContent}
         </div>
      </>
   )
}

export default Accordion