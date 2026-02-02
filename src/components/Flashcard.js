import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Paragraph, Title } from 'react-native-paper';

export default function Flashcard({ item }) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.palabra}</Title>
        {item.imagen ? <Image source={{ uri: item.imagen }} style={styles.image} /> : null}
        <Paragraph style={styles.def}>{item.definicion}</Paragraph>
        {item.ejemplo ? <Paragraph style={styles.ejemplo}>Ej.: {item.ejemplo}</Paragraph> : null}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { margin: 12 },
  image: { width: '100%', height: 140, resizeMode: 'cover', marginTop: 8 },
  def: { marginTop: 8 },
  ejemplo: { marginTop: 6, fontStyle: 'italic' }
});
