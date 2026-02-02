import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { auth, db, createUserProfile } from '../db/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // 'student' or 'teacher'
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    if (!email || !password) return Alert.alert('Error', 'Ingresa email y contraseña');
    setLoading(true);
    try {
      const resp = await signInWithEmailAndPassword(auth, email, password);
      const uid = resp.user.uid;
      const userSnap = await getDoc(doc(db, 'users', uid));
      const userRole = userSnap.exists() ? userSnap.data().role : role;
      navigation.replace(userRole === 'teacher' ? 'Admin' : 'Home');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message);
    } finally { setLoading(false); }
  };

  const signUp = async () => {
    if (!email || !password) return Alert.alert('Error', 'Ingresa email y contraseña');
    setLoading(true);
    try {
      const resp = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', resp.user.uid), { role, email });
      navigation.replace(role === 'teacher' ? 'Admin' : 'Home');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message);
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a RetoVoc</Text>
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <TextInput label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

      <RadioButton.Group onValueChange={newValue => setRole(newValue)} value={role}>
        <View style={styles.row}><RadioButton value="student" /><Text>Estudiante</Text></View>
        <View style={styles.row}><RadioButton value="teacher" /><Text>Docente / Admin</Text></View>
      </RadioButton.Group>

      <Button mode="contained" onPress={signIn} style={styles.button} loading={loading}>Iniciar sesión</Button>
      <Button mode="outlined" onPress={signUp} style={styles.button} disabled={loading}>Crear cuenta</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: { marginBottom: 12 },
  button: { marginTop: 8 },
  title: { fontSize: 22, marginBottom: 20, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 }
});
