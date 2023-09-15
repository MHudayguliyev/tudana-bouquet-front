import { AnyAction } from "redux";
import { InitialStateType } from "../types/MaterialTypes";
import { isSelectedMaterial } from "@utils/helpers";
import { getFromStorage, setToStorage } from "@utils/storage";
import moment from "moment";

const initialState: InitialStateType = getFromStorage();
let line_row_id_front: number = -1;
const MaterialReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case "SET_AMOUNT":
      // console.log('action patload', action.payload)
      var stateMaterialsCopy = state.materials.map((value) => ({ ...value }));
      if (action.payload.amount > 0) {
        if (
          !state.materials.find((item) =>
            isSelectedMaterial(item, action.payload)
          )
        ) {
          // console.log('sunda 1')
          stateMaterialsCopy.push({
            ...action.payload,
            amount: 1,
          });
        } else {
          // console.log('sunda 2')

          stateMaterialsCopy[
            state.materials.findIndex((item) =>
              isSelectedMaterial(item, action.payload, true)
            )
          ].amount = action.payload.amount;
        }
      }

      setToStorage({
        ...state,
        materials: [...stateMaterialsCopy],
      });
      return {
        ...state,
        materials: [...stateMaterialsCopy],
      };
    case "SET_BUFFER_AMOUNT":
      var stateBufferMaterialsCopy = state.bufferMaterials.map((value) => ({...value}));
      var stateMaterialsCopy = state.materials.map((value) => ({ ...value }));
      

      if (stateMaterialsCopy.length === 0) {
        line_row_id_front = 1;
        if(stateBufferMaterialsCopy.length >= 1){
          let line_id_values = stateBufferMaterialsCopy.map((item) => {
            return item.line_row_id_front;
          });
          let line_id_max = Math.max(...line_id_values);
          line_row_id_front = line_id_max + 1;
        }
      } else if (stateMaterialsCopy.length >= 1) {
        let line_id_values = stateMaterialsCopy.map((item) => {
          return item.line_row_id_front;
        });
        let line_id_max = Math.max(...line_id_values);
        line_row_id_front = line_id_max + 1;
        if(stateBufferMaterialsCopy.length >= 1){
          let line_id_values = stateBufferMaterialsCopy.map((item) => {
            return item.line_row_id_front;
          });
          let line_id_max = Math.max(...line_id_values);
          line_row_id_front = line_id_max + 1;
        }
      } 

      if (action.payload.amount > 0) {
        if (
          !state.bufferMaterials.find((item) =>
            isSelectedMaterial(item, action.payload)
          )
        ) {
          stateBufferMaterialsCopy.push({
            ...action.payload,
            amount: action.payload.amount,
            changedPrice: 0,
            priceType: "manual",
            line_row_id_front
          });
        } else {
          stateBufferMaterialsCopy[
            state.bufferMaterials.findIndex((item) =>
              isSelectedMaterial(item, action.payload)
            )
          ].amount = action.payload.amount;
        }
      }

      setToStorage({
        ...state,
        bufferMaterials: [...stateBufferMaterialsCopy],
      });
      return {
        ...state,
        bufferMaterials: [...stateBufferMaterialsCopy],
      };

    case "ADD_ITEM":
      var stateMaterialsCopy = state.materials.map((value) => ({ ...value }));
      if (
        !state.materials.find((item) =>
          isSelectedMaterial(item, action.payload)
        )
      ) {
        stateMaterialsCopy.push({
          ...action.payload,
          amount: 1,
          changedPrice: 0,
          priceType: "manual",
        });
      }

      setToStorage({
        ...state,
        materials: [...stateMaterialsCopy],
      });
      return {
        ...state,
        materials: [...stateMaterialsCopy],
      };
    case "ADD_TO_BUFFER":
      var stateBufferMaterialsCopy = state.bufferMaterials.map((value) => ({...value}));
      var stateMaterialsCopy = state.materials.map((value) => ({ ...value }));
      line_row_id_front = -1;
      if (stateMaterialsCopy.length === 0) {
        line_row_id_front = 1;
        if(stateBufferMaterialsCopy.length >= 1){
          let line_id_values = stateBufferMaterialsCopy.map((item) => {
            return item.line_row_id_front;
          });
          let line_id_max = Math.max(...line_id_values);
          line_row_id_front = line_id_max + 1;
        }
      } else if (stateMaterialsCopy.length >= 1) {
        let line_id_values = stateMaterialsCopy.map((item) => {
          return item.line_row_id_front;
        });
        let line_id_max = Math.max(...line_id_values);
        line_row_id_front = line_id_max + 1;
        if(stateBufferMaterialsCopy.length >= 1){
          let line_id_values = stateBufferMaterialsCopy.map((item) => {
            return item.line_row_id_front;
          });
          let line_id_max = Math.max(...line_id_values);
          line_row_id_front = line_id_max + 1;
        }

        console.log('line_row_id_front', line_row_id_front)
      } 



      if (
        !state.bufferMaterials.find((item) =>
          isSelectedMaterial(item, action.payload)
        )
      ) {
        stateBufferMaterialsCopy.push({
          ...action.payload,
          amount: 1,
          changedPrice: 0,
          priceType: "manual",
          line_row_id_front,
        });
      }
      setToStorage({
        ...state,
        bufferMaterials: [...stateBufferMaterialsCopy],
      });
      return {
        ...state,
        bufferMaterials: [...stateBufferMaterialsCopy],
      };
    case "REMOVE_ITEM":
      console.log('action payload',action.payload)
      setToStorage({
        ...state,
        materials: [
          ...state.materials.filter(
            (item) => item.line_row_id_front !== action.payload.line_row_id_front
          ),
        ],
      });
      return {
        ...state,
        materials: [
          ...state.materials.filter(
            (item) => item.line_row_id_front !== action.payload.line_row_id_front
          ),
        ],
      };
    case "REMOVE_FROM_BUFFER":
      setToStorage({
        ...state,
        bufferMaterials: [
          ...state.bufferMaterials.filter(
            (item) => !isSelectedMaterial(item, action.payload)
          ),
        ],
      });
      return {
        ...state,
        bufferMaterials: [
          ...state.bufferMaterials.filter(
            (item) => !isSelectedMaterial(item, action.payload)
          ),
        ],
      };
    case "INCREASE":
      var stateMaterialsCopy = state.materials.map((value) => ({ ...value }));

      stateMaterialsCopy[
        state.materials.findIndex((item) =>
          isSelectedMaterial(item, action.payload, true)
        )
      ].amount += 1;

      // console.log(stateMaterialsCopy  )

      setToStorage({
        ...state,
        materials: [...stateMaterialsCopy],
      });
      return {
        ...state,
        materials: [...stateMaterialsCopy],
      };
    case "INCREASE_BUFFER_MATERIAL":
      var stateBufferMaterialsCopy = state.bufferMaterials.map((value) => ({
        ...value,
      }));
      stateBufferMaterialsCopy[
        state.bufferMaterials.findIndex((item) =>
          isSelectedMaterial(item, action.payload)
        )
      ].amount += 1;

  

      setToStorage({
        ...state,
        bufferMaterials: [...stateBufferMaterialsCopy],
      });
      return {
        ...state,
        bufferMaterials: [...stateBufferMaterialsCopy],
      };
    case "DECREASE":
      var stateMaterialsCopy = state.materials.map((value) => ({ ...value }));
      stateMaterialsCopy[
        state.materials.findIndex((item) => isSelectedMaterial(item, action.payload, true))
      ].amount -= 1;


      setToStorage({
        ...state,
        materials: [...stateMaterialsCopy],
      });
      return {
        ...state,
        materials: [...stateMaterialsCopy],
      };
    case "DECREASE_BUFFER_MATERIAL":
      var stateBufferMaterialsCopy = state.bufferMaterials.map((value) => ({
        ...value,
      }));
      stateBufferMaterialsCopy[
        state.bufferMaterials.findIndex((item) =>
          isSelectedMaterial(item, action.payload)
        )
      ].amount -= 1;

      setToStorage({
        ...state,
        bufferMaterials: [...stateBufferMaterialsCopy],
      });
      return {
        ...state,
        bufferMaterials: [...stateBufferMaterialsCopy],
      };
    case "CHANGE_PRICE":
      var stateMaterialsCopy = state.materials.map((value) => ({ ...value }));
      stateMaterialsCopy[
        state.materials.findIndex((item) => isSelectedMaterial(item, action.payload, true))
      ].changedPrice = action.newPrice;

      setToStorage({
        ...state,
        materials: [...stateMaterialsCopy],
      });
      return {
        ...state,
        materials: [...stateMaterialsCopy],
      };
    case "CHANGE_PRICE_TYPE":
      var stateMaterialsCopy = state.materials.map((value) => ({ ...value }));
      stateMaterialsCopy[
        state.materials.findIndex((item) => isSelectedMaterial(item, action.payload, true))
      ].priceType = action.priceType;

      setToStorage({
        ...state,
        materials: [...stateMaterialsCopy],
      });
      return {
        ...state,
        materials: [...stateMaterialsCopy],
      };
    case "SET_MATERIAL_DESCRIPTION":
      var stateMaterialsCopy = state.materials.map((value) => ({ ...value }));
      stateMaterialsCopy[
        state.materials.findIndex((item) => isSelectedMaterial(item, action.payload, true))
      ].ord_line_desc = action.description;

      //       console.log('check', 
      //   stateMaterialsCopy.filter((item: any) => (
      //     item.line_row_id_front === action.payload.line_row_id_front
      //   ))
      // )

      //   console.log('materials desc', stateMaterialsCopy)
    
      setToStorage({
        ...state,
        materials: [...stateMaterialsCopy],
      });
      return {
        ...state,
        materials: [...stateMaterialsCopy],
      };

    case "CLEAR":
      setToStorage({
        ...state,
        materials: [],
      });
      return {
        ...state,
        materials: [],
      };
    case "CLEAR_BUFFER":
      setToStorage({
        ...state,
        bufferMaterials: [],
      });
      return {
        ...state,
        bufferMaterials: [],
      };
    case "MOVE_TO_MATERIALS":
      var stateBufferMaterialsCopy = state.bufferMaterials.map((value) => ({
        ...value,
      }));
      var stateMaterialsCopy = state.materials.map((value) => ({ ...value }));
      setToStorage({
        ...state,
        materials: [...stateMaterialsCopy, ...stateBufferMaterialsCopy],
        bufferMaterials: [],
      });
      return {
        ...state,
        materials: [...stateMaterialsCopy, ...stateBufferMaterialsCopy],
        bufferMaterials: [],
      };

    case "SET_GENERATED_CODE":
      setToStorage({
        ...state,
        orderGeneratedCode: action.payload,
      });
      return {
        ...state,
        orderGeneratedCode: action.payload,
      };
    case "SET_MATERIAL_DATA":
      setToStorage({
        ...state,
        materials: [...action.payload.materials],
        orderGeneratedCode: action.payload.orderGeneratedCode,
        editMode: true,
        editableOrderGuid: action.payload.editableOrderGuid,
      });
      return {
        ...state,
        materials: [...action.payload.materials],
        orderGeneratedCode: action.payload.orderGeneratedCode,
        editMode: true,
        editableOrderGuid: action.payload.editableOrderGuid,
      };
    case "SET_EDIT_MODE":
      setToStorage({
        ...state,
        editMode: action.payload,
      });
      return {
        ...state,
        editMode: action.payload,
      };
    case "SET_ADD_MATERIALS":
      setToStorage({
        ...state,
        addMaterials: action.payload,
      });
      return {
        ...state,
        addMaterials: action.payload,
      };
    case "CLOSE_EDIT_MODE":
      setToStorage({
        ...state,
        editMode: false,
        addMaterials: false,
        editableOrderGuid: "",
        orderGeneratedCode: "",
        materials: [],
        startTime: moment().format("YYYY-MM-DDTHH:mm"),
        endTime: moment().add(1, "days").format("YYYY-MM-DDTHH:mm"),
        warehouse: { label: "", value: "" },
        client: { label: "", value: "" },
        status: { label: "", value: "" },
        orderNote: "",
      });
      return {
        ...state,
        editMode: false,
        addMaterials: false,
        editableOrderGuid: "",
        orderGeneratedCode: "",
        materials: [],
        startTime: moment().format("YYYY-MM-DDTHH:mm"),
        endTime: moment().add(1, "days").format("YYYY-MM-DDTHH:mm"),
        warehouse: { label: "", value: "" },
        client: { label: "", value: "" },
        status: { label: "", value: "" },
        orderNote: "",
      };

    case "SET_START_TIME":
      setToStorage({
        ...state,
        startTime: action.payload,
      });
      return {
        ...state,
        startTime: action.payload,
      };
    case "SET_END_TIME":
      setToStorage({
        ...state,
        endTime: action.payload,
      });
      return {
        ...state,
        endTime: action.payload,
      };
    case "SET_WAREHOUSE":
      setToStorage({
        ...state,
        warehouse: action.payload,
      });
      return {
        ...state,
        warehouse: action.payload,
      };
    case "SET_CLIENT":
      setToStorage({
        ...state,
        client: action.payload,
      });
      return {
        ...state,
        client: action.payload,
      };
    case "SET_STATUS":
      setToStorage({
        ...state,
        status: action.payload,
      });
      return {
        ...state,
        status: action.payload,
      };
    case "SET_ORDER_NOTE":
      setToStorage({
        ...state,
        orderNote: action.payload,
      });
      return {
        ...state,
        orderNote: action.payload,
      };

    default:
      return state;
  }
};

export default MaterialReducer;
