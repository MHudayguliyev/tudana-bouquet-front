type AllServerImagesTypes = {
    status: number
    imagesPath: string
    data: ServerImageType[]
}


type ServerImageType = {
    image_guid: string
    image_name: string
}


export default AllServerImagesTypes