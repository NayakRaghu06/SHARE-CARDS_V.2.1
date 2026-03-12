
import React, { useEffect } from 'react';
   import { NavigationContainer } from '@react-navigation/native';
   import AppNavigator from './src/navigation/AppNavigator';
   import { createTables } from './src/database/schema';
   import { InboxProvider } from './src/context/InboxContext';

   export default function App() {

     useEffect(() => {
       createTables();
       console.log("Database initialized ✅");
     }, []);

     return (
       <InboxProvider>
         <NavigationContainer>
           <AppNavigator />
         </NavigationContainer>
       </InboxProvider>
     );
   }