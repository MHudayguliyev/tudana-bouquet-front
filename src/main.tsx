import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

// redux
import { Provider } from "react-redux";
import store from '@redux/store';

// for translation
import i18n from "./libs/i18";
import { I18nextProvider } from "react-i18next";

import "./assets/boxicons-2.0.7/css/boxicons.min.css";
import "./styles/global.scss";
import "./styles/theme.scss";
import "./styles/fonts.scss";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </I18nextProvider>
    </Provider>
  </React.StrictMode>
)
