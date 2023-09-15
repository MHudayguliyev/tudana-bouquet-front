import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@app/hooks/redux_hooks';
import styles from './ClientsPage.module.scss';
import { useQuery } from 'react-query';
import { GetClients } from '@app/api/Queries/Getters';
import { Col, Pagination, Preloader, Row } from '@app/compLibrary';
import { useTranslation } from 'react-i18next';
import CardGrid from '@app/components/ClientCard/ClientGridCard';
import { useAppSelector } from '@app/hooks/redux_hooks';
import ClientsFilter from '@app/components/ClientsFilter/ClientsFilter';
import CardList from '@app/components/ClientCard/ClientListCard';
import { sortArray } from '@utils/helpers';
import ClientsForClientsPage from '@app/api/Types/queryReturnTypes/ClientsForClientsPage';
import ClientsAction from "@app/redux/actions/ClientsAction";
import NewAddClient from '@app/components/Modals/AddClient/NewAddClient';




const ClientsPage = () => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const [sortDirection, setSortDirection] = useState<string>('ASC')
    const [sortColumn, setSortColumn] = useState<string>('client_code')
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(32)
    const [searchArrClient, setSearchArrClient] = useState<ClientsForClientsPage[]>([])
    const [editData, setEditData] = useState<ClientsForClientsPage | {}>({})
    const [editClientMode, setEditClientMode] = useState<boolean>(false)
    const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
    // const [showEditModal, setShowEditModal] = useState<boolean>(false)
    
    // for fixing order filter on top of screen
    const isFixedClientFilter = useAppSelector(state => state.themeReducer.isFixedOrderFilter)
    const isShowModal = useAppSelector(state => state.clientsReducer.show);

    let View: any = localStorage.getItem('view')
    let local: any = View && JSON.parse(View)
    let result: any = local && local?.client

    const [view, setView] = useState<string>(result ? result : 'list')
    
    const {
        isLoading,
        isError,
        isRefetching,
        isRefetchError,
        data:clientData,
        refetch: dataClientRefetch,
    } = useQuery(["clientList", limit, page, searchQuery], () => GetClients(limit, page, searchQuery), {
         refetchOnWindowFocus: false
    });


    const searchClient = (e: any) => {
        setSearchQuery(e.target.value)
    }

    useEffect(() => {
        dataClientRefetch();
      }, [limit, page, searchQuery]);

    useEffect(() => {
        if (!isLoading && !isError && !isRefetchError && !isRefetchError){
            setSearchArrClient(clientData?.response || [])
        }
    }, [isLoading, isError, isRefetching, isRefetchError])


    useEffect(() => {
        if(searchArrClient){
            setSearchArrClient(sortArray(searchArrClient, sortColumn, sortDirection))
        }
    }, [sortColumn, sortDirection, !!searchArrClient])

    return (
        <>
            {isShowModal || editClientMode ? 
                <NewAddClient
                    setShow={setShowAddUserModal}
                    setEditMode={setEditClientMode}
                    editMode={editClientMode}
                    show={isShowModal}
                    translate={t}
                    onSuccess={dataClientRefetch}
                    editData={editData}
                    onAdd={(obj) => {
                        setSearchArrClient((searchArray) => [...searchArray, obj])
                    }}
                    onUpdate={(obj: any) => {
                        setSearchArrClient(searchArrClient?.map((item: any) =>  {

                            if(item.partner_guid === obj.partner_guid){
                                return {...item, 
                                partner_name: obj.partner_name, 
                                partner_full_name: obj.partner_full_name,
                                partner_address: obj.partner_address, 
                                partner_telephone: obj.partner_telephone,
                                addition_addresses: obj.addition_addresses,
                                addition_telephones: obj.addition_telephones,
                                partner_balance: obj.partner_balance,
                                partner_code: obj.partner_code  
                            }
                            }
                            return item
                        }))
                    }}
                />
            : null}
            <div className={styles.clients}>
            <ClientsFilter 
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    setView={setView}
                    setSortColumn={setSortColumn}
                    setSortDirection={setSortDirection}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    searchClient={searchClient}
                />
                <div className={isFixedClientFilter ? styles.filterFixed : ''}>
                
                {
                    isLoading
                        ?
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Preloader />
                        </div>
                        :
                        <div>
                            <div className={isFixedClientFilter ? styles.fixContentWrapper : styles.contentWrapper}>
                                {
                                    view === 'grid' ? 
                                    <Row rowGutter={10} colGutter={10}  >
                                    {
                                        searchArrClient?.length > 0 && searchArrClient?.map((item: any, i: number) => (
                                            <Col
                                                key={i}
                                                grid={{ xxlg: 4, xlg: 4, lg: 6, span: 6, sm: 12 }}
                                            >
                                                <CardGrid
                                                    bool={view}
                                                    partner={item}
                                                    onClickEdit={(guid) => {
                                                        let foundedClient = searchArrClient.find((item: any) => item.partner_guid === guid)
                                                        setEditData(Object.assign({}, foundedClient))
                                                        setEditClientMode(true)
                                                        dispatch(ClientsAction.setModal(true))
                                                    }}
                                                />
                                            </Col>
                                       

                                        ))
                                    }
                                    </Row> : 
                                    <Col>
                                    {
                                        searchArrClient.length > 0 && searchArrClient?.map((item: any, i: number) => (
                                            <div key={i} style={{margin: '10px 0'}}>
                                                <CardList
                                                    onClickSelect={() => {}}
                                                    bool={view}
                                                    partner={item}
                                                    onClickEdit={(guid: any) => {
                                                        let foundedClient = searchArrClient.find((item: any) => item.partner_guid === guid)
                                                        setEditData(Object.assign({}, foundedClient))
                                                        setEditClientMode(true)
                                                        // setShowEditModal(true)
                                                        dispatch(ClientsAction.setModal(true))
                                                    }}
                                                />
                                            </div>
                                    

                                        ))
                                    }
                                    </Col>
                                }
                            </div>
                        </div>
                }
            </div>
            </div>

            
            <div className={styles.clientFooter}>            
                <div className={styles.clientPagination}>
                    <div className={styles.ordersPaginationLimit}>
                        <select
                        className={styles.select}                       
                        value={limit}
                        onChange={(e) => {
                            setLimit(parseInt(e.currentTarget.value));
                            setPage(1);
                        }}
                        >
                            <option value={clientData?.totalRowCount} >{t('all')}</option>
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
                        clientData?.totalRowCount
                            ? Math.ceil(clientData.totalRowCount / limit)
                            : 0
                        }
                        onChange={(page) => setPage(page)}
                        size="small"
                    />
                </div>
            </div>
        </>
    )
}

export default ClientsPage

