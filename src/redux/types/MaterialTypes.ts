import { MaterialList } from "@app/api/Types/queryReturnTypes"
import { SearchValues } from "@app/components/DropDownSelect/DropDownSelect"

export type InitialStateType = {
    materials: MaterialList[]
    bufferMaterials: MaterialList[]
    orderGeneratedCode: string
    editMode: boolean
    editableOrderGuid: string
    addMaterials: boolean
    startTime: string
    endTime: string
    warehouse: SearchValues
    client: SearchValues
    status: SearchValues
    orderNote: string,
}

export interface AddToBuffer {
    type: "ADD_TO_BUFFER",
    payload: MaterialList
}

export interface RemoveFromBuffer {
    type: "REMOVE_FROM_BUFFER",
    payload: MaterialList
}

export interface SetBufferMaterialAmount {
    type: "SET_BUFFER_AMOUNT"
    payload: MaterialList
}

export interface IncreaseBufferMaterialAmount {
    type: "INCREASE_BUFFER_MATERIAL"
    payload: MaterialList
}

export interface DecreaseBufferMaterialAmount {
    type: "DECREASE_BUFFER_MATERIAL"
    payload: MaterialList
}

export interface ClearBuffer {
    type: "CLEAR_BUFFER"
}

export interface MoveToMaterials {
    type: "MOVE_TO_MATERIALS"
}

export interface AddMaterial {
    type: "ADD_ITEM" 
    payload: MaterialList
}
export interface SetMaterialAmount {
    type: "SET_AMOUNT"
    payload: MaterialList
}

export interface RemoveMaterial {
    type: "REMOVE_ITEM"
    payload: MaterialList
}

export interface IncreaseMaterialAmount {
    type: "INCREASE"
    payload: MaterialList
}

export interface DecreaseMaterialAmount {
    type: "DECREASE"
    payload: MaterialList
}

export interface Clear {
    type: "CLEAR"
}

export interface SetGeneratedOrderCode {
    type: "SET_GENERATED_CODE"
    payload: string
}
export interface SetMaterialData {
    type: "SET_MATERIAL_DATA"
    payload: {
        materials: MaterialList[]
        orderGeneratedCode: string
        editableOrderGuid: string
    }
}
export interface CloseEditMode {
    type: "CLOSE_EDIT_MODE"
}
export interface SetEditMode {
    type: "SET_EDIT_MODE"
    payload: boolean
}
export interface SetAddMaterials {
    type: "SET_ADD_MATERIALS"
    payload: boolean
}

export interface SetStartTime {
    type: "SET_START_TIME"
    payload: string
}
export interface SetEndTime {
    type: "SET_END_TIME"
    payload: string
}
export interface SetWarehouse {
    type: "SET_WAREHOUSE"
    payload: SearchValues
}
export interface SetClient {
    type: "SET_CLIENT"
    payload: SearchValues
}
export interface SetStatus {
    type: "SET_STATUS"
    payload: SearchValues
}
export interface SetOrderNote {
    type: "SET_ORDER_NOTE"
    payload: string
}

export interface ChangePrice {
    type: "CHANGE_PRICE",
    payload: MaterialList,
    newPrice: number,
}

export interface ChangePriceType {
    type: "CHANGE_PRICE_TYPE",
    payload: MaterialList,
    priceType: string,
}

export interface SetMaterialDescription {
    type: 'SET_MATERIAL_DESCRIPTION',
    payload: MaterialList,
    description: string
}

