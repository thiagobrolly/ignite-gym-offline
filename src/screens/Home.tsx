import { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FlatList, Heading, HStack, Text, useToast, VStack } from 'native-base';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { ExerciseDTO } from '@dtos/ExerciseDTO';

import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { ExerciseCard } from '@components/ExerciseCard';

import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { Loading } from '@components/Loading';
import { useQuery, useRealm } from '@realm/react';
import { UpdateMode } from 'realm';

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [groupSelected, setGroupSelected] = useState('antebraço');

  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const realm = useRealm();
  const savedGroups = useQuery('Group'); // Query para buscar os grupos salvos no Realm
  const savedExercises = useQuery('Exercise'); // Query para buscar os exercícios salvos no Realm

  const [groups, setGroups] = useState<string[]>(
    savedGroups.map((group) => group.name),
  );
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);

  function handleOpenExerciseDetails(exerciseId: string) {
    navigation.navigate('exercise', { exerciseId });
  }

  async function fetchGroups() {
    try {
      const response = await api.get('/groups');
      setGroups(response.data);

      // Salvar os grupos no Realm
      realm.write(() => {
        response.data.forEach((groupName: string) => {
          realm.create('Group', { name: groupName });
        });
      });
    } catch (error) {
      if (savedGroups.length > 0) {
        toast.show({
          title: 'Mostrando grupos salvos offline.',
          placement: 'top',
          bgColor: 'yellow.500',
        });
      } else {
        const isAppError = error instanceof AppError;
        const title = isAppError
          ? error.message
          : 'Não foi possível carregar os grupos musculares';
        toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500',
        });
      }
    }
  }

  async function fetchExercisesByGroup() {
    try {
      setIsLoading(true);
      console.log(`Fetching exercises for group: ${groupSelected}`);
      
      const response = await api.get(`/exercises/bygroup/${groupSelected}`);
      console.log('Response data:', response.data);
  
      if (response.data && Array.isArray(response.data)) {

        // Verifique a estrutura dos dados retornados
    response.data.forEach((exercise: any) => {
      // Se algum campo esperado como string for um número, converta-o
      if (typeof exercise.id !== 'string') {
        exercise.id = String(exercise.id);
      }
      if (typeof exercise.name !== 'string') {
        exercise.name = String(exercise.name);
      }
      if (typeof exercise.groupId !== 'string') {
        exercise.groupId = String(exercise.groupId);
      }
    });
        setExercises(response.data);
  
        // Salvar os dados no Realm
        realm.write(() => {
          response.data.forEach((exercise: ExerciseDTO) => {
            realm.create(
              'Exercise',
              { ...exercise, groupId: groupSelected },
              UpdateMode.Modified
            );
          });
        });
  
        console.log('Exercícios salvos com sucesso:', response.data);
      } else {
        throw new Error('Resposta da API não está no formato esperado.');
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
      const savedGroupExercises = savedExercises.filtered(
        `groupId = "${groupSelected}"`
      );
  
      if (savedGroupExercises.length > 0) {
        setExercises(savedGroupExercises);
        toast.show({
          title: 'Mostrando exercícios salvos offline.',
          placement: 'top',
          bgColor: 'yellow.500',
        });
      } else {
        const isAppError = error instanceof AppError;
        const title = isAppError
          ? error.message
          : 'Não foi possível carregar os exercícios';
        toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }
  

  console.log('Todos os exercícios salvos no Realm:', savedExercises); // Verifique o que está sendo salvo

  useEffect(() => {
    fetchGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup();
    }, [groupSelected]),
  );

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={
              groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()
            }
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{
          px: 8,
        }}
        my={10}
        maxH={10}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack px={8}>
          <HStack justifyContent="space-between" mb={5}>
            <Heading color="gray.200" fontSize="md" fontFamily="heading">
              Exercícios
            </Heading>

            <Text color="gray.200" fontSize="sm">
              {exercises.length}
            </Text>
          </HStack>

          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExerciseCard
                onPress={() => handleOpenExerciseDetails(item.id)}
                data={item}
              />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{
              paddingBottom: 20,
            }}
          />
        </VStack>
      )}
    </VStack>
  );
}
