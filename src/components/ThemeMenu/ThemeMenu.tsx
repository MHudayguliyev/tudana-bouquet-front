import React, { useRef, useState, useEffect } from "react";

// typed redux hook
import { useAppDispatch } from "@app/hooks/redux_hooks";

import ThemeAction from "@redux/actions/ThemeAction";
import useClickOutside from "@app/hooks/useClickOutsideDropdown";

// custom styles
import styles from "./ThemeMenu.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const mode_settings = [
  {
    id: "light",
    name: "Light",
    background: "light-background",
    class: "theme-mode-light",
  },
  {
    id: "dark",
    name: "Dark",
    background: "dark-background",
    class: "theme-mode-dark",
  },
];

const color_settings = [
  {
    id: "blue",
    name: "Blue",
    background: "blue-color",
    class: "theme-color-blue",
  },
  {
    id: "red",
    name: "Red",
    background: "red-color",
    class: "theme-color-red",
  },
  {
    id: "cyan",
    name: "Cyan",
    background: "cyan-color",
    class: "theme-color-cyan",
  },
  {
    id: "green",
    name: "Green",
    background: "green-color",
    class: "theme-color-green",
  },
  {
    id: "orange",
    name: "Orange",
    background: "orange-color",
    class: "theme-color-orange",
  },
];

const ThemeMenu = () => {
  const menu_ref: any = useRef(null);
  const menu_toggle_ref: any = useRef(null);
  const [showMenu, setShowMenu] = useClickOutside(menu_ref, menu_toggle_ref)

  const setActiveMenu = () => setShowMenu(true);

  const closeMenu = () => setShowMenu(false);

  const [currMode, setcurrMode] = useState("light");

  const [currColor, setcurrColor] = useState("blue");

  const dispatch = useAppDispatch();

  const setMode = (mode: any) => {
    setcurrMode(mode.id);
    localStorage.setItem("themeMode", mode.class);
    dispatch(ThemeAction.setMode(mode.class));
  };

  const setColor = (color: any) => {
    setcurrColor(color.id);
    localStorage.setItem("colorMode", color.class);
    dispatch(ThemeAction.setColor(color.class));
  };

  useEffect(() => {
    const themeClass = mode_settings.find(
      (e) => e.class === localStorage.getItem("themeMode")
    );

    const colorClass = color_settings.find(
      (e) => e.class === localStorage.getItem("colorMode")
    );

    if (themeClass !== undefined) setcurrMode(themeClass.id);

    if (colorClass !== undefined) setcurrColor(colorClass.id);
  }, []);

  return (
    <div>
      <button
        ref={menu_toggle_ref}
        className={styles.dropdown__toggle}
        onClick={() => setActiveMenu()}
      >
        <i className="bx bx-palette"></i>
      </button>
      <div ref={menu_ref} className={
        cx({
          theme_menu: true,
          menuActive: showMenu
        })
      }>
        <h4>Theme settings</h4>
        <button className={styles.theme_menu__close} onClick={() => closeMenu()}>
          <i className="bx bx-x"></i>
        </button>
        <div className={styles.theme_menu__select}>
          <span>Choose mode</span>
          <ul className={styles.mode_list}>
            {mode_settings.map((item, index) => (
              <li key={index} onClick={() => setMode(item)}>
                <div
                  className={
                    cx({
                      mode_list__color: true,
                      [`${item.background}`]: true,
                      colorActive: item.id === currMode
                    })
                  }>
                  <i className="bx bx-check"></i>
                </div>
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.theme_menu__select}>
          <span>Choose color</span>
          <ul className={styles.mode_list}>
            {color_settings.map((item, index) => (
              <li key={index} onClick={() => setColor(item)}>
                <div
                  className={
                    cx({
                      mode_list__color: true,
                      [`${item.background}`]: true,
                      colorActive: item.id === currColor
                    })
                  }
                >
                  <i className="bx bx-check"></i>
                </div>
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ThemeMenu;
