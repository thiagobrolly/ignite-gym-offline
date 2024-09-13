import React from 'react';
import { Box, Text, HStack, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';

export function OfflineBanner() {
  const netInfo = NetInfo.useNetInfo();

  // Verifica se está offline
  const isOffline = netInfo.isConnected === false;

  if (!isOffline) {
    return null; // Não renderiza nada se estiver online
  }

  return (
    <Box bg="red.500" p={3}>
      <HStack alignItems="center" justifyContent="center">
        <Icon as={MaterialIcons} name="wifi-off" color="white" size="sm" />
        <Text color="white" fontSize="md" ml={2}>
          Você está offline
        </Text>
      </HStack>
    </Box>
  );
}
