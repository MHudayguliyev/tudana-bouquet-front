import React, { useState } from 'react'
import { Col, Row, Button, Input, Paper } from '@app/compLibrary'
import { useAppDispatch, useAppSelector } from '@app/hooks/redux_hooks';
import { useTranslation } from 'react-i18next';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import { FaThList } from "react-icons/fa";
import ThemeAction from "@redux/actions/ThemeAction";
import styles from "./ClientsFilter.module.scss"
import TopBurgerMenu from '../TopBurgerMenu/TopBurgerMenu';
import DropDownSelect from '../DropDownSelect/DropDownSelect';


type ClientsFilterProps = {
  sortColumn: string,
  sortDirection: string,
  setView: Function,
  setSortColumn: Function,
  setSortDirection: Function
  searchQuery: string,
  setSearchQuery: Function
  searchClient: Function
}

export default function ClientsFilter(props: ClientsFilterProps) {
  const  { sortColumn, sortDirection, setView, setSortColumn, setSortDirection, searchQuery, setSearchQuery, searchClient } = props;
  const dispatch = useAppDispatch()
  const { t } = useTranslation();
  const lang: string | any = localStorage.getItem('language')

  type CalculateTypes = {
    value: string,
    label: {
       en: string
       tm: string,
       ru: string
    }
 }


  const calculates: CalculateTypes[] = [
    {
        value: "client_code",
        label: {en: "Code", tm: "Kody b/ç", ru: "Коду"}
    },
    {
        value: "client_name",
        label: {en: "Name", tm: "Ady b/ç", ru: "Имени"}
    },
    {
      value: "client_full_name",
      label: {en: "Fullname", tm: "F.A.A b/ç", ru: "Ф.И.О"}
    },
    {
        value: "contact_address",
        label: {en: "Address", tm: "Salgysy b/ç", ru: "Адресy"}
    },
  ]

  let View: any = localStorage.getItem('view')
  let local: string | any | null = JSON.parse(View)
  let result: any = local?.client

  const [filter, setFilter] = useState(false)
  const [outlook, setOutlook] = useState(result ? result : 'list')
  

  // for fixing order filter on top of screen
  const isFixedClientFilter = useAppSelector(state => state.themeReducer.isFixedOrderFilter)
  const toggleFilterFixed = () => {
    dispatch(ThemeAction.toggleFixedOrderFilter(!isFixedClientFilter))
  }
  const clearFilter = async () => {
    setSortColumn('code');  // default col is client_code onClear
    setSortDirection('ASC');
    setView('grid');
    setSearchQuery('')  
    dispatch(ThemeAction.toggleFixedOrderFilter(!isFixedClientFilter))
  }

  const content = (
    <>
      <Row rowGutter={10} colGutter={10}>
      <Col className={styles.searchCol}>
            <div className={styles.searchInput}>
                <Input
                    value={searchQuery}
                    placeholder={t('search')}
                    className={styles.searchStyle}
                    type={'search'}
                    onChange={(e) => {searchClient(e);  setFilter(true)}}
                    autoFocus
                />
            </div>
        </Col>
      </Row>
      <Row rowGutter={5} colGutter={10}>

        <Col>
        <div className={styles.clientSort}>
          <h4>
              {t('sort')}
            </h4>
          <div className={`${styles.filterInput} ${styles.filterSelect}`}>
              <DropDownSelect
                onChange={(item: any) => {
                  setSortColumn(item.value as string)
                  setFilter(true)
                }
                }
                fetchStatuses={{ isLoading: false, isError: false }}
                title={t('clientCode')}
                titleSingleLine
                data={calculates}
                locale={lang}
                dropDownContentStyle={{right: '-10px'}}
              />
          </div>
        </div>
            
        </Col>
          <Col >
              <Button
              color="theme"
              disable={sortColumn == 'all' && true}
              fullWidth={true}
              fullHeight={true}
              center={true}
              rounded
              onClick={() => {
              if (sortDirection === 'ASC') {
                  setSortDirection('DESC')
                  setFilter(true)
              } else {
                  setSortDirection('ASC')
              }
                                                  
              }}
            >
              {
                sortDirection === 'ASC' ?
                  <i className="bx bx-sort-up"></i>
                    :
                  <i className="bx bx-sort-down"></i>
                }
                <div style={{width: '40px'}}>{sortDirection}</div> 
              </Button>
          </Col>

        <Col>
          <Button color={`${outlook === 'list' ? "theme" : "white"}`} rounded onClick={() => {setView('list'); setOutlook('list'); localStorage.setItem('view', JSON.stringify({client: 'list'})); setFilter(true)}}>
            <div title='List'><FaThList />
            </div>
          </Button>
        </Col>
        <Col>
          <Button color={`${outlook === 'grid' ? "theme" : "white"}`} rounded onClick={() => {setView('grid'); setOutlook('grid'); localStorage.setItem('view', JSON.stringify({client: 'grid'}))}}>
            <div title='Grid'><BsFillGrid3X3GapFill />
            </div>
          </Button>
        </Col>
        <Col className={styles.pinIcon}>
          <Button color={`${isFixedClientFilter ? "theme" : "white"}`} rounded onClick={() => {toggleFilterFixed(); setFilter(true); clearFilter; console.log(isFixedClientFilter)}}>
            <i className='bx bx-pin' ></i>
            {t('Pin')}
          </Button>
        </Col>
      </Row>
    </>
  )
  return (
    <>
    <Paper rounded>
      <div className={styles.headWrapper}>
        {content}
      </div>
    </Paper>
      <div className={styles.burgerMenu}>
        <TopBurgerMenu title='' search={searchClient} filter={filter} setFilter={setFilter} clearFilter={clearFilter}>
          <div style={{padding: '20px'}}>
            {content}
          </div>
        </TopBurgerMenu>
      </div>
    </>
  )
  }
