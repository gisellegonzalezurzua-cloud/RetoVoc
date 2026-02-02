import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, Card, TextInput, Title, Menu, Divider, Text } from 'react-native-paper';
import { db } from '../db/firebase';
import { collection, addDoc, onSnapshot, query, where, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const levels = [
  { id: '7b', label: '7° básico' },
  { id: '8b', label: '8° básico' },
  { id: '1m', label: '1° medio' },
  { id: '2m', label: '2° medio' }
];

export default function AdminScreen() {
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('7° básico');
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'words'), where('nivel', '==', selectedLevel), orderBy('palabra'));
    const unsub = onSnapshot(q, snap => {
      const arr = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setWords(arr);
    }, err => console.error(err));
    return () => unsub();
  }, [selectedLevel]);

  const addWord = async () => {
    if (!newWord.trim()) return;
    const item = { palabra: newWord.trim(), definicion: 'Definición pendiente', ejemplo: '', nivel: selectedLevel };
    try {
      await addDoc(collection(db, 'words'), item);
      setNewWord('');
    } catch (err) { console.error(err); }
  };

  const deleteWord = async (id) => {
    try { await deleteDoc(doc(db, 'words', id)); } catch (err) { console.error(err); }
  };

  const updateWord = async (id, updates) => {
    try { await updateDoc(doc(db, 'words', id), updates); } catch (err) { console.error(err); }
  };

  return (
    <View style={styles.container}>
      <Title>Gestión de vocabulario</Title>

      <Menu visible={menuVisible} onDismiss={() => setMenuVisible(false)} anchor={<Button mode="outlined" onPress={() => setMenuVisible(true)}>{selectedLevel}</Button>}>
        {levels.map(l => (
          <Menu.Item key={l.id} onPress={() => { setSelectedLevel(l.label); setMenuVisible(false); }} title={l.label} />
        ))}
      </Menu>

      <TextInput label="Nueva palabra" value={newWord} onChangeText={setNewWord} style={{ marginBottom: 8 }} />
      <Button mode="contained" onPress={addWord}>Agregar</Button>

      <FlatList
        data={words}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.palabra} subtitle={item.nivel} />
            <Card.Content>
              <Text>{item.definicion}</Text>
            </Card.Content>
            <Card.Actions>
              <Button compact onPress={() => updateWord(item.id, { definicion: item.definicion })}>Editar</Button>
              <Button compact onPress={() => deleteWord(item.id)}>Eliminar</Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 12 }, card: { marginTop: 8 } });
