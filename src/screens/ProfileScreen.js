import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Text, Button } from 'react-native-paper';
import { auth } from '../db/firebase';
import { signOut } from 'firebase/auth';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(auth.currentUser);
  }, []);

  const doSignOut = async () => {
    await signOut(auth);
    navigation.replace('Auth');
  };

  return (
    <View style={styles.container}>
      <Title>Mi Perfil</Title>
      <Text style={{ marginTop: 8 }}>{user?.email}</Text>
      <Button mode="contained" onPress={doSignOut} style={{ marginTop: 16 }}>Cerrar sesión</Button>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 12 } });
