import React, { useEffect, useState } from "react";

// custom styles
import styles from "./TopNavbar.module.scss";
import classNames from "classnames/bind";
import {HiOutlineMenu} from "react-icons/hi"
import {GrClose} from "react-icons/gr"

import { Link, useMatch, useNavigate } from "@tanstack/react-location";
import { useQuery } from "react-query";

import user_image from "../../assets/images/tuat.png";

// fake data for demonstration
import user_menu from "@app/assets/JsonData/user_menus.json";
import languages from "@app/assets/JsonData/language";
// own component library
import { Button, Dropdown, Preloader, SizedBox } from "@app/compLibrary";
import ThemeMenu from "@components/ThemeMenu/ThemeMenu";
// typed redux hooks
// import { useAppDispatch, useAppSelector } from "@app/hooks/redux_hooks";
// action creators
// import ThemeAction from "@redux/actions/ThemeAction";
// dropdown component
import { SelectLanuageMenu, UserToggle } from "./LanguageDropdown/LanguageDropdown";
// for translation
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@app/hooks/redux_hooks";


import DeleteConfirm from "../Modals/DeleteConfirm/DeleteConfirm";

// Action creators
import MaterialActions from '@app/redux/actions/MaterialAction';
import DashboardActions from '@app/redux/actions/DashboardAction';
import ClientsAction from '@app/redux/actions/ClientsAction';
///getters
import { getDashboardGeneral, getDashboardStatistcs, getTopCustomers, getLatestOrders, getCalendarData } from '@app/api/Queries/Getters';


import { MaterialList } from "@app/api/Types/queryReturnTypes"
import ThemeAction from "@app/redux/actions/ThemeAction";
import moment from "moment";
import { getDate } from "@utils/helpers";

// type TopNavbarProps = {
//   setSidebar: Function
// }
const logout = () => {
  localStorage.removeItem('accessTokenCreatedTime');
  localStorage.removeItem('authUser');
  window.location.reload();
}

const renderNotificationItem = (item: any, index: any) => (
  <div className={styles.notification_item} key={index}>
    <i className={item.icon}></i>
    <span>{item.content}</span>
  </div>
);

const renderUserToggle = () => {
  let userName;
  try {
    const authUser = localStorage.getItem('authUser') || '';
    userName = JSON.parse(authUser);
  } catch (err) {
    userName = { user_name: 'Who are you?' }
  }
  return (
    <div className={styles.topnav__right_user}>
      <div className={styles.topnav__right_user__image}>
        <img src={user_image} alt="" />
      </div>
      <div className={styles.topnav__right_user__name}>{userName.user_name}</div>
    </div>
  )
};

const renderUserMenu = (item: any, index: number) => (
  <Link to={item.href} key={index} onClick={item.href === "#" ? () => logout() : undefined}>
    <div className={styles.notification_item}>
      <i className={item.icon}></i>
      <span>{item.content}</span>
    </div>
  </Link>
);

const cx = classNames.bind(styles);

type TopNavbarProps = {
  setShowModal?: Function | any
  showModal?: boolean;
}
const TopNavbar = (props: TopNavbarProps) => {
  const {
    setShowModal,
    showModal
  } = props

  const isOpenSideBar = useAppSelector(state => state.themeReducer.isOpenSidebar);
  const dashboardLoading = useAppSelector(state => state.dashboardReducer.dashboardLoading)

  const toggleSidebar = () => {
    dispatch(ThemeAction.toggleSidebar(!isOpenSideBar))
  }

  const dispatch = useAppDispatch()
  const [confirmPage, setConfirmPage] = useState<boolean>(false)
  const [reloadActivated, setReloadActivated] = useState<boolean>(false)
  const [minDate, setMinDate] = useState<string>(moment().format("YYYY-MM-DD"))
  const [maxDate, setMaxDate] = useState<string>(moment().add(1, 'day').format("YYYY-MM-DD"))

  // for translation
  const { t } = useTranslation()
  // for navigation
  const match = useMatch();
  const navigate = useNavigate();


  /// queries 
  const {refetch} = useQuery(['getCalendarData', minDate, maxDate], () => getCalendarData(minDate, maxDate), {
    refetchOnWindowFocus: false
  })


  const RefreshDashboard = () => {
    dispatch(DashboardActions.setDashboardLoading(true))
    setTimeout(async () => {
      const response = await getDashboardGeneral()
      dispatch(DashboardActions.setGeneralDashboardData(response))
  
      const statsResponse = await getDashboardStatistcs()
      dispatch(DashboardActions.setDashboardStatistics(statsResponse))
  
      const latestOrdersResponse = await getLatestOrders()
      dispatch(DashboardActions.setLatestOrders(latestOrdersResponse))
  
      const topCustomerResponse = await getTopCustomers()
      dispatch(DashboardActions.setTopCustomers(topCustomerResponse))

      dispatch(DashboardActions.setStatusId(''))
      dispatch(DashboardActions.setDashboardLoading(false))
    }, 300)
  }

  const SetShowModal = () => {
    dispatch(ClientsAction.setModal(true))
  }


  useEffect(() => {
      if(dashboardLoading){
        const {startDate, endDate} = getDate()
        setMinDate(moment(startDate).format("YYYY-MM-DD"))
        setMaxDate(moment(endDate).add(1, 'day').format("YYYY-MM-DD"))
        refetch()
      }
  }, [dashboardLoading])

  // for detecting editMode = false | true
  useEffect(() => {
    if (!(match.pathname === '/orders/make-order/' ||
      match.pathname === '/add-materials' ||
      (match.pathname === '/orders/make-order' || !!match.params.orderGuid)
    )) {
      dispatch(MaterialActions.closeEditMode())
    }
  }, [match.pathname])




  const materials: MaterialList[] = useAppSelector(
    (state) => state.materialReducer.materials
  );


  return (
    <>
      <DeleteConfirm
        show={confirmPage}
        setShow={setConfirmPage}
        identityLabel='fromTopNavbar'
        translate={t}
      />
      <div className={styles.topnav}>
        <div className={styles.menuIcon} onClick={() => toggleSidebar()}>
          {isOpenSideBar? <GrClose size={24}/> : <HiOutlineMenu size={24}/> }
        </div>
        <div>
          
          {/* // !isOpenSideBar && */}

          <div style={{ marginRight: '10px' }} className={styles.sideBar}>

            {
              match.pathname === '/contacts' ? 
              <Button color="theme" startIcon={<i className='bx bx-user-plus' style={{fontSize: 22}}></i>} rounded onClick={() => SetShowModal()}>
                {t('addClient')}
              </Button>
              :

              match.pathname === '/' ? 
                  <Button color="theme" startIcon={<i className='bx bx-refresh' style={{fontSize: 22}}></i>} rounded onClick={RefreshDashboard}>
                    {t('refetchDashboard')}
                  </Button>
                : 
              !(match.pathname === '/orders/make-order/' ||
                match.pathname === '/add-materials' ||
                match.pathname === '/products' ||
                (match.pathname === '/orders/make-order' || !!match.params.orderGuid)
              ) ?
                <Button rounded color="theme"
                  linkProps={{ to: '/orders/make-order' }}
                  // onClick={() => toggleSidebar()}
                  startIcon={<i className='bx bx-package' ></i>}
                >
                  {t('makeOrder')}
                </Button>
                :
                
                match.pathname === '/add-materials'
                  ?
                  <Button color="theme" startIcon={<i className='bx bx-left-arrow-alt' ></i>} rounded onClick={() => navigate({ to: '/orders/make-order' })}
                  >
                    {t('back_to_basket')}
                  </Button>
                  :
                  null
            }
            {
              match.pathname === '/orders/make-order/' || match.params.orderGuid
                ?
                <Button
                  color="theme"
                  startIcon={<i className='bx bx-left-arrow-alt' ></i>}
                  rounded
                  onClick={() => {
                    if (materials?.length !== 0) {
                      setConfirmPage(true)
                    } else {
                      navigate({ to: '/orders' }) 
                    }
                  }}
                >
                  {t('back_to_orders')} 
                </Button>
                :
                null
            }
          </div>
        </div>
        
        <div className={styles.topnav__right}>
          <div className={styles.topnav__right_item}>
            {/* User dropdown */}
            <Dropdown
              customToggle={() => renderUserToggle()}
              contentData={user_menu}
              renderItems={(item, index) =>
                renderUserMenu(item, index)
              }
            />
          </div>
          <div className={styles.topnav__right_item}>
            {/* Select language dropdown */}
            <Dropdown
              customToggle={() =>
                <UserToggle data={languages} />
              }
              contentData={languages}
              renderItems={(item, index) =>
                <SelectLanuageMenu {...item} key={index} />
              }
            />
          </div>

          {/* Will be in the future */}
          {/* <div className={styles.topnav__right_item}>
          Notification dropdown
          <Dropdown
            icon="bx bx-bell"
            badge="12"
            contentData={notifications}
            renderItems={(item, index) =>
              renderNotificationItem(item, index)
            }
            renderFooter={() => <Link to="/">View All</Link>}
          />
        </div> */}
          <div className={styles.topnav__right_item}>
            <ThemeMenu />
          </div>
        </div>
      </div>
    </>
  );
};

export default TopNavbar;
