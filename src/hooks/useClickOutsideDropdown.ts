import React, { RefObject, useEffect, useState } from "react";

const useClickOutside = <T extends HTMLElement = HTMLElement, U extends HTMLElement = HTMLElement>
   (dropdownRef: RefObject<T>, toggleRef: RefObject<U>): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
   const [showDropdown, setShowDropdown] = useState(false);
   useEffect(() => {
      const maybeHandler = (event: MouseEvent) => {
         if (dropdownRef.current && toggleRef.current?.contains(event.target as Node)) {
            setShowDropdown(!showDropdown)
         } else {
            // user click outside toggle and content
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
               setShowDropdown(false)
            }
         }
      };
      document.addEventListener("mousedown", maybeHandler);
      return () => {
         document.removeEventListener("mousedown", maybeHandler);
      };
   });
   return [showDropdown, setShowDropdown];
}

export default useClickOutside;