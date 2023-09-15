import { MaterialList } from "@app/api/Types/queryReturnTypes";

export function capitalize(str: string) {
   return str.split(' ').map(item => item[0].toUpperCase() + item.substring(1, item.length)).join(' ')
}

export const toRem = (value: number): string => {
   return (value / 16) + 'rem';;
}

export const setCookie = (name: string, value: string, days: number) => {
   var expires = "";
   if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
   }
   document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export const getCookie = (name: string) => {
   var nameEQ = name + "=";
   var ca = document.cookie.split(';');
   for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
   }
   return null;
}

export const convertToValidDatePostgresqlTimestamp = (date: string) => {
   const res = date.split(/\D/);
   return `${res[2]}.${res[1]}.${res[0]} ${res[3]}:${res[4]}`
}

export const convertToValidDateForInputField = (date: string) => {
   const res = date.split(/\D/);
   return `${res[0]}-${res[1]}-${res[2]}T${res[3]}:${res[4]}`
}

export const isEmpty = (value: any) => {
   if (typeof value === 'string')
      return value.trim() === ''
   else
      return isNaN(value) || value === null || value === undefined
}

export const isSelectedMaterial = (material: MaterialList, data: MaterialList, sec: boolean = false) => {
   if (sec) {
      return material.line_row_id_front === data.line_row_id_front
   } else {
      return material.row_id === data.row_id
   }
}

export const sortArray = (array: any, key: string, sortBy: string) => {
   let response: any = []
   if (array) {
      if (sortBy === 'ASC') {
         response = array.slice(0)
         response.sort((a: any, b: any) => a[key] < b[key] ? 1 : -1)
         return response
      } else if (sortBy === 'DESC') {
         response = array.slice(0)
         response.sort((a: any, b: any) => a[key] > b[key] ? 1 : -1)
         return response
      }
   }
}

export const getDate = (date?: any) => {
   let startDate, endDate;
   if (!date) {
      const date = new Date()
      startDate = new Date(date.getFullYear(), date.getMonth(), 1)
      endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
   } else {
      startDate = new Date(date.getFullYear(), date.getMonth(), 1)
      endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
   }

   return { startDate, endDate }
}


export const toDataURL = (url: string) => fetch(url)
   .then(response => response.blob())
   .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
   }))


export const dataURLtoFile = (dataurl: any, filename: any) => {
   var arr = dataurl?.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
   while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
   }
   return new File([u8arr], filename, { type: mime });
}


export const deleteFileFromArray = (fileArray: File[], fileToDelete: File) => {
   const index = fileArray.indexOf(fileToDelete);
   fileArray.splice(index, 1);
   return fileArray;
}

export const fileToURL = (file: File) => {
   return URL.createObjectURL(file)
}

export const getImageNameFromURL = (url: string) => {
   const parts = url.split('/');
   const filename = parts[parts.length - 1];
   return filename;
}

export const getImageName = (filename: string) => {
   const dotIndex = filename.lastIndexOf(".");
   if (dotIndex === -1) {
      return filename;
   }
   return filename.substring(0, dotIndex);
}