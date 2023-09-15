import React from "react";

import { Route } from "@tanstack/react-location";
// pages
import Dashboard from "@app/pages/Dashboard";
import Login from "@app/pages/Login/Login";
import OrdersPage from "@app/pages/OrdersPage/OrdersPage";
import Authmiddleware from "./AuthMiddleware";
import MakeOrder from "@app/pages/MakeOrder/MakeOrder";
import AddMaterials from "@app/pages/AddMaterials/AddMaterials";
import ClientsPage from "@app/pages/ClientsPage/ClientsPage";
import Products from '@app/pages/Products/Products'
import SettingsPage from "@app/pages/SettingsPage/SettingsPage";
import GroupsPage from "@app/pages/GroupsPage/GroupsPage";

const routes: Route[] = [
   {
      path: '/',
      element: (
         <Authmiddleware>
            <Dashboard />
         </Authmiddleware>
      )
   },
   {
      path: 'customers',
      element: (
         <Authmiddleware>
            customers
         </Authmiddleware>
      )
   },
   {
      path: 'orders',
      children: [
         {
            path: '/',
            element: (
               <Authmiddleware>
                  <OrdersPage />
               </Authmiddleware>
            ),
         },
         {
            path: 'make-order',
            children: [
               {
                  path: '/',
                  element: (
                     <Authmiddleware>
                        <MakeOrder />
                     </Authmiddleware>
                  )
               },
               {
                  path: ':orderGuid',
                  element: (
                     <Authmiddleware>
                        <MakeOrder />
                     </Authmiddleware>
                  )
               }
            ]
         },
      ]
   },
   // {
   //    path: 'make-order',
   //    element: (
   //       <Authmiddleware>
   //          <MakeOrder />
   //       </Authmiddleware>
   //    )
   // },
   {
      path: 'add-materials',
      element: (
         <Authmiddleware>
            <AddMaterials />
         </Authmiddleware>
      )
   },
   {
      path: 'products',
      element: (
         <Authmiddleware>
            <Products />
         </Authmiddleware>
      )
   },
   {
      path: 'groups',
      element: (
         <Authmiddleware>
            <GroupsPage />
         </Authmiddleware>
      )
   },
   {
      path: 'contacts',
      element: (
         <Authmiddleware>
            <ClientsPage />
         </Authmiddleware>
      )
   },
   {
      path: 'settings',
      element: (
         <Authmiddleware>
            <SettingsPage />
         </Authmiddleware>
      )
   },
   {
      path: '/login',
      element: <Login />
   },
]

export default routes;