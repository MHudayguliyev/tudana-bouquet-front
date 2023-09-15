import React, { ChangeEvent, useEffect, useState, useRef } from "react";

// custom styles
import styles from "./MakeOrder.module.scss";
import classNames from "classnames/bind";

// own component library
import {
  Button,
  Col,
  Input,
  Paper,
  Preloader,
  Row,
  SizedBox,
  Table,
  TextArea,
} from "@app/compLibrary";
// for translation
import { useTranslation } from "react-i18next";
// for queries
import { useQuery } from "react-query";
import {
  getClientList,
  getStatusList,
  getWarehouseList,
  getOrderCode,
  getOrderData,
  getClientsFull
} from "@app/api/Queries/Getters";
import { confirmEditedOrder, confirmOrder } from "@app/api/Queries/Post";
// Modals
import NewSelectClient from "@app/components/Modals/SelectClients/NewSelectClient";
import NewAddClient from "@app/components/Modals/AddClient/NewAddClient";
import MaterialDesc from "@app/components/Modals/MaterialDesc/MaterialDesc";
// types
import { ClientsListFull, MaterialList } from "@app/api/Types/queryReturnTypes";
import { useAppDispatch, useAppSelector } from "@app/hooks/redux_hooks";

// action creator
import MaterialActions from "@app/redux/actions/MaterialAction";
// helpers
import {
  convertToValidDateForInputField,
} from "@utils/helpers";
// for notifications
import toast from "react-hot-toast";
import moment from "moment";
// for navigation
import { useMatch, useNavigate } from "@tanstack/react-location";
// for checking isAxios error or not
import AutoComplete from "@app/compLibrary/AutoComplete/AutoComplete";
import DeleteConfirm from "@app/components/Modals/DeleteConfirm/DeleteConfirm";
import TableRow from "@app/components/TableRow/TableRow";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import  { FaThList } from "react-icons/fa"
import TopBurgerMenu from "@app/components/TopBurgerMenu/TopBurgerMenu";
import LineCard from "@app/components/OrderGridCard/LineCard";
import EachLineCard from "@app/components/OrderGridCard/EachLineCard";


const cx = classNames.bind(styles)
type MakeOrderProps = {};


// later will change
function handleSearch<T extends MaterialList[]>(
  event: ChangeEvent<HTMLInputElement>,
  data: T
) {
  const value = event.currentTarget.value?.toLowerCase();
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const fullname = data[i].mtrl_full_name?.toLowerCase();
    const attribut_name = data[i].attribute_name?.toLowerCase()
    const mtrl_desc = data[i].mtrl_desc?.toLowerCase()
    if (fullname.includes(value)) {
      result.push({ ...data[i] });
    } else if (attribut_name.includes(value)){
      result.push({ ...data[i] });
    } else if (mtrl_desc.includes(value)){
      result.push({ ...data[i] });
    }
  }
  return result;
}

const MakeOrder = (props: MakeOrderProps) => {
  // for translation
  const { t } = useTranslation();

  // for navigation
  const match = useMatch();
  const navigation = useNavigate();
  const dateInputRef: any = useRef<null | HTMLElement>(null)


  // queries for editing
  const {
    isError: isErrorOrderData,
    isLoading: isLoadingOrderData,
    data: orderData,
  } = useQuery(
    "orderDataForEditing",
    () => getOrderData(match.params.orderGuid),
    {
      enabled: !!match.params.orderGuid,
      refetchOnWindowFocus: false,
    }
  );

  const dispatch = useAppDispatch();
  const materials: MaterialList[] = useAppSelector(
    (state) => state.materialReducer.materials
  );
  const editMode: boolean = useAppSelector(
    (state) => state.materialReducer.editMode
  );
  const addMaterials: boolean = useAppSelector(
    (state) => state.materialReducer.addMaterials
  );
  const orderGeneratedCode: string = useAppSelector(
    (state) => state.materialReducer.orderGeneratedCode
  );
  const editableOrderGuid: string = useAppSelector(
    (state) => state.materialReducer.editableOrderGuid
  );


  const [materialsSearch, setMaterialsSearch] = useState(materials);

  const [dataForDeleting, setDataForDeleting] = useState<MaterialList>()
  const [mtrlDescData, setMtrlDescData] = useState<MaterialList>()
  const [identityLabel, setIdentityLabel] = useState("");
  const [view, setView] = useState('list')

  // states for modals
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showClientsModal, setShowClientsModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showMdModal, setShowMdModal] = useState<boolean>(false)

  // loading state for order code
  const [loadingOrderCode, setLoadingOrderCode] = useState(false);

  const orderCodeRef: any = useRef()
  orderCodeRef.current = orderGeneratedCode

  // Queries
  const {
    isLoading: isLoadingWarehouseList,
    isError: isErrorWarehouseList,
    data: dataWarehouseList,
  } = useQuery("warehouseList", () => getWarehouseList());
  const {
    isLoading: isLoadingPartnerList,
    isError: isErrorPartnerList,
    data: dataPartnerList,
    refetch: dataPartnerRefetch,
  } = useQuery("client-list", () => getClientList());
  const {
    isLoading: isLoadingStatusList,
    isError: isErrorStatusList,
    data: dataStatusList,
  } = useQuery("statusList", () => getStatusList());
  const { refetch: fullClientListRefetch } = useQuery("fullClientList", () => getClientsFull());
  const filteredStatusList = dataStatusList?.filter(item => item.edit_ord_allowed === true)


  // for refetching when client add modal closed
  useEffect(() => {
    fullClientListRefetch();
  }, [showAddUserModal]);

  // client selecting in clients modal
  const onClickRow = (value: ClientsListFull) => {
    dispatch(
      MaterialActions.setClient({
        label: value.partner_name,
        value: value.partner_guid,
      })
    );
  };

  useEffect(() => {
    setMaterialsSearch(materials);
  }, [materials]);

  // getting order code
  const getGenerateOrderCode = async () => {
    setLoadingOrderCode(true);
    try {
      const res = await getOrderCode();
      dispatch(MaterialActions.setGeneratedOrderCode(res));
    } catch (err) {

    }
    setLoadingOrderCode(false);
  };


  // states for confirmation of order
  const startTime = useAppSelector((state) => state.materialReducer.startTime);
  const endTime = useAppSelector((state) => state.materialReducer.endTime);
  const warehouse = useAppSelector((state) => state.materialReducer.warehouse);
  const client = useAppSelector((state) => state.materialReducer.client);
  const status = useAppSelector((state) => state.materialReducer.status);
  const orderNote = useAppSelector((state) => state.materialReducer.orderNote);
  const isShowModal = useAppSelector(state => state.clientsReducer.show);

  // for clearing after confirm
  const handleClearStatuses = () => {
    dispatch(MaterialActions.setStartTime(moment().format("YYYY-MM-DDTHH:mm")));
    dispatch(
      MaterialActions.setEndTime(
        moment().add(1, "days").format("YYYY-MM-DDTHH:mm")
      )
    );
    dispatch(MaterialActions.setWarehouse({ label: "", value: "" }));
    dispatch(MaterialActions.setClient({ label: "", value: "" }));
    dispatch(MaterialActions.setStatus({ label: "", value: "" }));
    dispatch(MaterialActions.setOrderNote(""));
  };

  useEffect(() => {
    if (match.params.orderGuid) {
      dispatch(MaterialActions.setEditMode(true));
    }
  }, [match.params.orderGuid]);

  const orderProducts: MaterialList[] = orderData?.order_products.map(item => Object.assign(item, { changedPrice: 0, priceType: 'manual' }))!
  // setting all data if there are data of order for editing

  useEffect(() => {
    if (
      !!orderData &&
      !isErrorOrderData &&
      !isLoadingOrderData &&
      editMode &&
      !addMaterials
    ) {
      dispatch(
        MaterialActions.setMaterialData(
          orderProducts,
          orderData.order_code,
          match.params.orderGuid
        )
      );
      dispatch(
        MaterialActions.setStartTime(
          convertToValidDateForInputField(orderData.order_valid_dt)
        )
      );
      dispatch(
        MaterialActions.setEndTime(
          convertToValidDateForInputField(orderData.order_delivery_dt)
        )
      );
      dispatch(
        MaterialActions.setWarehouse({
          label: orderData.wh_name ? orderData.wh_name : '',
          value: orderData.wh_guid ? orderData.wh_guid : '',
        })
      );
      dispatch(
        MaterialActions.setClient({
          label: orderData.partner_name,
          value: orderData.partner_guid,
        })
      );
      dispatch(
        MaterialActions.setStatus({
          label: orderData.status_name,
          value: orderData.status_guid,
        })
      );
      dispatch(MaterialActions.setOrderNote(orderData.order_desc));
    }
  }, [orderData, editMode]);

   async function CheckNull(materials: MaterialList[]): Promise<boolean> {
    let result: boolean  = false;
    for(let item of materials){
      if(item.priceType === 'any' && Number(item.changedPrice) === 0){
        result = true;
      } 
       else if (item.priceType === 'manual' && Number(item.price_value) === 0) {
        result = true;
      }
    }
    return result
   
  }


  const confirmOrderFn = async () => {

    const result:boolean = await CheckNull(materials)
    if (result) {
      toast.error(t('priceTypeZeroErorr'))
      return;
    }

    if (!(materials.length > 0)) {
      toast.error(t("errorNoMaterials"));
      return;
    } else if (
      !(
        !!startTime.length &&
        !!endTime.length &&
        !!(typeof warehouse.value === "string"
          ? warehouse.value.length
          : warehouse.value) &&
        !!(typeof client?.value === "string"
          ? client?.value.length
          : client?.value) &&
        !!(typeof status.value === "string"
          ? status.value.length
          : status.value) 
      )
    ) {
      toast.error(t("errorFillAllRequiredFields"));
      return;
    }

    try {
      if(!orderGeneratedCode){
        getGenerateOrderCode()
      }
      setTimeout(async () => {
        const res = await confirmOrder({
          order_code: orderCodeRef.current,
          order_valid_dt: startTime,
          order_delivery_dt: endTime,
          mat_unit_amount: materials.reduce(
            (acc, value) => acc + value.amount,
            0
          ),
          order_desc: orderNote,
          order_total: materials.reduce((acc, value) => {
            return acc + value.amount * (value.priceType === 'manual' ? +Number(value.price_value).toFixed(2) : +Number(value.changedPrice).toFixed(2));
          }, 0),
          partner_guid: String(client.value),
          status_guid: status.value,
          warehouse_guid: String(warehouse.value),
          orders_line: materials.map((material) => {
  
            return {
              ord_line_amount: material.amount,
              ord_line_disc_amount: 0,
              ord_line_disc_percent: 0,
              ord_line_desc: material.ord_line_desc,
              ord_line_price_nettotal:
                material.priceType === 'manual' ? Number(material.price_value) * Number(material.amount) : Number(material.changedPrice) * Number(material.amount),
              ord_line_price_total: material.priceType === 'manual' ? Number(material.price_value) * Number(material.amount) : Number(material.changedPrice) * Number(material.amount),
              ord_line_price: material.priceType === 'manual' ? Number(material.price_value) : Number(material.changedPrice),
              row_id: material.row_id,
              price_type_guid: material.price_type_guid,
              line_row_id_front: material.line_row_id_front
            };
          }),
        });
  
        if (res === "Successfully added order!") {
          toast.success(t("successfull"), { duration: 1600});
          dispatch(MaterialActions.clear());
          dispatch(MaterialActions.setGeneratedOrderCode(""));
          handleClearStatuses();
          navigation({ to: "/orders", replace: true });
        }
      }, 2000)
    } catch (err: any ) {
        toast.error(err.response?.data?.error);
        console.log('err: ', err)
    }


  };

  const confirmEditedOrderFn = async () => {

    const result = await CheckNull(materials)

    if (result) {
      toast.error(t('priceTypeZeroErorr'))
      return;
    }

    if (!(materials.length > 0)) {
      toast.error(t("errorNoMaterials"));
      return;
    } else if (!orderGeneratedCode) {
      toast.error(t("errorNotSettedOrderCode"));
      return;
    }
    if (
      !(
        !!startTime.length &&
        !!endTime.length &&
        !!(typeof warehouse.value === "string"
          ? warehouse.value.length
          : warehouse.value) &&
        !!(typeof client.value === "string"
          ? client.value.length
          : client.value) &&
        !!(typeof status.value === "string"
          ? status.value.length
          : status.value) &&
        !!orderGeneratedCode.length
      )
    ) {
      toast.error(t("errorFillAllRequiredFields"));
      return;
    }


    try {
      const res = await confirmEditedOrder({
        order_guid: editableOrderGuid,
        order_code: orderGeneratedCode,
        order_valid_dt: startTime,
        order_delivery_dt: endTime,
        mat_unit_amount: materials.reduce(
          (acc, value) => acc + value.amount,
          0
        ),
        order_desc: orderNote,
        order_total: materials.reduce((acc, value) => {
          return acc + value.amount * (value.priceType === 'manual' ? +Number(value.price_value).toFixed(2) : +Number(value.changedPrice || 0).toFixed(2));
        }, 0),
        partner_guid: String(client.value),
        status_guid: String(status.value),
        warehouse_guid: String(warehouse.value),
        orders_line: materials.map((material) => {
          return {
            ord_line_amount: material.amount,
            ord_line_disc_amount: 0,
            ord_line_disc_percent: 0,
            ord_line_desc: material.ord_line_desc,
            ord_line_price_nettotal:
              material.priceType === 'manual' ? Number(material.price_value)  * Number(material.amount) : Number(material.changedPrice) * Number(material.amount),
            ord_line_price_total: material.priceType === 'manual' ? Number(material.price_value) * Number(material.amount) : Number(material.changedPrice || 0) * Number(material.amount),
            ord_line_price: material.priceType === 'manual' ? Number(material.price_value) : Number(material.changedPrice),
            row_id: material.row_id,
            price_type_guid: material.price_type_guid,
            line_row_id_front: material.line_row_id_front
          };
        }),
      });
      if (res === "Successfully edited order!") {
        toast.success(t("successfull"));
        dispatch(MaterialActions.clear());
        dispatch(MaterialActions.setGeneratedOrderCode(""));
        handleClearStatuses();
        navigation({ to: "/orders", replace: true });
      }

    } catch (err: any) {
      console.log('errr: ', err)
      toast.error(err.response?.data?.error);
    }
  };



  const header = (
    <div className={styles.headerRow}>
        {/* <div className={styles.searchWrapper}> */}  

        {/* </div> */}
        <div className={styles.headerRowChild}>
          <div className={styles.searchWrapper}>
            <Input
                style={{ width: "100%" }}
                onChange={(e) =>
                  setMaterialsSearch(handleSearch(e, materials))
                }
                type='search'
                placeholder={t("search")}
                className={styles.searchInp}
              />

          </div>
          {/* <div className={styles.addBtn}> */}
            <Button
                color="theme"
                rounded
                startIcon={<i className="bx bx-plus" />}
                linkProps={{ to: "/add-materials" }}
              >
              {t("addMaterials")}
              </Button>
          {/* </div> */}
          <Button
            disable={materials.length <= 0}
              rounded
              color="theme"
              startIcon={<i className="bx bx-trash" />}
              onClick={() => {
                materials.length > 0 &&  setShowDeleteConfirmModal(true);
                setIdentityLabel("clearAll");
              }}
          >
            {t('del_all')}
          </Button>
        </div>
      <div className={styles.headerView}>
        <Button color={`${view === 'list' ? "theme" : "white"}`} rounded onClick={() => {setView('list'); localStorage.setItem('view', JSON.stringify({material: 'list'})) }}>
          <div className={styles.listIcon}><FaThList />
          </div>
        </Button>
        <Button color={`${view === 'grid' ? "theme" : "white"}`} rounded onClick={() => {setView('grid'); localStorage.setItem('view', JSON.stringify({material: 'grid'})) }}>
            <div className={styles.gridIcon}><BsFillGrid3X3GapFill />
            </div>
        </Button>
      </div>
  </div>


  )
  return (
    <>
      <NewAddClient
        setShow={setShowAddUserModal}
        show={showAddUserModal}
        translate={t}
        onAdd={(value) => {}}
        onSuccess={dataPartnerRefetch}
      />
      <NewSelectClient
        setShow={setShowClientsModal}
        show={showClientsModal}
        translate={t}
        onClickRow={(value) => onClickRow(value)}
      />
      <DeleteConfirm
        show={showDeleteConfirmModal}
        setShow={setShowDeleteConfirmModal}
        translate={t}
        material={dataForDeleting}
        identityLabel={identityLabel}
      />
      <MaterialDesc 
        data={mtrlDescData}
        show={showMdModal}
        setShow={setShowMdModal}
        translate={t}
      />
      <div className={styles.makeOrderLayout}>
        <Row rowGutter={10} colGutter={10} style={{height: '100%'}}>
          <Col grid={{ span: 9, lg: 8, md: 12, sm: 12, xs: 12 }}>
            <div className={styles.makeOrderSection}>
              <Paper rounded>
                <div className={styles.tableHeadWrapper}>
                  {header}
                  <SizedBox height={10} />
                </div>
              </Paper>
              <div className={styles.tabelBurgerMenu}>
                <TopBurgerMenu>
                  <div style={{padding: '20px'}}>
                    {header}
                  </div>
                </TopBurgerMenu>
              </div>
              <Paper rounded>
              <div className={styles.makeOrderWrapper}>
                {
                  view === 'grid' ?
                  <div className={styles.grid}>
                    <LineCard 
                      bodyData={materialsSearch} 
                      renderBody={(data, index) => {
                        return (
                          <EachLineCard 
                            data={data}
                            key={index}
                            materials={materials}
                            setShowModal={setShowDeleteConfirmModal}
                            setIdentityLabel={setIdentityLabel}
                            setDataForDeletion={setDataForDeleting}
                            onClick={(data: any) => {setMtrlDescData(data), setShowMdModal(true)}}
                          />
                        )
                      }}
                    />
                  </div>
                  : 
                  <div className={styles.table} id={styles.table}>
                  <Table
                    bodyData={materialsSearch}
                    headData={[
                      t("image"),
                      t("name"),
                      t("amount"),
                      t("priceType"),
                      t("price"),
                      t("nettotal"),
                      t("actions"),
                    ]}
                    renderHead={(data, index) => {
                      return <th key={index}>{data}</th>;
                    }}
                    renderBody={(data, index) => {
                      return (
                        <TableRow
                          key={index}
                          data={data}
                          materials={materials}
                          setShowModal={setShowDeleteConfirmModal}
                          setDataForDeletion={setDataForDeleting}
                          setIdentityLabel={setIdentityLabel}
                          onClick={(data: any) => {setMtrlDescData(data); setShowMdModal(true)}}
                        />
                      );
                    }}
                  />
                </div>
                }
              </div>
              <div className={styles.orderStatistic}>
                <span>
                  <i className="bx bx-align-left"></i> {materials.length}
                </span>
                <span>
                  <i className="bx bx-package"></i>{" "}
                  {materials.reduce((acc, value) => acc + value.amount, 0)}
                </span>
                <span>
                  <i className="bx bx-money"></i>{" "}
                  {materials.reduce((acc, value:any) => {
                    return acc + value.amount * (value.priceType === 'manual' ? +Number.parseFloat(value.price_value).toFixed(1) : +Number.parseFloat(value.changedPrice).toFixed(1));
                  }, 0)}
                </span>
              </div>
            </Paper> 
            </div>
           
            
          </Col>
          <Col grid={{ span: 3, lg: 4, md: 12, sm: 12, xs: 12 }} style={{paddingLeft: '1.25rem'}}>
            <Paper rounded>
              <div className={styles.makeOrderSideBarWrapper}>
                <div className={styles.container}>
                  <div className={styles.content}>
                    <div className={styles.divider}>
                      <div className={styles.sideBarInput}>
                        <div className={styles.inputIcon} >
                          <i className="bx bx-calendar" title='Order date' onClick={() => dateInputRef.current.focus()}></i>
                        </div>
                        <SizedBox width={10} />
                            <div className={styles.input}>
                            <Input
                              min={startTime}
                              max={"2099-12-31T23:59"}
                              style={{ width: "100%" }}
                              className={styles.calendar}
                              type="datetime-local"
                              title='Order date'
                              ref={dateInputRef}
                              value={startTime}
                              onChange={(e) => {
                                dispatch(
                                  MaterialActions.setStartTime(
                                    e.currentTarget.value
                                  )
                                );
                                if (
                                  moment(endTime).isBefore(
                                    moment(e.currentTarget.value)
                                  )
                                )
                                  dispatch(
                                    MaterialActions.setEndTime(
                                      moment(e.currentTarget.value)
                                        .add(1, "day")
                                        .format("YYYY-MM-DDTHH:mm")
                                    )
                                  );
                              }}
                            />
                            
                          </div>
                      </div>
                      <SizedBox height={15} />
                      <div className={styles.sideBarInput}>
                        <div className={styles.inputIcon}>
                          <i className="bx bx-calendar-check" title='Delivery date'></i>
                        </div>
                        <SizedBox width={10} />
                          <div className={styles.input}>
                            <Input
                              min={startTime}
                              max={"2099-12-31T23:59"}
                              style={{ width: "100%" }}
                              type="datetime-local"
                              value={endTime}
                              title='Delivery date'
                              onChange={(e) => {
                                dispatch(
                                  MaterialActions.setEndTime(
                                    e.currentTarget.value
                                  )
                                );
                                if (
                                  moment(startTime).isAfter(
                                    moment(e.currentTarget.value)
                                  )
                                )
                                  dispatch(
                                    MaterialActions.setStartTime(
                                      moment(e.currentTarget.value)
                                        .subtract(1, "day")
                                        .format("YYYY-MM-DDTHH:mm")
                                    )
                                  );
                              }}
                            />
                          </div>
                      </div>
                      <SizedBox height={15} />
                    </div>
                    <SizedBox height={15} />
                    <div className={styles.divider}>
                      <div className={styles.sideBarInput}>
                        <div className={styles.inputIcon}>
                          <i className="bx bx-store" title='Warehouse'></i>
                        </div>
                        <SizedBox width={10} />
                        <AutoComplete
                          style={{ width: "100%" }}
                          suggestions={dataWarehouseList ? dataWarehouseList : []}
                          onChange={(value) =>
                            dispatch(MaterialActions.setWarehouse(value))
                          }
                          fetchStatuses={{
                            isLoading: isLoadingWarehouseList,
                            isError: isErrorWarehouseList,
                          }}
                          value={{
                            label: warehouse.label
                              ? warehouse.label
                              : dataWarehouseList
                                ? dataWarehouseList[0].label
                                : "",
                            value: warehouse.value
                              ? warehouse.value
                              : dataWarehouseList
                                ? dataWarehouseList[0].value
                                : "",
                          }}
                        />
                      </div>
                      <SizedBox height={10} />
                      <div className={styles.sideBarInput}>
                        <div className={styles.inputIcon}>
                          <i className="bx bxl-stripe" title='Status'></i>
                        </div>
                        <SizedBox width={10} />
                        <AutoComplete
                          style={{ width: "100%" }}
                          suggestions={filteredStatusList ? filteredStatusList : []}
                          onChange={(value) =>
                            dispatch(MaterialActions.setStatus(value))
                          }
                          fetchStatuses={{
                            isLoading: isLoadingStatusList,
                            isError: isErrorStatusList,
                          }}
                          value={{
                            label: status?.label
                              ? status?.label
                              : filteredStatusList
                                ? filteredStatusList[0]?.label
                                : "",
                            value: status?.value
                              ? status?.value
                              : filteredStatusList
                                ? filteredStatusList[0]?.value
                                : "",
                          }}

                        />
                      </div>
                      <SizedBox height={15} />
                    </div>
                    <SizedBox height={15}/>
                    <div className={styles.sideBarInput}>
                      <div className={styles.inputIcon}>
                        <i className="bx bx-user-circle" title='Client'></i>
                      </div>
                      <SizedBox width={10} />
                      <AutoComplete
                        placeholder={t('searchClients')}
                        style={{ width: "100%" }}
                        suggestions={dataPartnerList ? dataPartnerList : []}
                        onChange={(value) =>
                          dispatch(MaterialActions.setClient(value))
                        }
                        fetchStatuses={{
                          isLoading: isLoadingPartnerList,
                          isError: isErrorPartnerList,
                        }}
                        value={{
                          label: client?.label
                            ? client?.label
                              : "",
                          value: client?.value
                            ? client?.value
                              :"",
                        }}
                        
                      />
                    </div>
                    <SizedBox height={15} />
                    <div className={styles.divider}>
                      <div className={styles.addViewClientBtns}>
                        <Button
                          color="theme"
                          rounded
                          center
                          fullWidth
                          onClick={() => setShowClientsModal(true)}
                        >
                          {t("clients")}
                        </Button>
                        <SizedBox width={10} />
                        <Button
                          color="theme"
                          isIconContent
                          circle
                          onClick={() => setShowAddUserModal(true)}
                        >
                          <div style={{ fontSize: "1.5rem" }}>
                            <i className="bx bx-user-plus"></i>
                          </div>
                        </Button>
                      </div>
                      <SizedBox height={15} />
                    </div>
                    <SizedBox height={25} />
                    <TextArea
                      placeholder={t("note")}
                      rows={3}
                      maxLength={250}
                      value={orderNote}
                      onChange={(e) =>{
                        e.preventDefault();
                        dispatch(
                          MaterialActions.setOrderNote(e.currentTarget.value)
                        )
                      }

                        
                      }
                    />
                    <SizedBox height={15} />
                    {!loadingOrderCode ? (
                      orderGeneratedCode ? (
                        <span style={{ fontWeight: "bold", lineHeight: "24px" }}>
                          {t("orderCode")}: {orderGeneratedCode}
                        </span>
                      ) : null
                    ) : (
                      <Preloader />
                    )}
                    {!orderGeneratedCode ? (
                      // <>
                      //   <Button
                      //     rounded
                      //     color="theme"
                      //     onClick={() => getGenerateOrderCode()}
                      //     startIcon={<i className="bx bx-barcode-reader"></i>}
                      //   >
                      //     {t("generateCode")}
                      //   </Button>
                      // </>
                      null
                    ) : null}
                  <div>                  
                  </div>
                  </div>
                  <SizedBox height={25} />
                    <Button
                      color="theme"
                      rounded
                      fullWidth
                      center
                      onClick={() => {
                        editMode ? confirmEditedOrderFn() : confirmOrderFn();
                      }}
                    >
                      {editMode ? t("edit") : t("confirm")}
                    </Button>
                </div>
              </div>
            </Paper>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default MakeOrder;
