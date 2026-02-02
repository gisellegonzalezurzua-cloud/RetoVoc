import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { db } from '../db/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export default function LevelScreen({ route, navigation }) {
  const { level, label } = route.params;
  const nivelLabel = label || level;
  const [words, setWords] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'words'), where('nivel', '==', nivelLabel), orderBy('palabra'));
    const unsub = onSnapshot(q, snap => {
      const arr = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setWords(arr);
    });
    return () => unsub();
  }, [nivelLabel]);

  return (
    <View style={styles.container}>
      <Title>{nivelLabel}</Title>
      <Paragraph>{words.length} palabras disponibles</Paragraph>

      <Button mode="contained" onPress={() => navigation.navigate('Flashcards', { level: nivelLabel })} style={{ marginTop: 8 }}>Flashcards</Button>
      <Button mode="outlined" onPress={() => navigation.navigate('Quiz', { level: nivelLabel })} style={{ marginTop: 8 }}>Quiz</Button>

      <FlatList
        data={words}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.palabra} subtitle={item.asignatura || item.nivel} />
            <Card.Content>
              <Paragraph numberOfLines={2}>{item.definicion}</Paragraph>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 12 }, card: { marginTop: 8 } });
