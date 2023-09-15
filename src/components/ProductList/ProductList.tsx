// @ts-nocheck
import React, { useMemo, useState, ChangeEvent, useEffect, useRef } from 'react';
import { Button } from '@app/compLibrary';
import styles from './ProductList.module.scss'

import { useQuery } from 'react-query';
import { useAppSelector } from '@app/hooks/redux_hooks';
import { createTheme, ThemeProvider } from '@mui/material';
import { useTranslation } from 'react-i18next';


import MaterialReactTable, {
    type MRT_ColumnDef,
    type MRT_ColumnFiltersState,
    type MRT_PaginationState,
    type MRT_SortingState,

} from 'material-react-table';

import {
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Edit, Refresh } from '@mui/icons-material';
import ProductEdit from '../ProductEdit/ProductEdit';
import { get } from '@app/api/service/api_helper';
import { getAllMaterialList, getPriceValues } from '@app/api/Queries/Getters';
import { AllMaterialList, ExistImageTypes } from '@app/api/Types/types';
import { dataURLtoFile, getImageNameFromURL, toDataURL } from '@utils/helpers';
import { PURE_BASE_URL } from '@app/api/axiosInstance';
import { AllMaterialsType, PriceValuesTypes } from '@api/Types/queryReturnTypes'



const ProductList = () => {
    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [showEditModal, setShowEditModal] = useState<boolean>(false)
    const [editData, setEditData] = useState<AllMaterialsType | {}>({})
    const [existImageFiles, setExistImageFiles] = useState<any[]>([])
    const [allServerImages, setAllServerImages] = useState<any[]>([])
    const [priceValues, setPriceValues] = useState<PriceValuesTypes[]>([])

    const theme = useAppSelector(state => state.themeReducer)
    const { t } = useTranslation()
    const tableTheme = useMemo(() => createTheme({
        palette: {
            mode: theme.mode === 'theme-mode-dark' ? 'dark' : 'light',
            info: {
                main: 'rgb(255,122,0)',
            },
            background: {
                default:
                    theme.mode === 'theme-mode-light'
                        ? 'rgb(254,255,244)'
                        : '#202020',
            },
        }
    }), [theme]);

    const { data, isError, isFetching, isLoading, refetch } =
        useQuery<AllMaterialList>({
            queryKey: [
                'table-data',
                columnFilters,
                globalFilter,
                pagination.pageIndex,
                pagination.pageSize,
                sorting,
            ],
            queryFn: async () => getAllMaterialList(pagination.pageIndex * pagination.pageSize, pagination.pageSize, globalFilter ?? '', JSON.stringify(columnFilters ?? []), JSON.stringify(sorting ?? [])),
            keepPreviousData: true,
        });


    const columns = useMemo<MRT_ColumnDef<AllMaterialsType>[]>(() => [
        {
            accessorKey: 'actions',
            header: t('materialEditTableColumns.actions'),
            size: 10,
            enableColumnOrdering: false,
            enableEditing: false,
            enableColumnActions: false,
            enableSorting: false,
            Cell: ({ row }) =>
                <Box sx={{ display: 'flex', gap: '1rem' }}>
                    <Tooltip arrow placement="left" title="Edit">
                        <IconButton onClick={async () => {
                            setEditData(Object.assign({}, row.original))
                            setShowEditModal(!showEditModal)
                            const priceValuesData = await getPriceValues(row.original.mtrl_attr_unit_row_id)
                            setPriceValues(priceValuesData)
                            const allServerImages = await get(`/general/get-all-images?is_materials`)
                            if (allServerImages.status === 200) {
                                const fileDataArray: any = [];
                                for await (const img of allServerImages?.data) {
                                    const imagePath = `${PURE_BASE_URL}${allServerImages.imagesPath}/${img.image_name}`
                                    toDataURL(imagePath)
                                        .then(dataUrl => {
                                            var fileData = dataURLtoFile(dataUrl, getImageNameFromURL(img.image_name));
                                            fileData.is_image_main = false
                                            fileData.is_server_image = true
                                            fileData.is_pc_image = false
                                            fileDataArray.push(fileData);
                                            if (fileDataArray.length === allServerImages.data.length) {
                                                setAllServerImages([...fileDataArray])
                                            }
                                        })
                                }
                            }
                            const existImagesRes: ExistImageTypes = await get(`/general/get-images-by-material?mtrl_attr_unit_row_id=${row.original.mtrl_attr_unit_row_id}`)
                            if (existImagesRes.status === 'success' || existImagesRes.status === 'notfound') {
                                const fileDataArray: any = [];
                                for (const img of existImagesRes.data) {
                                    const imagePath = `${PURE_BASE_URL}${existImagesRes.imagesPath}/${img.image_name}`
                                    toDataURL(imagePath)
                                        .then(dataUrl => {
                                            var fileData = dataURLtoFile(dataUrl, getImageNameFromURL(img.image_name));
                                            fileData.is_image_main = img.is_image_main
                                            fileDataArray.push(fileData);
                                            if (fileDataArray.length === existImagesRes.data.length) {
                                                setExistImageFiles([...existImageFiles, ...fileDataArray])
                                            }
                                        })
                                }
                            }
                        }} >
                            <Edit />
                        </IconButton>
                    </Tooltip>
                </Box>
        },
        {
            accessorKey: 'mtrl_code',
            header: t('materialEditTableColumns.code'),
        },
        {
            accessorKey: 'mtrl_name',
            header: t('materialEditTableColumns.name'),
        },
        {
            accessorKey: 'unit_det_code',
            header: t('materialEditTableColumns.unit_det_code'),
        },
        {
            accessorKey: 'group_name',
            header: t('materialEditTableColumns.group_name'),
        },
        {
            accessorKey: 'attribute_name',
            header: t('materialEditTableColumns.attr_name'),
        },
        {
            accessorKey: 'price_value',
            header: t('materialEditTableColumns.price_value')
        }
    ], []);


    useEffect(() => {
        refetch()
    }, [editData])




    return (
        <>
            <ThemeProvider theme={tableTheme}>
                <MaterialReactTable
                    columns={columns}
                    data={data ? data?.data : []}
                    initialState={{ showColumnFilters: false }}
                    manualFiltering
                    manualPagination
                    manualSorting
                    enableColumnResizing
                    muiTableContainerProps={{
                        sx: {
                            height: '75vh'
                        }
                    }}
                    muiToolbarAlertBannerProps={
                        isError
                            ? {
                                color: 'error',
                                children: 'Error loading data',
                            }
                            : undefined
                    }
                    muiTablePaginationProps={{
                        showFirstButton: false,
                        showLastButton: false,
                    }}
                    onColumnFiltersChange={setColumnFilters}
                    onGlobalFilterChange={setGlobalFilter}
                    onPaginationChange={setPagination}
                    onSortingChange={setSorting}
                    renderTopToolbarCustomActions={() => (
                        <Box sx={{ display: 'flex', gap: '1rem' }}>
                            <Button type='text' rounded onClick={() => refetch()}>
                                <Refresh />
                            </Button>
                        </Box>
                    )}
                    rowCount={data?.total_row_count ?? 0}
                    
                    state={{
                        columnFilters,
                        globalFilter,
                        isLoading,
                        pagination,
                        showAlertBanner: isError,
                        showProgressBars: isFetching,
                        sorting,
                    }}
                />
            </ThemeProvider>

            <ProductEdit
                editData={editData || undefined}
                setEditData={setEditData}

                setShowEditModal={setShowEditModal}
                showEditModal={showEditModal}

                setExistImageFiles={setExistImageFiles}
                existImageFiles={existImageFiles}

                allServerImages={allServerImages}
                setAllServerImages={setAllServerImages}

                priceValues={priceValues}
                setPriceValues={setPriceValues}
                
            />
        </>
    )
}


export default ProductList