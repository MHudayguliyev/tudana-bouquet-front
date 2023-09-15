import React, { ChangeEvent, useEffect, useState } from 'react';
// own component library
import { Row, Col, Paper, Input, SizedBox, Button, Preloader } from '@app/compLibrary';
// custom styles
import styles from './AddMaterials.module.scss';
import classNames from "classnames/bind";
import { useTranslation } from 'react-i18next';
// queries
import { useQuery } from 'react-query';
import { getMaterialCategories, getMaterialGroups, getMaterialCategoriesAll } from '@app/api/Queries/Getters';
// types
import { MaterialCategories, MaterialGroups } from '@app/api/Types/queryReturnTypes';
import MaterialCategoryCard from '@app/components/MaterialCategoryCard/MaterialCategoryCard';
import Materials from '@app/components/Modals/Materials/Materials';
import { useAppDispatch, useAppSelector } from '@app/hooks/redux_hooks';

// action creators
import MaterialActions from '@app/redux/actions/MaterialAction';


const cx = classNames.bind(styles);
// later will change
function handleGroupSearch<T extends MaterialGroups[]>(event: ChangeEvent<HTMLInputElement>, data: T) {
    const value = event.currentTarget.value?.toLowerCase();
    const result = [];
    for (let i = 0; i < data.length; i++) {
        const searchValue = data[i]?.group_name.toLowerCase();
        if (searchValue.includes(value)) {
            result.push({ ...data[i] });
        }
    }
    return result;
}
// later will change
function handleCategoriesSearch<T extends MaterialCategories[]>(event: ChangeEvent<HTMLInputElement>, data: T) {
    const value = event.currentTarget.value?.toLowerCase();
    const result = [];
    for (let i = 0; i < data.length; i++) {
        const searchValue = data[i]?.mtrl_name.toLowerCase();
        if (searchValue.includes(value)) {
            result.push({ ...data[i] });
        }
    }
    return result;
}

const AddMaterials = () => {

    const { t } = useTranslation();
    const [groupGuid, setGroupGuid] = useState('');

    // for manupulation with redux store
    const dispatch = useAppDispatch();
    const editMode = useAppSelector(state => state.materialReducer.editMode)

    //queries
    const {
        data: groupsData,
        isLoading: isGroupsloading,
        isError: isGroupsError
    } = useQuery('materialGroups', getMaterialGroups)
    const {
        data: categoriesData,
        isLoading: categoriesIsloading,
        isError: categoriesIsError
    } = useQuery(['materialCategories', groupGuid], () => getMaterialCategories(groupGuid), { enabled: !!groupGuid })
    const {
        data: categoriesDataAll,
        isLoading: catAllIsLoading,
        isError: catAllIsError
    } = useQuery('materialCategoriesAll', () => getMaterialCategoriesAll())

    const [col, setCol] = useState<boolean>(false)
    const [groups, setGroups] = useState(groupsData);
    const [categories, setCategories] = useState(categoriesData);
    const [ctg, setCtg] = useState(false)
    const [headName, setHeadName] = useState<any>(t('all'))
    const [materialsModalShow, setMaterialsModalShow] = useState(false);
    const [materialGuid, setMaterialGuid] = useState('');

    
    var w = window.innerWidth;
    var h = window.innerHeight;
    const [active, setActive] = useState<string>('')
    const toggleCategoryButton = () => {
       if (w <= 1280 ) setCtg(!ctg)
    }

    useEffect(() => {
        if (!isGroupsloading || !isGroupsError) {
            setGroups(groupsData)
            setGroupGuid(groupsData ? groupsData[0].group_guid : '')
        }
    }, [isGroupsloading, isGroupsError])


    useEffect(() => {
        if (!categoriesIsloading && !categoriesIsError)
            setCategories(categoriesData)
    }, [categoriesData])


    useEffect(() => {
        if(editMode)
            dispatch(MaterialActions.setAddMaterials(true));
    }, [editMode])

    const categorySide = (
        <Paper rounded className={styles.groups}>
                        <div className={styles.searchWrapper}>
                            <h4 className={styles.headText}>{t('categories')}</h4>
                            <Input
                                onChange={(e) => setGroups(handleGroupSearch(e, groupsData ? groupsData : []))}
                                type='text'
                                fontSize='big'
                                fontWeight='bold'
                                placeholder={t('search')}
                                style={{ width: '100%' }}
                                className={styles.searchInp}
                                defaultValue=''
                            />
                        </div>
                        <div className={styles.groupsContainer} id={styles.groupsContainer}>
                            <div className={styles.groupsWrapper} >
                                {
                                    isGroupsloading ?
                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                            <Preloader />
                                        </div>
                                        :
                                        !isGroupsError && groups ?
                                        <>
                                        <div
                                            onClick={() => {
                                                setCol(true)
                                                setActive('all')
                                                setCategories(categoriesDataAll)
                                                setHeadName(t('all'))
                                            }}
                                            className={cx({all: true, active: active == 'all'})}
                                        >
                                        <span className={cx({groupName: true})}>{t('all')}</span>

                                        </div>
                                            {
                                                groups.map((data, index) => {
                                                    return (
                                                        <ul key={index} className={styles.groupBtnWrapper}>
                                                            <li
                                                                onClick={() => {
                                                                    setCol(false)
                                                                    setActive(data.group_guid)
                                                                    setGroupGuid(data.group_guid)
                                                                    setHeadName(data.group_name)
                                                                    toggleCategoryButton()
                                                                }}
                                                                className={cx({listGroup: true, active: active == data.group_guid || headName == data.group_name})}
                                                            >   
                                                                <span lang="ru" className={styles.groupName}>{data.group_name}</span>
                                                                {
                                                                    data.attrs_count.length <= 2 ? 
                                                                    <span className={styles.attrsCount}>{data.attrs_count}</span> : 
                                                                    <span className={styles.attrsCount}>99+</span>
                                                                }
                                                            </li>
                                                        </ul>
                                                    )
                                                })
                                            }
                                            </>
                                            :
                                            <div className={styles.noDataTxt}>
                                                {t('noData')}
                                            </div>
                                }
                            </div>
                        </div>
                    </Paper>
    )
    return (
        <>
            <Materials
                show={materialsModalShow}
                setShow={setMaterialsModalShow}
                translate={t}
                materialGuid={materialGuid}
            />
            <Row rowGutter={10} colGutter={10}>
                <Col grid={{ span: 3, md: 6, sm: 12, xs: 12 }} className={styles.catgs}>
                    { categorySide }
                </Col>
                <Col grid={{ span: 9, lg: 12, md: 12, sm: 12, xs: 12 }}>
                    <div className={styles.catButton}>
                        <Button color="theme" fullWidth rounded center={true} onClick={() => {toggleCategoryButton(); console.log(ctg)}} >
                            {t('categories')}
                        </Button>
                    </div>
                    <div style={{marginBottom: ctg ? '10px' : '0'}}>
                    <Col grid={{ span: 3, lg: 12, md:12, sm: 12, xs: 12 }}>
                        {ctg ? categorySide : ''}
                    </Col>
                    </div>
                    <Paper rounded>
                        <div className={styles.searchWrapper}>
                            {
                                headName === 'all' ?
                                    <h4 className={styles.headText}>
                                        {t('all')}
                                    </h4>
                                : 
                                    <h4 className={styles.headText}>
                                        {headName}
                                    </h4>
                            }
                                <Input
                                    onChange={(e) => setCategories(handleCategoriesSearch(e, categoriesData ? categoriesData : []))}
                                    type='text'
                                    fontSize='big'
                                    fontWeight='bold'
                                    placeholder={t('search')}
                                    style={{ width: '100%' }}
                                    className={styles.searchInp}
                                />
                        </div>
                        <div className={styles.groupsContainer} id={styles.groupsContainer}>
                            <SizedBox height={15} />
                            <Row rowGutter={5} colGutter={5}>
                                {
                                    categoriesIsloading ?
                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                            <Preloader />
                                        </div>
                                        :
                                        !categoriesIsError && categories ?
                                            categories.map((data, index) => {
                                                return (
                                                    <Col key={index} grid={{ xxlg: 3, xlg: 4, lg: 6, md: 6, sm: 6, xs: 12 }}>
                                                        <MaterialCategoryCard
                                                            data={data}
                                                            onClick={(mtrlGuid) => {
                                                                setMaterialGuid(mtrlGuid);
                                                                setMaterialsModalShow(true);
                                                            }}
                                                            translate={t}
                                                        />
                                                    </Col>
                                                )
                                            })
                                            :
                                            <div className={styles.noDataTxt}>
                                                {t('noData')}
                                            </div>
                                }
                            </Row>
                        </div>
                    </Paper>
                </Col>
            </Row >
        </>
    )
}

export default AddMaterials;