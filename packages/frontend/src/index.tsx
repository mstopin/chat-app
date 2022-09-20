import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

import theme from './theme';

import { SessionUserLoader } from './utils/SessionUserLoader';

import { UserContextProvider } from './hooks/useUser';

import { Router } from './router';

const container = document.querySelector('#root') as HTMLElement;
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <UserContextProvider>
        <SessionUserLoader>
          <Router />
        </SessionUserLoader>
      </UserContextProvider>
    </ChakraProvider>
  </React.StrictMode>
);
