import { MaterialList } from '@app/api/Types/queryReturnTypes';
import { SearchValues } from '@app/components/DropDownSelect/DropDownSelect';
import {
    AddMaterial,
    AddToBuffer,
    ChangePrice,
    ChangePriceType,
    Clear,
    ClearBuffer,
    CloseEditMode,
    DecreaseBufferMaterialAmount,
    DecreaseMaterialAmount,
    IncreaseBufferMaterialAmount,
    IncreaseMaterialAmount,
    MoveToMaterials,
    RemoveFromBuffer,
    RemoveMaterial,
    SetAddMaterials,
    SetBufferMaterialAmount,
    SetClient,
    SetEditMode,
    SetEndTime,
    SetGeneratedOrderCode,
    SetMaterialAmount,
    SetMaterialData,
    SetMaterialDescription,
    SetOrderNote,
    SetStartTime,
    SetStatus,
    SetWarehouse,
} from './../types/MaterialTypes';


const addToBuffer = (material: MaterialList): AddToBuffer => {
    return {
        type: "ADD_TO_BUFFER",
        payload: material
    }
}

const removeFromBuffer = (material: MaterialList): RemoveFromBuffer => {
    return {
        type: "REMOVE_FROM_BUFFER",
        payload: material
    }
}

const setBufferMaterialAmount = (material: MaterialList): SetBufferMaterialAmount => {
    return {
        type: "SET_BUFFER_AMOUNT",
        payload: material,
    };
};


const increaseBufferMaterial = (material: MaterialList): IncreaseBufferMaterialAmount => {
    return {
        type: "INCREASE_BUFFER_MATERIAL",
        payload: material,
    };
};


const decreaseBufferMaterial = (material: MaterialList): DecreaseBufferMaterialAmount => {
    return {
        type: "DECREASE_BUFFER_MATERIAL",
        payload: material,
    };
};

const clearBuffer = (): ClearBuffer => {
    return {
        type: 'CLEAR_BUFFER'
    }
}


const moveToMaterials = (): MoveToMaterials => {
    return {
        type: 'MOVE_TO_MATERIALS'
    }
}

const setMaterialAmount = (material: MaterialList): SetMaterialAmount => {
    return {
        type: "SET_AMOUNT",
        payload: material,
    };
};
const addMaterial: any = (material: MaterialList): AddMaterial => {
    return {
        type: "ADD_ITEM",
        payload: material,
    };
};
const removeMaterial = (material: MaterialList): RemoveMaterial => {
    return {
        type: "REMOVE_ITEM",
        payload: material,
    };
};
const increaseMaterialAmount = (material: MaterialList): IncreaseMaterialAmount => {
    return {
        type: "INCREASE",
        payload: material,
    };
};
const decreaseMaterialAmount = (material: MaterialList): DecreaseMaterialAmount => {
    return {
        type: "DECREASE",
        payload: material,
    };
};
const clear = (): Clear => {
    return {
        type: "CLEAR"
    };
};
const setGeneratedOrderCode = (generatedCode: string): SetGeneratedOrderCode => {
    return {
        type: "SET_GENERATED_CODE",
        payload: generatedCode
    };
};

const setMaterialData = (materials: MaterialList[], orderGeneratedCode: string, editableOrderGuid: string): SetMaterialData => {
    return {
        type: "SET_MATERIAL_DATA",
        payload: {
            materials: materials,
            orderGeneratedCode: orderGeneratedCode,
            editableOrderGuid: editableOrderGuid
        }
    };
};

const setEditMode = (editMode: boolean): SetEditMode => {
    return {
        type: 'SET_EDIT_MODE',
        payload: editMode
    }
}

const setAddMaterials = (addMaterials: boolean): SetAddMaterials => {
    return {
        type: 'SET_ADD_MATERIALS',
        payload: addMaterials
    }
}

const closeEditMode = (): CloseEditMode => {
    return {
        type: 'CLOSE_EDIT_MODE',
    }
}



const setStartTime = (value: string): SetStartTime => {
    return {
        type: 'SET_START_TIME',
        payload: value
    }
}
const setEndTime = (value: string): SetEndTime => {
    return {
        type: 'SET_END_TIME',
        payload: value
    }
}
const setWarehouse = (value: SearchValues): SetWarehouse => {
    return {
        type: 'SET_WAREHOUSE',
        payload: value
    }
}
const setClient = (value: SearchValues): SetClient => {
    return {
        type: 'SET_CLIENT',
        payload: value
    }
}
const setStatus = (value: SearchValues): SetStatus => {
    return {
        type: 'SET_STATUS',
        payload: value
    }
}
const setOrderNote = (value: string): SetOrderNote => {
    return {
        type: 'SET_ORDER_NOTE',
        payload: value
    }
}


const changePrice = (material: MaterialList, newPrice: number): ChangePrice => {
    return {
        type: 'CHANGE_PRICE',
        payload: material,
        newPrice
    }
} 


const changePriceType = (material: MaterialList, priceType: string): ChangePriceType => {
    return {
        type: 'CHANGE_PRICE_TYPE',
        payload: material,
        priceType
    }
}


const setMtrlDesc = (material: MaterialList, description: string): SetMaterialDescription => {
    return {
        type: 'SET_MATERIAL_DESCRIPTION',
        payload: material,
        description
    }
}





const exportDefault = {
    addMaterial,
    removeMaterial,
    increaseMaterialAmount,
    decreaseMaterialAmount,
    setMaterialAmount,
    clear,
    setGeneratedOrderCode,
    setMaterialData,
    closeEditMode,
    setEditMode,
    setAddMaterials,

    setStartTime,
    setEndTime,
    setWarehouse,
    setClient,
    setStatus,
    setOrderNote,

    changePrice,
    changePriceType,
    setMtrlDesc,
    

    addToBuffer,
    removeFromBuffer,
    setBufferMaterialAmount,
    increaseBufferMaterial,
    decreaseBufferMaterial,
    clearBuffer,
    moveToMaterials,
    
};

export default exportDefault;
