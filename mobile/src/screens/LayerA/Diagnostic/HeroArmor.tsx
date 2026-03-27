import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from 'react-native';

const { width, height } = Dimensions.get('window');

const ARMOR_PIECES = [
    { id: 'chest', label: 'Peitoral Mágico', emoji: '🛡️', color: '#03A9F4' },
    { id: 'underwear', label: 'Cinto Protetor', emoji: '🩲', color: '#F44336' },
    { id: 'helmet', label: 'Capacete Solar', emoji: '⛑️', color: '#FFC107' },
];

export default function HeroArmor() {
    const [dressed, setDressed] = useState<string[]>([]);
    const [showQuestion, setShowQuestion] = useState(false);

    const equip = (id: string) => {
        if (!dressed.includes(id)) {
            setDressed([...dressed, id]);
        }
        if (dressed.length + 1 === ARMOR_PIECES.length) {
            setTimeout(() => setShowQuestion(true), 1000);
        }
    };

    const handleAnswer = (anwser: 'sim' | 'nao') => {
        if (anwser === 'sim') {
            // Logic for diagnostic_data level Critical Alert
            Alert.alert(
                'Alerta Crítico [ADMIN VISIBLE]',
                'A criança respondeu SIM para pedido de retirar roupa para foto/massagem. Disparando webhook para Dashboard e Conselho.'
            );
        } else {
            Alert.alert('Muito bem!', 'Sua armadura é só sua!');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Super Herói</Text>
            <Text style={styles.subtitle}>Vista o herói com a Armadura Inviolável!</Text>

            <View style={styles.heroStand}>
                <View style={[styles.heroPart, { backgroundColor: dressed.includes('helmet') ? '#FFC107' : '#E0E0E0' }]}>
                    <Text style={styles.partLabel}>{dressed.includes('helmet') ? '⛑️' : 'Cabeça'}</Text>
                </View>
                <View style={[styles.heroPart, { height: 100, backgroundColor: dressed.includes('chest') ? '#03A9F4' : '#E0E0E0', marginTop: 10 }]}>
                    <Text style={styles.partLabel}>{dressed.includes('chest') ? '🛡️' : 'Peito'}</Text>
                </View>
                <View style={[styles.heroPart, { backgroundColor: dressed.includes('underwear') ? '#F44336' : '#E0E0E0', marginTop: 10 }]}>
                    <Text style={styles.partLabel}>{dressed.includes('underwear') ? '🩲' : 'Parte Íntima'}</Text>
                </View>
            </View>

            <View style={styles.inventory}>
                {ARMOR_PIECES.map(piece => (
                    <TouchableOpacity
                        key={piece.id}
                        style={[styles.armorBtn, dressed.includes(piece.id) && { opacity: 0.3 }]}
                        onPress={() => equip(piece.id)}
                        disabled={dressed.includes(piece.id)}
                    >
                        <Text style={styles.armorEmoji}>{piece.emoji}</Text>
                        <Text style={styles.armorText}>{piece.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {showQuestion && (
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalEmoji}>📸</Text>
                        <Text style={styles.modalText}>
                            Alguém já pediu para você tirar sua armadura para tirar uma foto ou fazer uma massagem?
                        </Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={[styles.btn, { backgroundColor: '#F44336' }]} onPress={() => handleAnswer('sim')}>
                                <Text style={styles.btnText}>SIM</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, { backgroundColor: '#4CAF50' }]} onPress={() => handleAnswer('nao')}>
                                <Text style={styles.btnText}>NÃO</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E3F2FD', alignItems: 'center', padding: 20 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#D32F2F', marginTop: 20 },
    subtitle: { fontSize: 18, color: '#1976D2', marginBottom: 40, fontWeight: 'bold' },
    heroStand: { width: 150, alignItems: 'center', marginBottom: 50 },
    heroPart: { width: 100, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 4 },
    partLabel: { fontSize: 30 },
    inventory: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15 },
    armorBtn: { width: width * 0.28, padding: 15, backgroundColor: '#FFF', borderRadius: 15, alignItems: 'center', elevation: 2 },
    armorEmoji: { fontSize: 40, marginBottom: 5 },
    armorText: { fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
    modalBg: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
    modalContent: { width: '85%', backgroundColor: '#FFF', padding: 30, borderRadius: 20, alignItems: 'center' },
    modalEmoji: { fontSize: 60, marginBottom: 20 },
    modalText: { fontSize: 22, color: '#333', textAlign: 'center', fontWeight: 'bold', marginBottom: 30 },
    modalActions: { flexDirection: 'row', gap: 20 },
    btn: { paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30 },
    btnText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' }
});
