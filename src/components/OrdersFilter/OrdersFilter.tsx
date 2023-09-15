import React, { useEffect, useState } from 'react';

// own component library
import { Button, Checkbox, Col, Dropdown, Input, Paper, Row, SizedBox, Switch } from '@app/compLibrary';

// custom styles
import styles from "./OrdersFilter.module.scss";
import classNames from "classnames/bind";
// for translation
import { useTranslation } from 'react-i18next';
// typed redux hooks
import { useAppDispatch, useAppSelector } from '@app/hooks/redux_hooks';
// action creators
import ThemeAction from "@redux/actions/ThemeAction";
// custom components
import DropDownFilter from './DropDownFilter/DropDownFilter';
import TopBurgerMenu from '../TopBurgerMenu/TopBurgerMenu';
// queries
import { useQuery } from 'react-query';
import { getClientList, getOrders, getStatusList, getUserList, getWarehouseList } from '@app/api/Queries/Getters';
import moment from 'moment';
// for notification
import DropDownSelect from '../DropDownSelect/DropDownSelect';
// custom icons
import FilterClean from '@app/assets/customIcons/filterClean.svg'
import { BiFilterAlt } from 'react-icons/bi'
import grid4xWhite from '../../assets/images/grid-white.png'
import grid4xBlack from '../../assets/images/grid-black.png'
import filterClearIcon from '../../assets/images/filterclear.png'
import UpArrow from '../../assets/images/up.svg'
import { Orders } from '@app/api/Types/queryReturnTypes';
import toast from 'react-hot-toast';

const cx = classNames.bind(styles);

type CalculateTypes = {
   value: string,
   label: {
      en: string
      tm: string,
      ru: string
   }
}


const printData = [
   {
      value: "a4",
      label: "A4"
   },
   {
      value: 'pos80',
      label: "Pos80"
   }
];
const calculates: CalculateTypes[] = [
   {
      value: 'all',
      label: {en: 'All', tm: "Hemmesi", ru: "Все"}
   },
   {
      value: 'ord_total_amount',
      label: {en: 'Total amount', tm: "Mukdary b/ç", ru: "По количество"}
   },
   {
      value: 'ord_nettotal',
      label: {en: 'Nettotal', tm: "Bahasy b/ç", ru: "По сумме"}
   }
]
const calculateMfd: CalculateTypes[] = [
   {
      value: 'all',
      label: {en: 'All', tm: "Hemmesi", ru: "Все"}
   },
   {
      value: 'not_deletion',
      label: {en: 'Not deletion', tm: "Pozulmadyklar", ru: "Не удаление"}
   },
   {
      value: 'deletion',
      label: {en: "Deletion", tm: "Pozulanlar", ru: "Удаление"}
   }
]


const calculateOrders: CalculateTypes[] = [
    {
        value: "ord_code",
        label: {en:"Order code", tm: "Sargyt kody", ru: "Код заказа"}
    },
    {
        value: "ord_date",
        label: {en:'Order date', tm: 'Sargyt senesi', ru: 'Дата заказа'}
    },
    {
        value: "ord_status",
        label: {en: "Order status", tm: "Sargyt ýagdaýy", ru: "Статус заказа"}
    },
    {
        value: "client_code",
        label: {en: "Client code", tm: "Müşderi kody", ru: "Код клиента"}
    },
    {
        value: "client_name",
        label: {en: "Client name", tm: "Müşderiniň ady", ru: "Имя клиента"}
    },
    {
        value: "contact_address",
        label: {en: "Client address", tm: "Müşderiniň salgysy", ru: "Адрес клиента"}
    },
  ]
 


type OrdersFilterProps = {
   onCancel: (state: boolean) => void
   unCheckedIcon: boolean
   selectionMode: boolean
   setSelectionMode: Function
   onSelectAll: Function
   onDeselectAll: Function
   limit: number
   page: number
   handlePrintA4: Function
   handlePrintPos80: Function
   searchValue: string,
   setSearchValue: Function
   searchOrders: Function,
   view: string,
   selectAll: boolean,
   setView: Function
   setSelectAll: Function,
   sortDirection: string,
   sortColumn: string,
   setDirection: Function,
   setColumn: Function,
   checkedOrders: Orders[] | undefined | any,
}

const OrdersFilter = (props: OrdersFilterProps) => {

   const {
      selectionMode,
      unCheckedIcon,
      setSelectionMode,
      onSelectAll,
      onDeselectAll,
      onCancel, 
      limit,
      page,
      handlePrintA4,
      handlePrintPos80,
      searchValue,
      setSearchValue,
      searchOrders,
      view,
      selectAll,
      setView,
      setSelectAll,
         sortDirection,
         sortColumn,
      setDirection,
      setColumn,
      checkedOrders,
   } = props;
   const { t } = useTranslation();


   
   // queries
   const {
      isLoading: isLoadingPartnerList,
      isError: isErrorPartnerList,
      data: dataPartnerList,
   } = useQuery('client-list', () => getClientList())

   const {
      isLoading: isLoadingStatusList,
      isError: isErrorStatusList,
      data: dataStatusList,
   } = useQuery('statusList', () => getStatusList())
   const {
      isLoading: isLoadingWarehouseList,
      isError: isErrorWarehouseList,
      data: dataWarehouseList,
   } = useQuery('warehouseList', () => getWarehouseList())
   const {
      isLoading: isLoadingUserList,
      isError: isErrorUserList,
      data: dataUserList,
   } = useQuery('userList', () => getUserList())

   const { refetch } = useQuery('orders', () => getOrders({
      partnerGuids: partnerList,
      startDate: startDate,
      endDate: endDate,
      limit: limit,
      page: page,
      statusGuids: statusList,
      userGuids: usersList,
      warehouseGuids: warehouseList,
      calculateValue: calculateValue,
      calculateMin: calculateMin,
      calculateMax: calculateMax,
      search: searchValue,
      mfd: stateMfd
   }), { refetchOnWindowFocus: false  });


   const lang:string | any = localStorage.getItem('language');

   // filter states
   // const [searchValue, setSearchValue] = useState('');
   const [startDate, setStartDate] = useState(moment().subtract(1, "day").format("YYYY-MM-DD"));
   const [endDate, setEndDate] = useState(moment(new Date()).format("YYYY-MM-DD"));

   const [partnerList, setPartnerList] = useState<string[]>([]);
   const [statusList, setStatusList] = useState<string[]>([]);
   const [warehouseList, setWarehouseList] = useState<string[] | any>([]);
   const [usersList, setUsersList] = useState<string[]>([]);

   const [calculateValue, setCalculateValue] = useState('');
   const [calculateMin, setCalculateMin] = useState<string>('');
   const [calculateMax, setCalculateMax] = useState<string>('');
   const [dropDownClear, setDropDownClear] = useState(false);
   const [isShowToolTip, setShowToolTip] = useState<boolean>(false)

   const [stateMfd, setStateMfd] = useState<string>('2');
   const [filter, setFilter] = useState(false)
   const [body, setBody] = useState('filter')

   /// print states 
   const [printValue, setPrintValue] = useState<string>('A4')
   // const [selectAll, setSelectAll] = useState(false);



   const dispatch = useAppDispatch()
   // for fixing order filter on top of screen
   const isFixedOrderFilter = useAppSelector(state => state.themeReducer.isFixedOrderFilter)

   const toggleFilterFixed = () => {
      dispatch(ThemeAction.toggleFixedOrderFilter(!isFixedOrderFilter))
   }


   const clearFilter = async () => {
      setSearchValue('');
      setStartDate(moment().subtract(1, "days").format("YYYY-MM-DD"));
      setEndDate(moment(new Date()).format("YYYY-MM-DD"));
      setWarehouseList([]);
      setStatusList([]);
      setPartnerList([]);
      setUsersList([]);
      setCalculateValue('');
      setCalculateMin('');
      setCalculateMax('');
      await setDropDownClear(true)
      await refetch()
   }


   const applyFilter = async () => {

      if(
         startDate !== moment().subtract(1, "day").format("YYYY-MM-DD") ||
         endDate !== moment(new Date()).format("YYYY-MM-DD") ||
         !!calculateValue ||
         !!calculateMin && !!calculateMax ||
         !!searchValue ||
         partnerList.length !== dataPartnerList?.length ||
         warehouseList.length !== dataWarehouseList?.length ||
         usersList.length !== dataUserList?.length ||
         statusList.length !== dataStatusList?.length
      ) {
         refetch();
         setFilter(true)
      }
   }


   useEffect(() => {
      const listener = (e: any) => {
         const enter: boolean = e.code === 'Enter'
         if(
         (startDate !== moment().subtract(1, "day").format("YYYY-MM-DD") && enter) ||
         (endDate !== moment(new Date()).format("YYYY-MM-DD") && enter) ||
         (calculateValue.length > 0 && enter) ||
         (searchValue.length > 0 && enter) ||
         (calculateMin.length > 0 && calculateMax.length > 0 && enter) ||
         (partnerList.length !== dataPartnerList?.length && enter) ||
         (warehouseList.length !== dataWarehouseList?.length && enter) ||
         (usersList.length !== dataUserList?.length && enter) ||
         (statusList.length !== dataStatusList?.length && enter)
         ){
            refetch();
            setFilter(true)
         }
      }

      document.addEventListener('keydown', listener)
      return () => {
         document.removeEventListener('keydown', listener)
      }
   }, [
      startDate,
      endDate,
      calculateValue,
      calculateMin, calculateMax,
      searchValue,
      partnerList, 
      warehouseList,
      usersList,
      statusList
   ])

   useEffect(() => {
      if (selectAll) {
         onSelectAll()
      } else {
         onDeselectAll()
      }
   }, [selectAll]);

   useEffect(() => {
      if(selectionMode) 
         setShowToolTip(false)
      else if(!selectionMode && selectAll) {
         setSelectAll(false)
      }else if(!selectionMode && checkedOrders?.length > 0){
         onCancel(false) /// whenever switch mode off, we set checkedorders back to (is_selected)::false 
      }
   }, [selectionMode])

 




   const content = (
      <div className={styles.filterWrapper}>
        <div className={styles.filterHead}>
        <Row rowGutter={8} colGutter={8}>
            <Col  grid={{sm: 6}}>
                <div className={styles.headInput}>
                    <Input type='search'
                        placeholder={t('search')}
                        value={searchValue}  
                        onChange={(e) => searchOrders(e)}
                        className={styles.searchInput}
                        autoFocus
                        tabIndex={1}
                    />
                    </div>
            </Col>
            <Col grid={{sm: 6}}>
                <div className={styles.headInput}>
                    <Input
                    type='date'
                    value={startDate}
                    onChange={(e) => {
                                 if (moment(e.currentTarget.value).isBefore(moment(endDate)))
                                    setStartDate(e.currentTarget.value)
                                 else setStartDate(moment(endDate).subtract(1, 'days').format('YYYY-MM-DD'))
                    }}
                    tabIndex={4}
                    />
                            <span className={styles.dividerElement}>~</span>
                            <Input
                            type='date'
                            value={endDate}
                            onChange={(e) => {
                              console.log('e value', e.currentTarget.value)
                                if (moment(e.currentTarget.value).isAfter(moment(startDate)))
                                    setEndDate(e.currentTarget.value)
                                else setEndDate(moment(startDate).add(1, 'days').format('YYYY-MM-DD'))
                            }}
                            tabIndex={5}
                            />
                    </div>
            </Col>
            <Col>
                    <Button startIcon={<BiFilterAlt size={18}/>} color='pink' center rounded onClick={() => {
                           applyFilter()
                        }}>
                        {t('apply')}
                    </Button>
                </Col>
                <Col>
                    <Button isIconContent rounded color={`${filter ? "pink" : "white"}`} onClick={() => {
                        clearFilter(); setFilter(false)
                        }}>
                        {filter ? 
                           <img src={FilterClean} alt="Clear filter button" width={18} height={18} />
                           : 
                           <img src={filterClearIcon} alt="Clear filter button" width={26} height={26} />                        
                        }
                    </Button>
                </Col>
            <Col className={cx({activeSection: true, borderBtm: body === 'filter'})}>
                <h4 onClick={() => setBody('filter')} className={cx({active: body === 'filter', headBtn: true})}>{t('filter')}</h4>
            </Col>
            <Col className={cx({activeSection: true, borderBtm: body === 'print'})}>
                <h4 onClick={() => setBody('print')} className={cx({active: body === 'print', headBtn: true})}>{t('print2')}</h4>
            </Col>
        </Row>
        <Row rowGutter={8} colGutter={8}>
                  <Col>
                    <div className={styles.filterSelectWrapper}>
                     <h4>{t('sort')}</h4>
                        <div className={`${styles.filterInput} ${styles.filterSelect}`}>
                           <DropDownSelect
                              dropDownContentStyle={{ right: '-10%' }}
                              onChange={(item) => { 
                                 setColumn(item.value as string)
                               }}
                              fetchStatuses={{ isLoading: false, isError: false }}
                              title={t('orderCode')}
                              titleSingleLine
                              data={calculateOrders}
                              locale={lang}

                           />
                        </div>
                     </div>
                    </Col>
                    <Col>
                        <Button rounded color='theme' onClick={() => {
                           if(sortDirection == 'ASC') {
                              setDirection('DESC')
                           }else if(sortDirection ==='DESC'){
                              setDirection('ASC') 
                           }
                        }}>
                            {sortDirection === 'ASC' ? 
                              <i className="bx bx-sort-up"></i> :
                              <i className="bx bx-sort-down"></i> 
                            }
                            {sortDirection}
                        </Button>
                    </Col>

                <div className={styles.twoXBtn}>
                <Col>
                    <Button rounded isIconContent color={`${view === '2x' ? "theme" : "white"}`} onClick={() => {setView('2x')}}>
                    <i className='bx bxs-grid-alt'></i>
                    </Button>
                </Col>
                </div>
                <div className={styles.threeXBtn}>
                <Col>
                <Button rounded isIconContent color={`${view === '3x' ? "theme" : "white"}`} onClick={() => {setView('3x')}}>
                  <i className='bx bxs-grid'></i>
                  </Button>
                </Col>
                </div>
                <div className={styles.fourXBtn}>
                  <Col>
                  <Button rounded isIconContent color={`${view === '4x' ? "theme" : "white"}`} onClick={() => {setView('4x')}}>
                     <img src={view==='4x' ? grid4xWhite : grid4xBlack} className={styles.grid4X}/>
                  </Button>
                  </Col>
                  </div>
                  <Col>
                    <Button rounded color={`${isFixedOrderFilter ? "theme" : "white"}`} onClick={() => toggleFilterFixed()}>
                        <i className='bx bx-pin' ></i>
                        {t('Pin')}
                    </Button>
                  </Col>
          </Row>
        </div>
          <div className={styles.filterBody}>
          {
              body === 'filter' ? 
              <div className={styles.filterBody}>
               <Row colGutter={10} rowGutter={10}>
                    <Col grid={{ md: 3, xs: 6 }}>
                     <div className={styles.filterInputClients} style={{marginBottom: '0'}}>
                        <DropDownFilter
                           dropDownContentStyle={{ right: '-10px'}}
                           onChange={(values) => { setPartnerList(values) }}
                           fetchStatuses={{ isLoading: isLoadingPartnerList, isError: isErrorPartnerList }}
                           title={partnerList?.length == 1 ?
                              dataPartnerList?.map(item => (
                                 item.value === partnerList[0] && item.label as string
                              ))
                                 
                              : !partnerList?.length ? 
                                 `[ 0 ] ${t('clients')}` : t('clients')
                           }
                           data={dataPartnerList ? dataPartnerList : []}
                           partnerList={partnerList}
                           clear={dropDownClear}
                           setClear={setDropDownClear}
                           identityLabel={'clients'}
                        />
                     </div>
                    </Col> 
                    <Col grid={{ md: 3, xs: 6 }}>
                     <div className={styles.filterInput}>
                        <DropDownFilter
                           dropDownContentStyle={{ right: '-10px' }}
                           onChange={(values) => {  setWarehouseList(values) }}
                           title={warehouseList?.length == 1 ?
                              dataWarehouseList?.map(item => (
                                 item.value === warehouseList[0] && item.label as string
                              ))
                                 
                              : !warehouseList?.length ? 
                              `[ 0 ] ${t('stock')}` : t('stock')
                           }
                           fetchStatuses={{ isLoading: isLoadingWarehouseList, isError: isErrorWarehouseList }}
                           data={dataWarehouseList ? dataWarehouseList : []}
                           warehouseList={warehouseList}
                           clear={dropDownClear}
                           setClear={setDropDownClear}
                        />
                     </div>
                    </Col>
                    <Col grid={{ md: 3, xs: 6 }}>
                     <div className={styles.filterInput}>
                        <DropDownFilter
                           dropDownContentStyle={{ right: '-10px' }}
                           onChange={(values) => { setStatusList(values) }}
                           fetchStatuses={{ isLoading: isLoadingStatusList, isError: isErrorStatusList }}
                           title={statusList?.length == 1 ?
                              dataStatusList?.map(item => (
                                 item.value === statusList[0] && item.label as string
                              ))
                                 
                              : !statusList?.length ? 
                              `[ 0 ] ${t('statuses')}` : t('statuses')
                           }
                           data={dataStatusList ? dataStatusList : []}
                           statusList={statusList}
                           clear={dropDownClear}
                           setClear={setDropDownClear}
                        />
                     </div>
                  </Col>
                    <Col grid={{ xxlg: 2, md: 4, xs: 6 }}>
                        <div className={styles.filterInput}>
                            <DropDownFilter
                                dropDownContentStyle={{ right: '0' }}
                                onChange={(values) => { setUsersList(values) }}
                                fetchStatuses={{ isLoading: isLoadingUserList, isError: isErrorUserList }}
                                title={usersList?.length == 1 ?
                                 dataUserList?.map(item => (
                                    item.value === usersList[0] && item.label as string
                                 ))
                                    
                                 : !usersList?.length ? 
                                 `[ 0 ] ${t('users')}` : t('users')
                              }
                                data={dataUserList ? dataUserList : []}
                                usersList={usersList}
                                clear={dropDownClear}
                                setClear={setDropDownClear}
                            />
                        </div>
                    </Col>
               </Row>
               <Row rowGutter={10} colGutter={10}>

                    <Col>
                    <div className={styles.filterSelectWrapper}>
                     <h4>{t('filterRange')}</h4>
                        <div className={`${styles.filterInput} ${styles.filterSelect}`}>
                           <DropDownSelect
                              dropDownContentStyle={{ right: '0' }}
                              onChange={(item) => { setCalculateValue(item.value as string) }}
                              fetchStatuses={{ isLoading: false, isError: false }}
                              title={t('all')}
                              titleSingleLine
                              data={calculates}
                              locale={lang}
                           />
                        </div>
                     </div>
                  </Col>
                    <Col>
                        <div className={styles.minMaxInput}>
                            <Input
                                type='number'
                                placeholder={t('min')}
                                className={styles.maxWidth}
                                value={calculateMin}
                                onChange={e => {
                                    setCalculateMin(e.currentTarget.value)
                                 }}
                                 tabIndex={2}
                            />
                            <span className={styles.dividerElement}>~</span>
                              <Input
                                type='number'
                                placeholder={t('max')}
                                className={styles.maxWidth}
                                value={calculateMax}
                                onChange={e => {
                                    setCalculateMax(e.currentTarget.value)
                                    
                            }}
                            tabIndex={3}
                            />
                        </div>
                    </Col>
                    <Col>
                    <div className={styles.filterSelectWrapper}>
                     <h4>{t('markedFor')}</h4>
                        <div className={`${styles.filterInput} ${styles.filterSelect}`}>
                           <DropDownSelect
                              dropDownContentStyle={{ right: '0' }}
                              onChange={(item) => { setStateMfd(item.value as string) }}
                              fetchStatuses={{ isLoading: false, isError: false }}
                              title={t('all')}
                              titleSingleLine
                              data={calculateMfd}
                              locale={lang}
                           />
                        </div>
                     </div>
                    </Col>

                    
                </Row>
              </div>
                
                :
                <div className={styles.printBody}>
                     <div className={styles.selectionFilter}>
                        <Switch onClick={() => {
                           setSelectionMode(!selectionMode)         
                        }} checked={selectionMode} />
                        <span className={styles.filterTitle}>
                           {t('selectionMode')}
                        </span>
                        {isShowToolTip && 
                        <div>
                           <img src={UpArrow} className={styles.arrowUp}/>
                           <span className={styles.toolTip}>{t('switchPrintMessage')}</span>
                        </div>
                        }
                     </div>
                     <div className={styles.selectionFilter} onClick={() => {
                        if(!selectionMode){
                           setShowToolTip(true)
                        }
                     }}>
                        <Checkbox disabled={!selectionMode} icon={
                            <div className={styles.icon} >
                                <i className='bx bx-checkbox'></i>
                            </div>
                        } checkedIcon={
                            <div>
                                <i className='bx bx-checkbox-checked'></i>
                            </div>
                        } 
                        onClick={(state) => setSelectAll(state)}
                            checked={selectAll}
                            unCheckedIcon={unCheckedIcon}
                            checkedClassName={styles.icon}
                            id='select all'
                        />
                        <label className={styles.filterTitle} htmlFor='select all'>
                            {t('selectAll')}
                        </label>
                    </div>
                    <div className={styles.printBtnGroup} onClick={() => {
                     if(!selectionMode){
                        setShowToolTip(true)
                     }
                    }}>

                       <div  className={`${styles.filterInput} ${styles.filterSelect}`}>
                        <DropDownSelect
                           dropDownContentStyle={{ right: '0' }}
                           onChange={(item) => { setPrintValue(item.label) }}
                           fetchStatuses={{ isLoading: false, isError: false }}
                           value={printData[0]}
                           titleSingleLine
                           data={printData}
                           disable={!selectionMode}
                        />
                       </div>
                        <Button rounded color='theme' style={{width: '8rem', display: 'flex', justifyContent:'center'}} disable={!selectionMode} onClick={() => {
                              if(checkedOrders?.length){
                                 if(printValue==='A4'){
                                    handlePrintA4()
                                 }else {
                                    handlePrintPos80()
                                 }
                              }else {
                                 toast.error(t('atLeastOneOrdMsg'))
                              }
                              }}
                           >
                           {t('print')}
                        </Button>


                    </div>
                    {/* <div className={styles.print} onClick={() => { 
                        if(!selectionMode){
                           setShowToolTip(true)
                        }
                     }}>
                  <Dropdown disabled={!selectionMode} dropDownContentStyle={{ right: '0', width: '100%' }} customToggle={() => {
                     return (
                        <div id='#divId' className={styles.printBtnWrapper}>
                           <span className={styles.printBtnIcon}>
                              <i className='bx bx-printer'></i>
                           </span>
                           <span className={styles.printBtnTxt}>
                              {t('print')}
                           </span>
                        </div>
                     )
                  }}
                     contentData={printData}
                     renderItems={(data, index) => {
                        return (
                           <div
                              key={index}
                              className={styles.printItem}
                              onClick={() => {
                                 if (data.name === 'A4') handlePrintA4();
                                 else handlePrintPos80();
                              }}
                           >
                              {data.name}
                           </div>
                        )
                     }}
                  />
               </div> */}
                     
                </div>
          }
          </div>
      </div>
   )

   return(
      <>
         <div className={styles.menu}>
            <Paper rounded fullWidth>
               {content}
            </Paper >
         </div>
         <div className={styles.burgerMenu}>
            <TopBurgerMenu title={t('filters')} search={searchOrders} filter={filter} setFilter={setFilter} clearFilter={clearFilter}>
               {content}
            </TopBurgerMenu>
         </div>

      </>
   )
}
export default OrdersFilter;