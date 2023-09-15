import React, { ReactNode, useState } from "react";

import styles from "./Layout.module.scss";

// custom components
import TopNavbar from '@components/TopNavbar/TopNavbar';
import Sidebar from "@components/Sidebar/Sidebar";
import { useAppSelector } from "@app/hooks/redux_hooks";



type LayoutProps = {
   children: ReactNode
}


const Layout = ({ children }: LayoutProps) => {
   const isOpenSideBar = useAppSelector(state => state.themeReducer.isOpenSidebar);
   const [showModal, setShowModal] = useState(false)
   return (
      <div className={styles.layout}>
         <div className={styles.sideBar}>
            <Sidebar/>
         </div>
         {
            isOpenSideBar ? <Sidebar /> : ''
         }
         <div className={styles.layoutContent}>
            <TopNavbar setShowModal={setShowModal} showModal={showModal}/>
            <div className={styles.layoutPage}>
               {
                  children
               }
            </div>
         </div>
      </div>
   );
};

export default Layout;