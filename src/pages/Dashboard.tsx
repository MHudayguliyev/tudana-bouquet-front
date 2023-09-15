import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-location'
import { useQuery } from 'react-query';

// for apexcarts
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
///preloader
import {Preloader} from '@app/compLibrary';

// own component library
import { Row, Col, StatusCard, Paper, Table, SizedBox } from '@app/compLibrary';

// typed redux hook
import { useAppSelector, useAppDispatch } from '@app/hooks/redux_hooks';
import DashboardActions from '@app/redux/actions/DashboardAction'

// Translation
import { useTranslation } from 'react-i18next';

// Getters
import { getDashboardGeneral, getDashboardStatistcs, getTopCustomers, getLatestOrders, getCalendarData, getStatusList } from '@app/api/Queries/Getters';
import {BsArrowLeftShort, BsArrowRightShort} from 'react-icons/bs'

import moment from 'moment';
import styles from './Dashboard.module.scss'

import socketIOclient from 'socket.io-client'
import authToken from '../api/service/auth_token'
import classNames from "classnames/bind";
import CalendarComponent from '@app/components/Calendar/Calendar';
import { convertToValidDatePostgresqlTimestamp, getDate } from '@utils/helpers';


const cx = classNames.bind(styles)

const renderCusomerHead = (item: any, index: number) => (
   <th key={index}>{item}</th>
);

const renderCusomerBody = (item: any, index: number) => (
   <tr key={index}>
      <td>{item.partner_name}</td>
      <td>{item.mat_unit_amount}</td>
      <td>{item.order_nettotal?.replaceAll('.', ',')}</td>
      {/* <td> {new Intl.NumberFormat('en-US', {maximumFractionDigits: 3}).format(item.ord_nettotal).replaceAll(',', '.')}</td> */}
   </tr>
);


const renderOrderHead = (item: any, index: number) => (
   <th key={index}>{item}</th>
);

const renderOrderBody = (item: any, index: number) => (
   <tr key={index}>
      <td>{item.partner_name}</td>
      <td>{item.order_code}</td>
      <td>{convertToValidDatePostgresqlTimestamp(item.order_valid_dt)}</td>
      <td>{item.order_nettotal?.replaceAll('.', ',')}</td>
      <td>
         <p
            className={
               cx({
                  tdStatus: true,
                  [`tdStatus${item?.status_code}`]: true
               })
            }
         >
            {item.status_name}
         </p>
      </td>
   </tr>
);
type DashboardProps = {}
const Dashboard = (props: DashboardProps): JSX.Element => {  

   /// redux states
   const themeReducer = useAppSelector((state) => state.themeReducer.mode);
   const generalDashboardData = useAppSelector((state: any) => state.dashboardReducer.generalDashboardData)
   const dashboardStatistics = useAppSelector((state: any) => state.dashboardReducer.dashboardStatistics)
   const topCustomersData = useAppSelector((state: any) => state.dashboardReducer.topCustomers)
   const latestOrdersData = useAppSelector((state: any) => state.dashboardReducer.latestOrders)
   const loading = useAppSelector((state: any) => state.dashboardReducer.dashboardLoading)
   const statusId = useAppSelector((state: any) => state.dashboardReducer.statusId)

   // const {startDate, endDate} = getDate()
   const [start, setstart] = useState<any>()
   const [end, setend] = useState<any>()
   const [minDate, setMinDate] = useState<string>(moment(start).format("YYYY-MM-DD"))
   const [maxDate, setMaxDate] = useState<string>(moment(end).add(1, 'day').format("YYYY-MM-DD"))


   useEffect(() => {
      const {startDate, endDate} = getDate()
      setstart(startDate)
      setend(endDate)
   }, [])

   useEffect(() => {
      setMinDate(moment(start).format("YYYY-MM-DD"))
      setMaxDate(moment(end).add(1, 'day').format("YYYY-MM-DD"))
   }, [start, end])


   ///querries
   const {
      data,
      refetch
   } = useQuery(['getCalendarData', minDate, maxDate, statusId], () => getCalendarData(minDate, maxDate, statusId), {
      refetchOnWindowFocus: false
   })



   const {
      data: statusList,
      isLoading,
      isError
   } = useQuery('statusList', () => getStatusList(), {
      refetchOnWindowFocus: false
   })

   const {
      data: chartData,
      refetch: refetchChartData
   } = useQuery('getChartData', () => getDashboardStatistcs(statusId), {
      refetchOnWindowFocus: false
   })

   useEffect(() => {
      refetch()
   }, [minDate, maxDate, statusId])

   useEffect(() => {
      refetchChartData()
   }, [statusId])

   useEffect(() => {
      if(chartData)
         dispatch(DashboardActions.setDashboardStatistics(chartData))
   }, [chartData])


   const { t } = useTranslation()
   const dispatch = useAppDispatch()
   const SOCKET_ENDPOINT = import.meta.env.VITE_API_SOCKET_SERVER_LOCAL
   const token = authToken()

   useEffect(() => {

      const getData = async () => {
         const response = await getDashboardGeneral()
         dispatch(DashboardActions.setGeneralDashboardData(response))

         const dashboardStatsResponse = await getDashboardStatistcs()
         dispatch(DashboardActions.setDashboardStatistics(dashboardStatsResponse))

         const topCustomersResponse = await getTopCustomers()
         dispatch(DashboardActions.setTopCustomers(topCustomersResponse))

         const latestOrdersResponse = await getLatestOrders()
         dispatch(DashboardActions.setLatestOrders(latestOrdersResponse))
      }
      getData()


      if (token) {
         const socket = socketIOclient(SOCKET_ENDPOINT, {
            auth: { token },
            transports: ['websocket']
         })

         socket.on('connect_error', (err) => {
            if (err) {
               console.log('Socket.io connection error from client ', err)
            }
         })

         socket.on('updated_order_data', received_data => {
            dispatch(DashboardActions.setGeneralDashboardData(received_data))
         })

         socket.on('fresh_dashboard_data', received_data => {
            dispatch(DashboardActions.setDashboardStatistics(received_data))

         })

         socket.on('fresh_top_customers_data', received_data => {
            dispatch(DashboardActions.setTopCustomers(received_data))
         })

         socket.on('fresh_latest_orders_data', received_data => {
            dispatch(DashboardActions.setLatestOrders(received_data))
         })
      }
   }, [])


   const statusCardData = [
      {
         "icon": "bx bx-user",
         "count": generalDashboardData?.partners_count,
         "title": t('d_total_clients')
      },
      {
         "icon": "bx bx-receipt",
         "count": generalDashboardData?.total_orders,
         "title": t('d_total_orders')
      },
      {
         "icon": "bx bx-shopping-bag",
         "count": generalDashboardData?.total_sales,
         "title": t('d_orders_total_amount')
      },
      {
         "icon": "bx bx-money",
         "count": new Intl.NumberFormat('en-US', {maximumFractionDigits: 3}).format(generalDashboardData?.total_income),
         "title": t('d_orders_nettotal')
      },

   ]
   const chartOptions: { series: any /* Array<{ name: string, data: Array<number> }>*/, options: ApexOptions } = {
      series: [
         {
            name: t('d_orders'),
            data: dashboardStatistics
         },
      ],
      options: {
         colors: ["#6ab04c", "#2980b9"],
         chart: {
            background: "transparent",
         },
         dataLabels: {
            enabled: false,
         },
         stroke: {
            curve: "smooth",
         },
         xaxis: {
            categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
         },
         legend: {
            position: "top",
         },
         grid: {
            show: false,
         },
         title: {
            text: t('ordersChart')
         }
      },
   };

   let w = window.innerWidth;
   let h = window.innerHeight;
                        

   return (
      <div>
         {loading ? <span className={styles.preloader}><Preloader /></span>: 
         <>
            <Row rowGutter={10} colGutter={15}>
               <Col grid={{ xxlg: 6, xlg: 6, lg: 12, sm: 12}}>
                  <Row rowGutter={10} colGutter={5}>
                     {
                        statusCardData && statusCardData.map((item, index) => {
                           return (
                              <Col  grid={{ xxlg: 6, xlg: 6, lg: 6, xs: 12,  sm: 12,}} key={index} style={{marginBottom: '15px'}}>
                                 <StatusCard
                                    icon={item?.icon}
                                    count={item?.count}
                                    title={item?.title}
                                 />
                              </Col>
                           )
                        })
                     }
                     </Row>
                  <div>
                     <Paper rounded fullHeight>
                        <div className={styles.chartHeight}>
                           <Chart
                                 options={
                                    themeReducer === "theme-mode-dark" ?
                                       {
                                          ...chartOptions.options,
                                          theme: { mode: "dark" }
                                       } :
                                       {
                                          ...chartOptions.options,
                                          theme: { mode: "light" },
                                       }
                                 }
                                 series={chartOptions.series}
                                 type="line"
                                 height="100%"
                              />
                        </div>
                     </Paper>
                  </div>
               </Col>
               <Col grid={{ xxlg: 6, xlg: 6, lg: 12, sm:12, xs: 12, span: 2}}>
                     <CalendarComponent 
                        data={data ? data : []} 
                        statusList={statusList} 
                        fetchStatuses={{isLoading: isLoading, isError: isError}} 
                        onChange={(start, end) => {
                        setstart(start)
                        setend(end)
                        }}
                        iconGroup={{
                           leftArrow: <BsArrowLeftShort />,
                           rightArrow: <BsArrowRightShort />
                        }}
                     />
               </Col>
            </Row>
            <Row rowGutter={10} colGutter={15}>
               <Col grid={{ xxlg: 6, xlg: 5,sm: 12, xs: 12 }}>
                  <Paper rounded fullHeight fullWidth style={{ padding: '30px', textAlign: 'center' }}>
                     <h3>{t('d_top_customers')}</h3>
                     <SizedBox height={15} />
                     <div className={styles.tableHeight}>
                        <Table
                           headData={[
                              t('d_client'), 
                              t('d_total_orders'), 
                              t('d_total_spending')
                           ]}
                           renderHead={(item: any, index: number) =>
                              renderCusomerHead(item, index)
                           }
                           bodyData={topCustomersData}
                           renderBody={(item: any, index: number) =>
                              renderCusomerBody(item, index)
                           }
                           />
                        </div>
                     <SizedBox height={15} />
                     <Link to="/contacts">{t('d_view_all_clients')}</Link>
                  </Paper>
            </Col>
            <Col grid={{ xxlg: 6, xlg: 7, sm:12, xs: 12 }}>
               <Paper rounded fullHeight fullWidth style={{ padding: '30px', textAlign: 'center' }}>
                  <h3>{t('d_latest_orders')}</h3>
                  <SizedBox height={15} />
                     <div className={styles.tableHeight}>
                        <Table
                           headData={[
                              t('d_client'), 
                              t('d_order_code'),
                              t('d_date'),
                              t('d_total_price'),
                              t('d_status')
                           ]}
                           renderHead={(item: any, index: number) =>
                              renderOrderHead(item, index)
                           }
                           bodyData={latestOrdersData}
                           renderBody={(item: any, index: number) =>
                              renderOrderBody(item, index)
                           }
                        />
                     </div>
                  <SizedBox height={15} />
                  <Link to="/orders">{t('d_view_all')}</Link>
               </Paper>
            </Col>
            </Row>
  
</>
         }
      </div>
   )
}



export default Dashboard;