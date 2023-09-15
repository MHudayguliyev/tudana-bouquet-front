import React, { useEffect, useMemo, useRef, useState } from "react";

// custom components
import OrdersFilter from "@app/components/OrdersFilter/OrdersFilter";
import OrderCard from "@app/components/OrderCard/OrderCard";

// custom styles
import styles from "./Orders.module.scss";
import classNames from "classnames/bind";
// own component library
import { Row, Col, Pagination, Preloader } from "@app/compLibrary";
// types redux hooks
import { useAppSelector } from "@app/hooks/redux_hooks";
// for translation
import { useTranslation } from "react-i18next";

// helpers
import { sortArray } from "@utils/helpers";

// queries
import { useQuery } from "react-query";

// custom modals
import OrderDetails from "@app/components/Modals/OrderDetails/OrderDetails";
// request return types
import { Orders, OrdersList } from "@app/api/Types/queryReturnTypes";
// for printing
import { useReactToPrint } from "react-to-print";
import A4PrintPaper from "@app/components/PrintPapers/A4/A4Paper";
import Pos80PrintPaper from "@app/components/PrintPapers/Pos80/Pos80Paper";
// for navigation
import { useNavigate } from "@tanstack/react-location";
import NewOrdersFilter from "@app/components/OrdersFilter/OrdersFilter";

function getWindowDimension() {
  const { innerWidth: width } = window
  return width
}

function useWindowDimension() {
  const [windowDimension, setWindowDimension] = useState<number | any>(getWindowDimension())


  useEffect(() => {
    function handleWidth() {
      setWindowDimension(getWindowDimension())
    }

    window.addEventListener('resize', handleWidth)
    return () => window.removeEventListener('resize', handleWidth)
  }, [])

  return windowDimension
}

type OrdersProps = {};

const OrdersPage = (props: OrdersProps) => {
  const {} = props;

  // for navigation
  const navigation = useNavigate();

  // queries
  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    isRefetching: isOrdersRefetching,
    isRefetchError: isOrdersRefetchingError,
    refetch: ordersRefetch,
  } = useQuery<OrdersList>("orders", { refetchOnWindowFocus: false });
  // for translation
  const { t } = useTranslation();

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectAll, setSelectAll] = useState<boolean>(false)
  const [checkOrder, setCheckOrder] = useState<Orders[] | undefined>([]);
  const [unCheckedIcon, setUncheckedIcon] = useState<boolean>(false)

  /// grid states 
  const [view, setView] = useState<string>('3x')
  const width = useWindowDimension()

  useEffect(() => {
    if(width < 1700 && view==='4x' || width>=1700 && view==='2x'){
      setView('3x')
    }
  }, [width])



  useEffect(() => {
    if (
      !isLoadingOrders &&
      !isErrorOrders &&
      !isOrdersRefetching &&
      !isOrdersRefetchingError
    )
      setCheckOrder(ordersData?.orders);
  }, [
    isLoadingOrders,
    isErrorOrders,
    isOrdersRefetching,
    isOrdersRefetchingError,
  ]);



  const [limit, setLimit] = useState(32);
  const [page, setPage] = useState(1);
  useEffect(() => {
    ordersRefetch();
  }, [limit, page]);
  // for modals
  // states for order Data for orderDetails modal
  const [detailsModalShow, setDetailsModalShow] = useState(false);

  const isFixedOrderFilter = useAppSelector(
    (state) => state.themeReducer.isFixedOrderFilter
  );
  const [orderGuid, setOrderGuid] = useState("");
  const [orderCode, setOrderCode] = useState("");

  /// searchorder value state
  const [searchValue, setSearchValue] = useState<string>('')

////// select deselect function 
  function selectDeselectAll<T extends Orders[] | undefined>(
    checkedOrder: T,
    state: boolean
  ) {
    
    if(!state){
      const filter: Orders[] | undefined = checkedOrder?.filter(item => !item.isselected)
      if(filter?.length){
        setUncheckedIcon(true)
        return checkedOrder?.map(item => item)
      }else {
        setUncheckedIcon(false) 
      }
    }
  
    if (checkedOrder)
      return checkedOrder.map((item) => {
        return {
          ...item,
          isselected: state,
        };
      });
  }


  const onOrderDetailClick = (id: string, orderCode: string) => {
    setOrderGuid(id);
    setOrderCode(orderCode);
    setDetailsModalShow(true);
  };

  const onOrderEditClick = (id: string) => {
    navigation({ to: `make-order/${id}` });
  };

  const A4Print = useRef(null);
  const handlePrintA4 = useReactToPrint({
    content: () => A4Print.current,
  });
  const Pos80Print = useRef(null);
  const handlePrintPos80 = useReactToPrint({
    content: () => Pos80Print.current,
  });

  const checkedOrders = useMemo(() => {
    return checkOrder?.filter((item) => item.isselected);
  }, [checkOrder]);


  const searchOrders = (e: any) => {
    setSearchValue(e.target.value)
  }



    /// sort states 
    const [sortDirection, setSortDirection] = useState<string>('ASC')
    const [sortColumn, setSortColumn] = useState<string>('ord_code')
    useEffect(() => {
      if(checkOrder){
        setCheckOrder(sortArray(checkOrder, sortColumn, sortDirection))
      }
    }, [sortDirection, sortColumn, !!checkOrder])


    /// note: this is for checkAll to automatically be activated 
    useEffect(() => { 
      if(!selectAll && checkOrder?.length !== 0){
        if(checkOrder?.length === checkedOrders?.length){
          setSelectAll(true)
        }
      }
    }, [checkedOrders])


  return (
    <>
      <A4PrintPaper
        ref={A4Print}
        checkedOrders={checkedOrders ? checkedOrders : []}
      />
      <Pos80PrintPaper
        ref={Pos80Print}
        checkedOrders={checkedOrders ? checkedOrders : []}
      />
      <OrderDetails
        show={detailsModalShow}
        setShow={setDetailsModalShow}
        orderGuid={orderGuid}
        orderCode={orderCode}
        tranlate={t}
      />

      <div className={isFixedOrderFilter ? styles.orderListFixed: styles.orderList} >

        <NewOrdersFilter
          onCancel={(state) => setCheckOrder(checkOrder?.map(item =>  item && {...item, isselected:state}))}
          unCheckedIcon={unCheckedIcon}
          selectionMode={selectionMode}
          setSelectionMode={setSelectionMode}
          onSelectAll={() => setCheckOrder(selectDeselectAll(checkOrder, true))}
          onDeselectAll={() => {
            setCheckOrder(selectDeselectAll(checkOrder, false));
          }}
          view={view}                 
          selectAll={selectAll}
          setView={setView}
          setSelectAll={setSelectAll}
          limit={limit}
          page={page}
          handlePrintA4={handlePrintA4}
          handlePrintPos80={handlePrintPos80}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          searchOrders={searchOrders}
          sortDirection={sortDirection}
          sortColumn={sortColumn}    
          setDirection={setSortDirection}
          setColumn={setSortColumn}
          checkedOrders={checkedOrders}
          />
        <div className={isFixedOrderFilter ? styles.ordersFix : styles.ordersNotFix}>
          <Row colGutter={10} rowGutter={10}>
            {isErrorOrders || isOrdersRefetchingError ? (
              <div className={styles.noData}>
                <i className="bx bx-archive"></i>
                <div>{t("noData")}</div>
              </div>
            ) : !isLoadingOrders && !isOrdersRefetching && checkOrder ? (
              checkOrder.map((item, index) => {
                return (
                  <Col
                    grid={{ xxlg: view==='4x'? 3 : view==='3x'? 4 : view==='2x' ? 6 : 4,  xlg: view=='4x' ? 12 : view==='3x'? 4 : 6, lg: 6, span: 6, sm: 12 }}
                    key={index}
                  >
                    <OrderCard
                      isSelectionMode={selectionMode}
                      checked={item.isselected}
                      client={item.partner_name}
                      user={item.user_name}
                      comment={item.order_desc}
                      delivDate={item.order_delivery_dt}
                      guid={item.order_guid}
                      nettotal={item.order_nettotal}
                      orderCode={item.order_code}
                      orderDate={item.order_valid_dt}
                      status={item.status_name}
                      status_code={item.status_code}
                      stock={item.wh_name}
                      totalAmount={item.mat_unit_amount}
                      phone={item.partner_telephone}
                      address={item.partner_address}
                      eda={item.edit_ord_allowed}
                      view={view}
                      onClickDetail={onOrderDetailClick}
                      onClickEdit={onOrderEditClick}
                      onCheck={() => {
                        setCheckOrder([
                          ...checkOrder.slice(0, index),
                          {
                            ...checkOrder[index],
                            isselected: !checkOrder[index].isselected,
                          },
                          ...checkOrder.slice(index + 1),
                        ]);

                        if(selectAll){
                          setSelectAll(false)
                        }

                        // console.log('checkedorders',checkedOrders)
                      }}
                    />
                  </Col>
                );
              })
            ) : (
              <div className={styles.noData}>
                <Preloader />
              </div>
            )}
          </Row>
        </div>
        
      </div>
      <div className={styles.ordersFooter}>
        <div className={styles.ordersStatistic}>
          {selectionMode ? (
            <div className={styles.statisticSelectionMode}>
              <span className={styles.footerStatistic}>
                <span className={styles.footerStatisticIconBlue}>
                  <i className="bx bxl-tumblr"></i>
                </span>
                <span className={styles.footerStatisticInfo}>
                  {checkedOrders?.length}
                </span>
              </span>
              <span className={styles.footerStatistic}>
                <span className={styles.footerStatisticIconBlue}>
                  <i className="bx bx-package"></i>
                </span>
                <span className={styles.footerStatisticInfo}>
                  {checkedOrders?.reduce((prev, value) => {
                    return prev + parseInt(value.mat_unit_amount);
                  }, 0)}
                </span>
              </span>
              <span className={styles.footerStatistic}>
                <span className={styles.footerStatisticIconBlue}>
                  <i className="bx bx-dollar-circle"></i>
                </span>
                <span className={styles.footerStatisticInfo}>
                  {checkedOrders
                    ?.reduce((prev, value) => {
                      return prev + parseFloat(value.order_nettotal);
                    }, 0)
                    .toFixed(2)}
                </span>
              </span>
            </div>
          ) : (
            <div className={styles.statistic}>
              <span className={styles.footerStatistic}>
                <span className={styles.footerStatisticIcon}>
                  <i className="bx bxl-tumblr"></i>
                </span>
                <span className={styles.footerStatisticInfo}>
                  {ordersData?.ordersCount}
                </span>
              </span>
              <span className={styles.footerStatistic}>
                <span className={styles.footerStatisticIcon}>
                  <i className="bx bx-package"></i>
                </span>
                <span className={styles.footerStatisticInfo}>
                  {ordersData?.ordersTotalAmount}
                </span>
              </span>
              <span className={styles.footerStatistic}>
                <span className={styles.footerStatisticIcon}>
                  <i className="bx bx-money"></i>
                </span>
                <span className={styles.footerStatisticInfo}>
                  {ordersData?.ordersTotalNettotal.toFixed(2)}
                </span>
              </span>
            </div>
          )}
        </div>
        <div className={styles.ordersPagination}>
          <div className={styles.ordersPaginationLimit}>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.currentTarget.value));
                setPage(1);
              }}
            >
              <option value={32}>32</option>
              <option value={64}>64</option>
              <option value={128}>128</option>
              <option value={256}>256</option>
              <option value={512}>512</option>
              <option value={1024}>1024</option>
            </select>
          </div>
          <Pagination
            page={page}
            portionSize={3}
            count={
              ordersData?.totalRowCount
                ? Math.ceil(ordersData.totalRowCount / limit)
                : 0
            }
            onChange={(page) => setPage(page)}
            size="small"
          />
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
