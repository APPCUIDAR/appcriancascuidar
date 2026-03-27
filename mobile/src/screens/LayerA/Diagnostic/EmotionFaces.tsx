import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';

const FAMILY_MEMBERS = [
    { id: 'dad', label: 'Papai', icon: '👨' },
    { id: 'mom', label: 'Mamãe', icon: '👩' },
    { id: 'uncle', label: 'Tio', icon: '🧔‍♂️' },
    { id: 'grandpa', label: 'Vovô', icon: '👴' },
];

const EMOTIONS = [
    { id: 'happy', emoji: '😁', name: 'Animada', color: '#4CAF50', score: 1 },
    { id: 'neutral', emoji: '😐', name: 'Indiferente', color: '#9E9E9E', score: 0 },
    { id: 'scared', emoji: '😨', name: 'Assustada', color: '#FF9800', score: -1 },
    { id: 'sad', emoji: '😢', name: 'Triste', color: '#2196F3', score: -0.5 },
];

export default function EmotionFaces() {
    const [currentMember, setCurrentMember] = useState(0);
    const [results, setResults] = useState<Record<string, number>>({});

    const handleEmotionSelect = (emotion: typeof EMOTIONS[0]) => {
        const member = FAMILY_MEMBERS[currentMember];

        // Logic for Análise de Sentimento (Admin Data)
        const newResults = { ...results, [member.id]: emotion.score };
        setResults(newResults);

        if (emotion.score < 0) {
            console.log(`[SYS ADMIN] Discrepância Negativa de Risco para Familiar: ${member.id}`);
        }

        if (currentMember < FAMILY_MEMBERS.length - 1) {
            setCurrentMember(curr => curr + 1);
        } else {
            Alert.alert('Fim', 'Obrigado por jogar! (Gerando Relatório de Risco Familiar p/ Admin)');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cartões de Emoção</Text>

            <View style={styles.card}>
                <Text style={styles.questionText}>
                    "Como você se sente quando o(a) {FAMILY_MEMBERS[currentMember].label} chega em casa?"
                </Text>

                <View style={styles.memberAvatar}>
                    <Text style={styles.memberEmoji}>{FAMILY_MEMBERS[currentMember].icon}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.emotionsContainer}>
                {EMOTIONS.map(emotion => (
                    <TouchableOpacity
                        key={emotion.id}
                        style={[styles.emotionBtn, { borderColor: emotion.color }]}
                        onPress={() => handleEmotionSelect(emotion)}
                    >
                        <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
                        <Text style={[styles.emotionName, { color: emotion.color }]}>{emotion.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAFAFA', alignItems: 'center', paddingTop: 40 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#424242', marginBottom: 20 },
    card: { width: '90%', backgroundColor: '#FFF', padding: 30, borderRadius: 20, alignItems: 'center', elevation: 5, marginBottom: 40 },
    questionText: { fontSize: 20, color: '#333', textAlign: 'center', fontWeight: 'bold', marginBottom: 30 },
    memberAvatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', elevation: 2 },
    memberEmoji: { fontSize: 60 },
    emotionsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15, paddingHorizontal: 10 },
    emotionBtn: { width: '45%', backgroundColor: '#FFF', padding: 20, borderRadius: 15, alignItems: 'center', borderWidth: 2, elevation: 1 },
    emotionEmoji: { fontSize: 40, marginBottom: 10 },
    emotionName: { fontSize: 16, fontWeight: 'bold' }
});
