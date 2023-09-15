// import { initReactQueryAuth } from "react-query-auth";
// import AuthService from "@app/services/auth/auth";
// import { storage } from "@app/utils/storage";
// import { LoginType } from "@app/types/user";
// import { AxiosError } from "axios";

// export async function handleUserResponse(data: { token: any; user: any }) {
//   const { token, user } = data;

//   storage.setToken(token);
//   return user;
// }

// async function loadUser() {
//   let user = null;
//   if (storage.getToken()) {
//     await AuthService.profile()
//       .then((data) => {
//         user = data;
//       })
//       .catch((err: AxiosError) => {
//         if (err.response?.status == 401) {
//           storage.clearToken();
//         }
//       });
//   }
//   return user;
// }

// async function loginFn(data: LoginType) {
//   const response = await AuthService.login(data);
//   const user = await handleUserResponse(response);
//   return user;
// }

// async function logoutFn() {
//   await AuthService.logout();
//   storage.clearToken();
// }

// async function registerFn() {}

// const authConfig = {
//   loadUser,
//   loginFn,
//   logoutFn,
//   registerFn,
//   waitInitial: true,
// };

// const { AuthProvider, useAuth } = initReactQueryAuth<any>(authConfig);

// export { AuthProvider, useAuth };
export default null;