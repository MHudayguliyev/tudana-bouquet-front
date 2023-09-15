import React, { useState, useEffect, ChangeEvent } from 'react'
import styles from './GroupsPage.module.scss'
import { getAllServerImages, getGroupsWithImages } from '@app/api/Queries/Getters'
import { Button, Modal, Preloader, Divider } from '@app/compLibrary'
import { useQuery } from 'react-query'
import { GroupsType } from '@app/api/Types/queryReturnTypes/GroupsWithImagesTypes'
import { BASE_URL, PURE_BASE_URL } from '@app/api/axiosInstance'
import { dataURLtoFile, fileToURL, getImageNameFromURL, toDataURL } from '@utils/helpers'
import { toast } from 'react-hot-toast'
import classNames from 'classnames/bind';
import noImage from '@app/assets/images/no_image.png'
import authToken from '@app/api/service/auth_token'
import axios from 'axios'



const cx = classNames.bind(styles)

const GroupsPage = () => {
    const initGroupFileData = { group_name: '', group_guid: '', image_name: '' }
    const [showModal, setShowModal] = useState<boolean>(false)
    const [groupData, setGroupData] = useState<GroupsType>(initGroupFileData)
    const [groupFileData, setGroupFileData] = useState<File>()
    const [imagesPath, setImagesPath] = useState<string>('')
    const [allServerImages, setAllServerImages] = useState<any[]>([])



    const {
        data: groupsData,
        isLoading: isGroupsloading,
        isError: isGroupsError,
        refetch: groupsRefetch
    } = useQuery('get_groups_with_images', () => getGroupsWithImages())
    // console.log('groupFileData: ', groupFileData)

    useEffect(() => {
        if (groupsData) {
            setImagesPath(groupsData?.images_path)
        }
    }, [groupsData])
    const {
        data: allServerImageData,
        isLoading: isAllServerImageDataLoading,
        isError: isAllServerImageDataError,
        refetch: allServerImagesRefetch
    } = useQuery('get_all_server_images', () => getAllServerImages())

    // console.log('allServerImageData: ', allServerImageData)

    useEffect(() => {
        if (!isAllServerImageDataLoading && allServerImageData?.status === 200) {
            const fileDataArray: any = [];
            for (const img of allServerImageData?.data) {
                const imagePath = `${PURE_BASE_URL}${allServerImageData.imagesPath}/${img.image_name}`
                toDataURL(imagePath)
                    .then(dataUrl => {
                        var fileData = dataURLtoFile(dataUrl, getImageNameFromURL(img.image_name));
                        //@ts-ignore
                        fileData.is_server_image = true
                        fileDataArray.push(fileData);
                        if (fileDataArray.length === allServerImageData.data.length) {
                            setAllServerImages([...fileDataArray])
                        }
                    })
            }
        }
    }, [allServerImageData])


    const handleUploadImages = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedImages = Array.from(new Set(e.target.files))
        if (selectedImages.length === 0) {
            return;
        }
        //@ts-ignore
        selectedImages[0].is_server_image = false
        setGroupFileData(selectedImages[0])
    }



    const handleSave = async () => {
        const formData = new FormData()
        groupFileData && formData.append('groupImage', groupFileData)
        const token = authToken()
        //@ts-ignore
        const is_server_image = groupFileData && groupFileData.is_server_image
        const resImages: any = (await axios({
            method: 'post',
            url: `${BASE_URL}/general/upload-groups-image?group_guid=${groupData.group_guid}&is_server_image=${is_server_image}`,
            data: formData,
            headers: { 'Content-Type': 'multipart/formData-data', 'Authorization': `Bearer ${token}` }
        })).data
        console.log('resImages: ', resImages)
        if (resImages) {
            groupsRefetch()
            toast.success('Success')
            setGroupFileData(undefined)
            setShowModal(!showModal)
        }
    }



    return (
        <>
            <div>
                <div className={styles.groupsCardWrapper}>
                    {
                        isGroupsloading ? <Preloader />
                            : groupsData && groupsData.data.length > 0 ?
                                groupsData.data.map((item: GroupsType, index: number) => (
                                    <div key={index} className={styles.groupsCard}>
                                        <img src={item.image_name ? `${PURE_BASE_URL}${groupsData.images_path}/${item.image_name}` : noImage} alt="iMAGE" width="auto" height="auto" />
                                        <div>
                                            <h3 title={item.group_name}>{item.group_name}</h3>
                                            <Button
                                                type='text'
                                                isIconContent
                                                circle
                                                center
                                                onClick={() => {
                                                    setShowModal(!showModal)
                                                    setGroupData(Object.assign({}, item))
                                                    if (!item.image_name) {
                                                        console.log('Image yok')
                                                    } else {
                                                        const imagePath = `${PURE_BASE_URL}${groupsData.images_path}/${item.image_name}`
                                                        console.log('imagePath; ', imagePath)
                                                        toDataURL(imagePath)
                                                            .then(dataUrl => {
                                                                var fileData = dataURLtoFile(dataUrl, getImageNameFromURL(item.image_name || ''));
                                                                //@ts-ignore
                                                                fileData.is_server_image = true
                                                                setGroupFileData(fileData)
                                                            })
                                                    }
                                                    allServerImagesRefetch()
                                                }}
                                            >
                                                <i
                                                    title='+Add image'
                                                    className='bx bxs-image-add'
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                )) : <div>No data</div>

                    }
                </div>
            </div>
            <Modal
                close={() => {
                    setShowModal(!showModal)
                    setGroupFileData(undefined)
                }}
                isOpen={showModal}
                styleOfModalBody={{ color: 'white' }}
                header={
                    <div className={styles.modalHeader}>
                        {groupData.group_name}
                    </div>
                }
            >
                <div className={styles.gridContainer}>
                    <section className={styles.groupImageSection}>
                        <img src={groupFileData ? fileToURL(groupFileData) : noImage} alt="Group image" className={styles.groupMainImage} />
                    </section>
                    <section className={styles.imagesListSection}>
                        <div className={styles.imageUploaderWrapper}>
                            <label
                                htmlFor="product_images"
                                className={styles.imageLabel}
                            >
                                +  Select images for product
                                <span>You can select only 1 image</span>
                            </label>
                            <input
                                type="file"
                                name="product_images"
                                id="product_images"
                                accept='image/png, image/jpeg, image/jpg, image/webp'
                                className={styles.imageInput}
                                onChange={handleUploadImages}
                                onClick={(e: any) => e.target.value = ''}
                            />

                        </div>
                        <Divider>
                            OR
                        </Divider>

                        <div className={styles.allImagesDiv}>
                            <div className={styles.imagePreviewsWrapper}>
                                <div className={styles.imageListWrapper}>
                                    {
                                        allServerImages.length > 0 ? allServerImages.map((item: any, index: number) => {
                                            return (
                                                <div key={index} className={
                                                    cx({
                                                        imgWrapperDivDefault: true,
                                                        selectedImage: groupFileData?.name === item.name
                                                    })
                                                }

                                                >
                                                    <img
                                                        src={fileToURL(item)}
                                                        alt={"Image"}
                                                    />
                                                    <span
                                                        className={styles.imageCover}
                                                        onClick={() => {
                                                            setGroupFileData(item)
                                                        }}
                                                    >
                                                        +
                                                    </span>
                                                </div>
                                            )
                                        }) : (
                                            <div>
                                                <span>
                                                    Hic hili surat yok
                                                </span>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <Button
                            rounded
                            fullWidth
                            color='theme'
                            center
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    </section>
                </div>
            </Modal>
        </>
    )
}

export default GroupsPage