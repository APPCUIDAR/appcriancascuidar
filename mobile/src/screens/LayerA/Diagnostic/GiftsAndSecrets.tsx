import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

const SCENARIOS = [
    {
        character: '🐻', name: 'Sr. Urso',
        offer: 'Vou te dar esse celular novo...',
        condition: 'Mas você não pode contar para ninguém. É o nosso segredo!',
        isGrooming: true
    },
    {
        character: '🐰', name: 'Dona Coelha',
        offer: 'Olha o presente da sua festa!',
        condition: 'A mamãe pediu para a gente esconder até a hora do bolo. Shhh!',
        isGrooming: false
    }
];

export default function GiftsAndSecrets() {
    const [current, setCurrent] = useState(0);

    const answer = (isGoodSecret: boolean) => {
        const scenario = SCENARIOS[current];

        // Diagnostic Logic
        if (scenario.isGrooming && isGoodSecret) {
            Alert.alert('Flag de Aliciamento', 'Risco: Sinalizado positiva para segredo condicionado a presente. Enviando para admin.');
        } else {
            Alert.alert('Muito bem!', 'Sempre conte tudo para quem cuida de você de verdade.');
        }

        if (current < SCENARIOS.length - 1) {
            setCurrent(c => c + 1);
        } else {
            Alert.alert('Fim', 'Jogo Finalizado');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Presentes e Segredos</Text>

            <View style={styles.card}>
                <Text style={styles.characterEmoji}>{SCENARIOS[current].character}</Text>
                <Text style={styles.characterName}>{SCENARIOS[current].name} diz:</Text>

                <Text style={styles.dialog}>"{SCENARIOS[current].offer}"</Text>
                <Text style={styles.dialogDanger}>"{SCENARIOS[current].condition}"</Text>
            </View>

            <Text style={styles.question}>Que tipo de segredo é esse?</Text>

            <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.btn, styles.btnGood]} onPress={() => answer(true)}>
                    <Text style={styles.btnEmoji}>🎁</Text>
                    <Text style={styles.btnText}>Segredo Legal (Surpresa)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.btn, styles.btnBad]} onPress={() => answer(false)}>
                    <Text style={styles.btnEmoji}>🪨</Text>
                    <Text style={styles.btnText}>Segredo Ruim (Peso na Barriga)</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E1BEE7', padding: 20, alignItems: 'center' },
    title: { fontSize: 26, fontWeight: 'bold', color: '#6A1B9A', marginBottom: 30 },
    card: { backgroundColor: '#FFF', padding: 30, borderRadius: 24, alignItems: 'center', width: '95%', elevation: 5, marginBottom: 30 },
    characterEmoji: { fontSize: 80, marginBottom: 10 },
    characterName: { fontSize: 18, fontWeight: 'bold', color: '#7B1FA2', marginBottom: 20 },
    dialog: { fontSize: 20, textAlign: 'center', color: '#333', marginBottom: 10, fontStyle: 'italic' },
    dialogDanger: { fontSize: 20, textAlign: 'center', color: '#D32F2F', fontWeight: 'bold', fontStyle: 'italic' },
    question: { fontSize: 22, fontWeight: 'bold', color: '#4A148C', marginBottom: 20 },
    actionRow: { flexDirection: 'column', width: '100%', gap: 16 },
    btn: { flexDirection: 'row', padding: 20, borderRadius: 16, alignItems: 'center', elevation: 3 },
    btnGood: { backgroundColor: '#81C784' },
    btnBad: { backgroundColor: '#E57373' },
    btnEmoji: { fontSize: 30, marginRight: 15 },
    btnText: { fontSize: 16, fontWeight: 'bold', color: '#FFF' }
});
