import { InitialStateType } from "@app/redux/types/MaterialTypes";
import moment from "moment";

const TOKEN_LOCALSTORAGE_KEY = "token";
export const tokenStorage = {
  getToken: () => {
    let parsed;
    const token = window.localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);
    if (token !== null) {
      parsed = JSON.parse(token);
      return parsed;
    } else {
      return null;
    }
  },
  setToken: (token: string) =>
    window.localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, JSON.stringify(token)),
  clearToken: () => window.localStorage.removeItem(TOKEN_LOCALSTORAGE_KEY),
};


export const setToStorage = (storage: InitialStateType | undefined) => {
  if (storage)
    localStorage.setItem('storage', JSON.stringify(storage));
}

export const getFromStorage = (): InitialStateType => {
  if (localStorage.getItem('storage') !== null)
    return JSON.parse(localStorage.getItem('storage')!)
  else return {
    materials: [],
    bufferMaterials: [],
    orderGeneratedCode: '',
    editMode: false,
    addMaterials: false,
    editableOrderGuid: '',

    startTime: moment().format('YYYY-MM-DDTHH:mm'),
    endTime: moment().add(1, 'days').format('YYYY-MM-DDTHH:mm'),
    warehouse: { label: '', value: '' },
    client: { label: '', value: '' },
    status: { label: '', value: '' },
    orderNote: '',
  }
}