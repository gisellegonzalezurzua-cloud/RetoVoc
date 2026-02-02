import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { db } from '../db/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import Flashcard from '../components/Flashcard';

export default function FlashcardsScreen({ route }) {
  const { level } = route.params;
  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'words'), where('nivel', '==', level), orderBy('palabra'));
    const unsub = onSnapshot(q, snap => {
      const arr = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setWords(arr);
      setIndex(0);
    });
    return () => unsub();
  }, [level]);

  const next = () => { if (index < words.length - 1) setIndex(index + 1); };
  const prev = () => { if (index > 0) setIndex(index - 1); };

  if (words.length === 0) return <View style={styles.center}><Text>No hay palabras en este nivel.</Text></View>;

  return (
    <View style={styles.container}>
      <Flashcard item={words[index]} />
      <View style={styles.controls}>
        <Button onPress={prev} disabled={index === 0}>Anterior</Button>
        <Text style={styles.counter}>{index + 1} / {words.length}</Text>
        <Button onPress={next} disabled={index === words.length - 1}>Siguiente</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 }, controls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 }, center: { flex: 1, alignItems: 'center', justifyContent: 'center' }, counter: { alignSelf: 'center' } });
