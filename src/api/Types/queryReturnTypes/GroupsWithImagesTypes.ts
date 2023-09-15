type GroupsWithImagesTypes = {
    images_path: string
    data: GroupsType[]
}

export type GroupsType = {
    group_guid: string
    group_name: string
    image_name: string | null
}

export default GroupsWithImagesTypes