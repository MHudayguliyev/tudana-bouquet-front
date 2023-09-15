import React, { ReactNode, useEffect, useState } from "react";
// own component library
import { Button, Input, Paper, SizedBox } from "@app/compLibrary";
// custom styles 
import styles from './TopBurgerMenu.module.scss';
// typed redux hooks
import { useAppDispatch, useAppSelector } from "@app/hooks/redux_hooks";
// action creators
import ThemeAction from "@redux/actions/ThemeAction";
// custom icons
import FilterClean from '@app/assets/customIcons/filterClean.svg'
import { ClearBuffer } from './../../redux/types/MaterialTypes';

type TopBurgerMenuProps = {
   children: ReactNode
   title?: string,
   filter?: boolean
   search?: Function | any,
   setFilter?: Function | any,
   clearFilter?: Function | any
}

const TopBurgerMenu = (props: TopBurgerMenuProps) => {
   const {
      children,
      title,
      search,
      filter,
      setFilter,
      clearFilter
   } = props;

   const [showContent, setShowContent] = useState(false);
   // const [clearFilter, setClearFilter] = useState(false)
   useEffect(() => {
      if (showContent)
         document.getElementsByTagName('body')[0].classList.add('modal-opened')
      else
         document.getElementsByTagName('body')[0].classList.remove('modal-opened')
   }, [showContent])

   const dispatch = useAppDispatch()
   const isFixedOrderFilter = useAppSelector(state => state.themeReducer.isFixedOrderFilter)

   const toggleFilterFixed = () => {
      dispatch(ThemeAction.toggleFixedOrderFilter(!isFixedOrderFilter))
   }

   useEffect(() => {
      if (showContent) {
         dispatch(ThemeAction.toggleFixedOrderFilter(false))
      }
   }, [showContent])

   return (
      <>
         <Paper rounded>
            <div className={styles.menuBurgerButton}>
               <div className={styles.menuBurgerButtonStart}>
                  <div className={styles.menuBurgerButtonStartIcon}>
                     <Input
                        placeholder='Search'
                        className={styles.searchStyle}
                        onChange={(e) => search(e)}
                     />
                  </div>
               </div>
               <div style={{ display: 'flex' }}>
                  <Button onClick={() => {
                     setShowContent(true)
                     toggleFilterFixed()
                  }} type="text" isIconContent circle>
                     <i className='bx bx-chevron-right' ></i>
                  </Button>
                  <SizedBox width={5} />
                  <Button isIconContent circle color='theme' onClick={() => toggleFilterFixed()}>
                     <i className='bx bx-pin' ></i>
                  </Button>
                  <SizedBox width={5} />
                  <Button isIconContent circle color={`${filter ? 'red' : 'theme'}`}  onClick={() => {setFilter(false); clearFilter()}}>
                     <img src={FilterClean} alt="Clear filter button"/>
                  </Button>
               </div>
            </div>
         </Paper>
         <SizedBox height={15} />
         {
            showContent ?
               <div className={styles.menuBurgerWrapper}>
                  <div className={styles.closeButton}>
                     <Button type="text" circle fullHeight fullWidth center
                        onClick={() => {
                           setShowContent(false)
                        }}
                     >
                        <i className='bx bx-x'></i>
                     </Button>
                  </div>
                  <div className={styles.menuBurgerContent}>
                     {children}
                  </div>
               </div>
               :
               null
         }
      </>
   )
}

export default TopBurgerMenu;
