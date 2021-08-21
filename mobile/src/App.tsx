import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import AppProvider from './hooks';

import { NavigationContainer } from '@react-navigation/native';

import Routes from './routes';

const App: React.FC = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#312e38" />
      <NavigationContainer>
        <AppProvider>
          <Routes />
        </AppProvider>
      </NavigationContainer>
    </>
  );
};

export default App;
