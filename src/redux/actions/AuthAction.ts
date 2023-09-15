import { SetAuth } from "../types/AuthTypes";

const setAuth = (isAuthorized: boolean): SetAuth => {
  return {
    type: "SET_IS_AUTHORIZED",
    payload: isAuthorized,
  };
};

const exportDefault = {
   setAuth
};

export default exportDefault;
