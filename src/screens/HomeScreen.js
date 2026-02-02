import React, { useLayoutEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, Card, Title, Paragraph, IconButton } from 'react-native-paper';

const levels = [
  { id: '7b', label: '7° básico' },
  { id: '8b', label: '8° básico' },
  { id: '1m', label: '1° medio' },
  { id: '2m', label: '2° medio' }
];

export default function HomeScreen({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton icon="account" onPress={() => navigation.navigate('Profile')} />
      )
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={levels}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => navigation.navigate('Level', { level: item.id, label: item.label })}>
            <Card.Content>
              <Title>{item.label}</Title>
              <Paragraph>Repasa vocabulario y pon a prueba lo que sabes.</Paragraph>
              <Button onPress={() => navigation.navigate('Level', { level: item.id, label: item.label })}>Comenzar</Button>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  card: { marginBottom: 12 }
});
