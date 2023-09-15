import React, { useEffect, useMemo, useState } from "react";
import { Link, useMatch, useRouter } from "@tanstack/react-location";
// custom styles
import styles from "./SideBar.module.scss";
import classNames from "classnames/bind";

// fake data for demonstration
import sidebar_items from "@app/assets/JsonData/sidebar_routes";

// company logo
import logo from "@app/assets/images/logo.png";
// custom components
import SidebarItem from "./SidebarItem/SidebarItem";
// own component library
import { Button } from "@app/compLibrary";
// typed redux hooks
import { useAppDispatch, useAppSelector } from "@app/hooks/redux_hooks";
// action creators
import ThemeAction from "@redux/actions/ThemeAction";
// for translation
import { useTranslation } from "react-i18next";
// types
import { Language } from "@app/Types/Language";
/// redux
import ClientAction from '@redux/actions/ClientsAction'

const cx = classNames.bind(styles);


const Sidebar = () => {
  // getting location
  const {
    state: { location },
  } = useRouter();
  const [own, setOwn] = useState<string>(location.pathname);
  
  const isOpenSideBar = useAppSelector(state => state.themeReducer.isOpenSidebar);
 
  const toggleSidebar = () => {
    dispatch(ThemeAction.toggleSidebar(!isOpenSideBar))
  }
  const dispatch = useAppDispatch();

  // getting active item and subItem index
  const activeItem = sidebar_items.findIndex((item) => {
    return item.route === location.pathname
  });
 

  // for translation
  const { i18n } = useTranslation();

  const language: Language = i18n.language as Language;
  const match = useMatch();

  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.sidebar_menu}>
          {/* Company logo with link to site */}
          <a href="#" target="_blank">
            <div className={styles.sidebar__logoWrapper}>
              <img
                className={styles.sidebar__logo}
                src={logo}
                alt="Company logo"
              />
            </div>
          </a>
          {/* Side bar items */}
          {sidebar_items.map((item, index) => (
            <Link
              style={{ width: "100%" }}
              onClick={() => {
                setOwn(item.route);
                toggleSidebar()
              }}
              to={item.route}
              key={index}
              className={styles.sidebarLink}
            >
              <SidebarItem
                title={item.display_name[language]}
                icon={item.icon}
                active={index === activeItem}
              />
            </Link>
          ))}
          {/* // !isOpenSideBar && */}
          <div className={styles.sideBarShowBtn}>
            {
              match.pathname === '/orders/' ? 
              <Button
              circle
              isIconContent
              color="theme"
              linkProps={{ to: "/orders/make-order" }}
              onClick={() => toggleSidebar()}
            >
              <i className="bx bx-package"></i>
            </Button>
            : 
            match.pathname === '/orders/make-order/' ? 
            <Button
              circle
              isIconContent
              color="theme"
              linkProps={{ to: "/add-materials" }}
              onClick={() => toggleSidebar()}
            >
              <i className="bx bx-basket"></i>
            </Button>
          : 

            match.pathname === '/add-materials' ? 
            <Button
              circle
              isIconContent
              color="theme"
              linkProps={{ to: "/orders/make-order" }}
              onClick={() => toggleSidebar()}
            >
              <i className="bx bx-arrow-back"></i>
            </Button>
          : 

          match.pathname === '/contacts' ? 
          <Button
            circle
            isIconContent
            color="theme"
            onClick={() => {toggleSidebar(); dispatch(ClientAction.setModal(true))}}
          >
            <i className='bx bx-user-plus'></i>
          </Button>
          : null
            }
          </div>
        </div>
        <div
          className={cx({
            sidebar_sub_menu: true,
            // showSidebar_sub_menu: isOpenSideBar,
            // closeSidebar_sub_menu: !isOpenSideBar
          })}
        >
          {/* Side bar sub menu hide|show button */}
          {/* <div className={styles.sidebar_hide_button}>
          <Button circle isIconContent
          // onClick={() => toggleSidebar()}
          >
            <i className='bx bx-package' ></i>
          </Button>
        </div>
        <SizedBox height={45} /> */}
          {/* <div className={styles.topnav__search}>
          <input type="text" placeholder="Search here..." />
          <i className="bx bx-search"></i>
        </div> */}
          {/* Side bar sub items */}
          {/* {subMenu &&
          subMenu.map((item, index) => (
            <Link to={item.route} key={index}>
              <SidebarSubItem
                title={item.display_name[language]}
                icon={item.icon}
                active={index === activeSubItem}
              />
            </Link>
          ))} */}
        </div>
      </div>
    </>
  );
};

export default Sidebar;

