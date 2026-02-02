import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, RadioButton, Card, Title } from 'react-native-paper';
import { db } from '../db/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

function shuffle(arr) { return arr.sort(() => Math.random() - 0.5); }

export default function QuizScreen({ route }) {
  const { level } = route.params;
  const [words, setWords] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'words'), where('nivel', '==', level), orderBy('palabra'));
    const unsub = onSnapshot(q, snap => {
      const arr = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setWords(arr);
      setQIndex(0);
      setScore(0);
      setFinished(false);
    });
    return () => unsub();
  }, [level]);

  useEffect(() => {
    if (!words.length) return;
    // Build options: correct definition and 3 random other definitions
    const correct = words[qIndex % words.length];
    const others = words.filter(w => w.id !== correct.id);
    const distractors = shuffle(others).slice(0, 3).map(d => d.palabra);
    setOptions(shuffle([correct.palabra, ...distractors]));
    setSelected(null);
  }, [qIndex, words]);

  const submit = () => {
    if (!selected) return;
    const correct = words[qIndex].palabra;
    if (selected === correct) setScore(score + 1);
    if (qIndex + 1 >= words.length) {
      setFinished(true);
    } else {
      setQIndex(qIndex + 1);
    }
  };

  if (!words.length) return <View style={styles.center}><Text>No hay palabras en este nivel.</Text></View>;
  if (finished) return <View style={styles.center}><Title>Terminaste</Title><Text>Tu puntaje: {score} / {words.length}</Text></View>;

  return (
    <View style={styles.container}>
      <Card style={{ margin: 12 }}>
        <Card.Content>
          <Title>¿Cuál es la palabra que corresponde?</Title>
          <Text style={{ marginTop: 8 }}>{words[qIndex].definicion}</Text>
        </Card.Content>
      </Card>

      <RadioButton.Group onValueChange={value => setSelected(value)} value={selected}>
        {options.map(opt => (
          <Card key={opt} style={{ marginHorizontal: 12, marginBottom: 8 }}>
            <Card.Content>
              <RadioButton.Item label={opt} value={opt} />
            </Card.Content>
          </Card>
        ))}
      </RadioButton.Group>

      <Button mode="contained" onPress={submit} style={{ margin: 12 }}>Confirmar</Button>

      <Text style={{ marginLeft: 12 }}>Pregunta {qIndex + 1} / {words.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 }, center: { flex: 1, alignItems: 'center', justifyContent: 'center' } });
