import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// own component library
import { Button, Input, Modal, Pagination, Paper, Preloader, SizedBox, Table } from '@app/compLibrary';
// custom styles
import styles from './SelectClients.module.scss';
import classNames from 'classnames/bind';
import commonStyles from '../CommonStyles.module.scss';
// types
import CommonModalI from '../commonTypes';
// queries
import { useQuery } from 'react-query';
import { GetClients } from '@app/api/Queries/Getters';
// types
import { ClientsListFull } from '@app/api/Types/queryReturnTypes';
import CardList from '@app/components/ClientCard/ClientListCard';
import { isEmpty } from '@utils/helpers';

const cx = classNames.bind(styles);

type FormikValues = {
    username: string
}

interface SelectClientsProps extends CommonModalI {
    translate: Function
    onClickRow: (value: ClientsListFull) => void
}

const SelectClients = (props: SelectClientsProps) => {
    const {t} = useTranslation()

    const {
        show,
        setShow,
        translate,
        onClickRow,
    } = props;

    const [searchArrClient, setSearchArrClient] = useState([])
    const [selectedClient, setSelectedClient] = useState<ClientsListFull | any>()
    const [isClientSelected, setIsClientSelected] = useState<boolean>(false)
    const [clientGuid, setClientGuid] = useState<string>('')
    
    /// pagination states 
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(32)
    const [searchValue, setSearchValue] = useState<string>('')


    const {
        data: clientData,
        isLoading,
        refetch,
        isError,
        isRefetching,
        isRefetchError,
    } = useQuery(['clientList'], () => GetClients(limit, page, searchValue), {
       refetchOnWindowFocus: false,
    })

    
    useEffect(() => {
        refetch();
      }, [limit, page, searchValue]);

    useEffect(() => {
        if (!isLoading && !isError && !isRefetchError && !isRefetchError)
            setSearchArrClient(clientData.response)
    }, [isLoading, isError, isRefetchError, isRefetching])

    
    const search = (e: any) => {
        setSearchValue(e.target.value)
    }

    return (
        <Modal
            isOpen={show}
            close={async () => {
                if(!isEmpty(clientGuid))
                    setClientGuid('')
                setShow(false);
                setSearchValue('')
                setPage(1)
                setLimit(32)
                setSearchArrClient(clientData.response)
            }}
            header={
                <h4 className={commonStyles.modalTitle}>
                    {translate('fullInfoAboutClient')}
                </h4>
            }
            
        >
            <div className={styles.fullWidth}>
                {
                    isLoading ?
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Preloader />
                        </div>
                        :
                        <>
                                <div className={styles.topSide}>
                                    <div className={styles.searchWrapper}>
                                        <Input
                                        style={{width: '100%'}}
                                            placeholder={translate('search')}
                                            type='search'
                                            onChange={search}
                                            autoFocus
                                        />
                                    </div>
                                    <div className={styles.pagination}>
                                        <div className={styles.paginationLimit}>
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
                                <div className={styles.cardList}>
                                {
                                    searchArrClient && searchArrClient?.map((item: any, i: number) => (
                                        <CardList
                                            client={item}
                                            onClickEdit={() => {}}
                                            onClickSelect={(guid: string) => {setClientGuid(guid), setSelectedClient(item)}}
                                            guid={clientGuid}
                                            key={i}
                                        />
                                    ))
                                }
                                </div>
                        
                        </>
                }
                <SizedBox height={15}/>
                <div className={styles.buttonWrapperRight}>
                            <Button
                                tabIndex={4}
                                rounded
                                color='grey'
                                onClick={() => {
                                    if(!isEmpty(clientGuid))
                                        setClientGuid('')
                                    setShow(false)
                                }}
                            >
                                {t('cancel')}
                            </Button>
                            <Button
                                tabIndex={3}
                                rounded
                                color="theme"
                                onClick={() => {
                                    if(selectedClient)
                                        onClickRow(selectedClient)
                                    setShow(false)
                                }}
                            >
                                {t('confirm')}
                            </Button>
                        </div>
            </div>
        </Modal >
    )
}

export default SelectClients;