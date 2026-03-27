import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ProgressBarAndroid } from 'react-native';

const PET_EMOJIS = {
    cat: { normal: '🐱', happy: '😸', sad: '😿', dirty: '🙀', hungry: '😽' },
    dog: { normal: '🐶', happy: '🐕', sad: '🥀', dirty: '🐩', hungry: '🥣' },
    rabbit: { normal: '🐰', happy: '🥕', sad: '🐾', dirty: '🐇', hungry: '🥬' }
};

type PetType = 'cat' | 'dog' | 'rabbit';

export default function VirtualPet() {
    const [petType, setPetType] = useState<PetType | null>(null);
    const [hunger, setHunger] = useState(50);
    const [cleanliness, setCleanliness] = useState(50);
    const [happiness, setHappiness] = useState(50);
    const [level, setLevel] = useState(1);

    useEffect(() => {
        if (!petType) return;
        const interval = setInterval(() => {
            setHunger(prev => Math.max(0, prev - 2));
            setCleanliness(prev => Math.max(0, prev - 1));
            setHappiness(prev => Math.max(0, prev - 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [petType]);

    const feed = () => setHunger(prev => Math.min(100, prev + 20));
    const bath = () => setCleanliness(prev => Math.min(100, prev + 30));
    const play = () => {
        setHappiness(prev => Math.min(100, prev + 25));
        setLevel(prev => prev + 0.1);
    };

    const getPetEmoji = () => {
        if (!petType) return '';
        if (hunger < 20) return PET_EMOJIS[petType].hungry;
        if (cleanliness < 20) return PET_EMOJIS[petType].dirty;
        if (happiness < 20) return PET_EMOJIS[petType].sad;
        if (hunger > 80 && happiness > 80) return PET_EMOJIS[petType].happy;
        return PET_EMOJIS[petType].normal;
    };

    if (!petType) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Escolha seu Bichinho!</Text>
                <View style={styles.choiceRow}>
                    <TouchableOpacity style={styles.choiceBtn} onPress={() => setPetType('cat')}><Text style={styles.choiceText}>🐱 Gato</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.choiceBtn} onPress={() => setPetType('dog')}><Text style={styles.choiceText}>🐶 Cachorro</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.choiceBtn} onPress={() => setPetType('rabbit')}><Text style={styles.choiceText}>🐰 Coelho</Text></TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meu Bichinho Virtual (Nvl {Math.floor(level)})</Text>

            <View style={styles.petDisplay}>
                <Text style={styles.petEmoji}>{getPetEmoji()}</Text>
            </View>

            <View style={styles.statusContainer}>
                <Text style={styles.statusLabel}>Fome: {hunger}%</Text>
                <View style={styles.barBg}><View style={[styles.barFill, { width: `${hunger}%`, backgroundColor: '#FF9800' }]} /></View>

                <Text style={styles.statusLabel}>Higiene: {cleanliness}%</Text>
                <View style={styles.barBg}><View style={[styles.barFill, { width: `${cleanliness}%`, backgroundColor: '#03A9F4' }]} /></View>

                <Text style={styles.statusLabel}>Felicidade: {happiness}%</Text>
                <View style={styles.barBg}><View style={[styles.barFill, { width: `${happiness}%`, backgroundColor: '#4CAF50' }]} /></View>
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FF9800' }]} onPress={feed}>
                    <Text style={styles.actionText}>🍎 Alimentar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#03A9F4' }]} onPress={bath}>
                    <Text style={styles.actionText}>🚿 Dar Banho</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#4CAF50' }]} onPress={play}>
                    <Text style={styles.actionText}>🎾 Brincar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF9C4', alignItems: 'center', padding: 24 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 24, textAlign: 'center' },
    choiceRow: { flexDirection: 'row', gap: 16 },
    choiceBtn: { padding: 16, backgroundColor: '#FFF', borderRadius: 16, elevation: 2 },
    choiceText: { fontSize: 18, fontWeight: 'bold' },
    petDisplay: { height: 200, width: 200, backgroundColor: '#FFF', borderRadius: 100, alignItems: 'center', justifyContent: 'center', elevation: 4, marginBottom: 24 },
    petEmoji: { fontSize: 100 },
    statusContainer: { width: '100%', marginBottom: 32 },
    statusLabel: { fontSize: 14, fontWeight: 'bold', color: '#555', marginTop: 8, marginBottom: 4 },
    barBg: { height: 12, backgroundColor: '#E0E0E0', borderRadius: 6, overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: 6 },
    actionRow: { flexDirection: 'row', gap: 12 },
    actionBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 24, elevation: 2 },
    actionText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 }
});
