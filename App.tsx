import { StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';

import { RealmProvider } from '@realm/react';

import { Routes } from '@routes/index';

import { AuthContextProvider } from '@contexts/AuthContext';

import { THEME } from './src/theme';

import { Loading } from '@components/Loading';
// import { RealmProvider } from '@libs/realm/schemas';
import { GroupSchema } from '@libs/realm/schemas/GroupSchema';
import { ExerciseSchema } from '@libs/realm/schemas/ExerciseSchema';

// import { useEffect } from 'react';
// import { Realm } from '@realm/react';


// function deleteRealmDatabase() {
//   const realmPath = Realm.defaultPath; // Caminho do banco de dados padrão

//   try {
//     // Excluir o banco de dados Realm usando o método correto
//     Realm.deleteFile({ path: realmPath });
//     console.log('Banco de dados Realm excluído com sucesso.');
//   } catch (error) {
//     console.error('Erro ao excluir o banco de dados Realm:', error);
//   }
// }


export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  // Use o useEffect para deletar o banco de dados na inicialização

  // useEffect(() => {
  //   deleteRealmDatabase(); // Excluir o banco ao iniciar o app
  // }, []);

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {/* <RealmProvider> */}
      <RealmProvider schema={[GroupSchema, ExerciseSchema]} deleteRealmIfMigrationNeeded={true}>
        <AuthContextProvider>
          {fontsLoaded ? <Routes /> : <Loading />}
        </AuthContextProvider>
      </RealmProvider>
      {/* </RealmProvider> */}
    </NativeBaseProvider>
  );
}
