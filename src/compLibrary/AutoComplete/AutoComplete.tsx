import React, {
   ChangeEvent,
   useEffect,
   useMemo,
   useRef,
   useState,
   MouseEvent as ReactMouseEvent,
   ReactNode,
   CSSProperties
} from "react";
// component library
import Input from "../Input";
import Button from "../Button";

// custom styles
import styles from './AutoComplete.module.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

type SearchValue = {
   label: string,
   value: string | number 
}

type AutoCompleteProps = {
   suggestions: Array<SearchValue>
   /** @default true */
   inputElevation?: boolean
   /** @default true */
   suggestionElevation?: boolean
   placeholder?: string
   noOptionTxt?: ReactNode
   onChange: (value: SearchValue) => void
   style?: CSSProperties
   value: SearchValue | any
   fetchStatuses: { isLoading: boolean, isError: boolean },
}

const AutoComplete = (props: AutoCompleteProps) => {

   const {
      suggestions,
      inputElevation = true,
      suggestionElevation = true,
      placeholder,
      noOptionTxt,
      onChange,
      style,
      value,
      fetchStatuses,
   } = props;

   const [filteredSuggestions, setFilteredSuggestions] = useState<Array<SearchValue>>([]);
   const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
   const [showSuggestions, setShowSuggestions] = useState(false);
   const [input, setInput] = useState("");

   // useEffect(() => {
   //    setInput('Select clients')
   // })

   useEffect(() => {
      if (!fetchStatuses.isError && !fetchStatuses.isLoading) {
         const activeIndex = suggestions.findIndex(suggestion => suggestion.value === value.value) || 0;
         setActiveSuggestionIndex(activeIndex)
         setInput(suggestions[activeIndex]?.label)
         onChange(suggestions[activeIndex])
      }
   }, [value, fetchStatuses.isError, fetchStatuses.isLoading])

   // for focusing on input
   const inputRef = useRef<HTMLInputElement>(null)
   const setFocus = () => inputRef.current && inputRef.current.focus();


   // In the future move this piece of code to its own hook
   const dropDownRef = useRef<HTMLDivElement>(null);
   useEffect(() => {
      const maybeHandler = (event: MouseEvent): any => {
         if (!dropDownRef.current?.contains(event.target as Node)) {
            setShowSuggestions(false);
         }
      };
      document.addEventListener("mousedown", maybeHandler);
      return () => {
         document.removeEventListener("mousedown", maybeHandler);
      };
   });




   useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => {
         // User pressed the enter key
         if (e.key === 'Enter') {
            setInput(suggestions[activeSuggestionIndex].label);
            onChange(suggestions[activeSuggestionIndex])
            setShowSuggestions(false);
         }
         // User pressed the up arrow
         else if (e.key == "ArrowUp") {
            if (activeSuggestionIndex === 0) {
               return;
            }
            

            setActiveSuggestionIndex(activeSuggestionIndex - 1);
         }
         // User pressed the down arrow
         else if (e.key === "ArrowDown") {
            if (activeSuggestionIndex - 1 === filteredSuggestions.length) {
               return;
            }

            setActiveSuggestionIndex(activeSuggestionIndex + 1);
         }
      };
      document.addEventListener('keydown', onKeyDown)
      return () => {
         document.removeEventListener('keydown', onKeyDown)
      }
   }, [activeSuggestionIndex, filteredSuggestions])



   const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const userInput = e.target.value;
      // Filter our suggestions that don't contain the user's input
      const unLinked: Array<SearchValue> = suggestions.filter(
         (suggestion) =>
            suggestion.label.toLowerCase().includes(userInput.toLowerCase())
      );
      
      const activeIndex = suggestions.findIndex(suggestion => suggestion.value === unLinked[0]?.value || 0);

      setFilteredSuggestions(unLinked);   
      setActiveSuggestionIndex(activeIndex)
      setInput(e.target.value);
      setShowSuggestions(true);
   };

   const onClick = (e: ReactMouseEvent<HTMLLIElement>, activeIndex: number) => {
      setFilteredSuggestions([]);
      const input = e.target as HTMLElement;
      setInput(input.innerText);
      setActiveSuggestionIndex(activeIndex)
      setShowSuggestions(false);
      onChange(suggestions[activeIndex])
   };


   const SuggestionsListComponent = () => {
      return (
         filteredSuggestions.length ? (
            <ul className={
               cx({
                  suggestions: true,
                  elevation: suggestionElevation,
                  border: !suggestionElevation,
               })
            }>
               {filteredSuggestions.map((suggestion, index) => {
                  let className;
                  // Flag the active suggestion with a class
                  if (index === activeSuggestionIndex) {
                     className = styles.suggestionActive;
                  }

                  return (
                     <li className={className} key={index} onClick={(e) => onClick(e, index)}>
                        {suggestion?.label}
                     </li>
                  );
               })}
            </ul>
         ) : (
            noOptionTxt ?
               <ul className={
                  cx({
                     suggestions: true,
                     elevation: suggestionElevation,
                     border: !suggestionElevation,
                  })
               }>
                  <div className={styles.noSuggestions}>
                     {
                        noOptionTxt
                     }
                  </div>
               </ul>
               :
               <></>
         )
      )
   };

   const content = useMemo(() => {
      return (
         <div className={
            cx({
               inputWrapper: true,
               border: !inputElevation,
               elevation: inputElevation
            })
         }>
            <Input
               style={{ width: '100%' }}
               placeholder={placeholder}
               type="text"
               onChange={(e) => onInputChange(e)}
               onBlur={() => {
                  setInput(suggestions[activeSuggestionIndex]?.label);
                  onChange(suggestions[activeSuggestionIndex])
               }}
               value={input}
               ref={inputRef}
               onClick={() => {
                  setFilteredSuggestions(suggestions)
                  setShowSuggestions(true)
               }}
            />
            <div className={styles.iconButton}>
               <Button type="text" removePadding fullHeight fullWidth center circle
                  onClick={() => {
                     setFilteredSuggestions(suggestions);
                     setShowSuggestions(true);
                     setFocus()
                  }} >
                  <i className='bx bx-chevron-down'></i>
               </Button>
            </div>
         </div>
      )
   }, [showSuggestions, input, inputElevation, inputRef])

   return (
      <div ref={dropDownRef} style={{ ...style, position: 'relative' }}>
         {content}
         {
            showSuggestions && <SuggestionsListComponent />
         }
      </div>
   );
};

export default AutoComplete;
