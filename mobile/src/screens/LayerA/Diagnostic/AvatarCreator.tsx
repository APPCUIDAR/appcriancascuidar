import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AvatarCreator'>;

export default function AvatarCreator() {
    const navigation = useNavigation<NavigationProp>();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<'boy' | 'girl' | null>(null);

    const handleSave = () => {
        if (!name || !age || !gender) {
            Alert.alert('Ops!', 'Por favor, preencha todos os campos para criar seu herói!');
            return;
        }

        // MOCK: Envio para Supabase. Em produção:
        // await supabase.from('users').update({ metadata: { name, age, gender } }).eq('id', user.id);
        Alert.alert('Perfil Criado', 'Seu herói está pronto para as aventuras!', [
            { text: 'Jogar', onPress: () => navigation.navigate('DiagnosticHub' as any) }
        ]);
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Crie seu Herói</Text>

                <View style={styles.avatarSelection}>
                    <TouchableOpacity
                        style={[styles.avatarBtn, gender === 'boy' && styles.avatarBtnActive]}
                        onPress={() => setGender('boy')}
                    >
                        <Text style={styles.avatarEmoji}>👦</Text>
                        <Text style={styles.avatarText}>Menino</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.avatarBtn, gender === 'girl' && styles.avatarBtnActive]}
                        onPress={() => setGender('girl')}
                    >
                        <Text style={styles.avatarEmoji}>👧</Text>
                        <Text style={styles.avatarText}>Menina</Text>
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Como é o seu nome?"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#999"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Quantos anos você tem?"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                />

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>Começar Aventura! 🚀</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E3F2FD' },
    scroll: { padding: 24, alignItems: 'center', flexGrow: 1, justifyContent: 'center' },
    title: { fontSize: 32, fontWeight: 'bold', color: '#1565C0', marginBottom: 40 },
    avatarSelection: { flexDirection: 'row', gap: 20, marginBottom: 40 },
    avatarBtn: { padding: 20, backgroundColor: '#FFF', borderRadius: 20, alignItems: 'center', width: 120, elevation: 3 },
    avatarBtnActive: { borderWidth: 4, borderColor: '#1976D2', transform: [{ scale: 1.05 }] },
    avatarEmoji: { fontSize: 60, marginBottom: 10 },
    avatarText: { fontSize: 18, fontWeight: 'bold', color: '#555' },
    input: { width: '100%', backgroundColor: '#FFF', padding: 16, borderRadius: 12, fontSize: 18, marginBottom: 20, color: '#333', elevation: 2 },
    saveBtn: { marginTop: 20, backgroundColor: '#4CAF50', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 30, elevation: 5 },
    saveBtnText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' }
});
