import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const EMOJIS = ['🍎', '🍕', '🚀', '⚽'];

export default function FunMath() {
    const [num1, setNum1] = useState(2);
    const [num2, setNum2] = useState(3);
    const [emoji, setEmoji] = useState('🍎');
    const [options, setOptions] = useState<number[]>([]);
    const [score, setScore] = useState(0);

    useEffect(() => {
        generateProblem();
    }, [score]);

    const generateProblem = () => {
        const n1 = Math.floor(Math.random() * 5) + 1;
        const n2 = Math.floor(Math.random() * 5) + 1;
        setNum1(n1);
        setNum2(n2);
        setEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);

        const correct = n1 + n2;
        // Generate answers
        const ops = new Set<number>();
        ops.add(correct);
        while (ops.size < 4) {
            const wrong = correct + Math.floor(Math.random() * 5) - 2;
            if (wrong > 0 && wrong !== correct) {
                ops.add(wrong);
            }
        }
        setOptions(Array.from(ops).sort(() => Math.random() - 0.5));
    };

    const answer = (val: number) => {
        if (val === num1 + num2) {
            setScore(s => s + 1);
        } else {
            Alert.alert('Ops!', 'Tente Novamente', [{ text: 'OK' }]);
        }
    };

    const renderEmojis = (count: number) => {
        return Array(count).fill(emoji).join('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Matemática Divertida</Text>
            <Text style={styles.scoreText}>Estrelas: {'⭐'.repeat(Math.min(score, 5))}{score > 5 && ` (${score})`}</Text>

            <View style={styles.problemContainer}>
                <View style={styles.problemRow}>
                    <Text style={styles.problemEmoji}>{renderEmojis(num1)}</Text>
                    <Text style={styles.problemText}>{num1}</Text>
                </View>
                <Text style={styles.operatorText}>+</Text>
                <View style={styles.problemRow}>
                    <Text style={styles.problemEmoji}>{renderEmojis(num2)}</Text>
                    <Text style={styles.problemText}>{num2}</Text>
                </View>
            </View>

            <View style={styles.optionsGrid}>
                {options.map((opt, i) => (
                    <TouchableOpacity key={i} style={styles.optionBtn} onPress={() => answer(opt)}>
                        <Text style={styles.optionText}>{opt}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E8F5E9', alignItems: 'center', padding: 24, justifyContent: 'center' },
    title: { fontSize: 26, fontWeight: 'bold', color: '#2E7D32', marginBottom: 16 },
    scoreText: { fontSize: 18, color: '#F57F17', marginBottom: 40, fontWeight: 'bold' },
    problemContainer: { backgroundColor: '#FFF', padding: 24, borderRadius: 16, alignItems: 'center', elevation: 4, width: '100%', marginBottom: 40 },
    problemRow: { alignItems: 'center', marginBottom: 8 },
    problemEmoji: { fontSize: 32, marginBottom: 8 },
    problemText: { fontSize: 32, fontWeight: 'bold', color: '#333' },
    operatorText: { fontSize: 40, fontWeight: 'bold', color: '#4CAF50', marginVertical: 8 },
    optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
    optionBtn: { width: '40%', aspectRatio: 1, backgroundColor: '#4CAF50', alignItems: 'center', justifyContent: 'center', borderRadius: 16, elevation: 2 },
    optionText: { color: '#FFF', fontSize: 48, fontWeight: 'bold' },
});
