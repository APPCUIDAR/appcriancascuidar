import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';

const { width } = Dimensions.get('window');

const BODY_PARTS = [
    { id: 'head', label: 'Cabeça', top: 30, left: 100 },
    { id: 'chest', label: 'Peito', top: 110, left: 100 },
    { id: 'belly', label: 'Barriga', top: 170, left: 100 },
    { id: 'private', label: 'Parte Íntima', top: 220, left: 100 },
    { id: 'legs', label: 'Pernas', top: 300, left: 100 },
    { id: 'arms', label: 'Braços', top: 140, left: 30 },
];

const COLORS = [
    { code: '#4CAF50', mean: 'Carinho Legal', name: 'green' },
    { code: '#FFEB3B', mean: 'Atenção/Não Gosto', name: 'yellow' },
    { code: '#F44336', mean: 'Proibido', name: 'red' },
];

export default function TrafficLightMap() {
    const [selectedColor, setSelectedColor] = useState<typeof COLORS[0] | null>(null);
    const [markedParts, setMarkedParts] = useState<Record<string, string>>({});

    const handlePressPart = (part: typeof BODY_PARTS[0]) => {
        if (!selectedColor) {
            Alert.alert('Escolha uma Cor!', 'Selecione se é um carinho legal verde, meio chato amarelo ou proibido vermelho!');
            return;
        }

        setMarkedParts(prev => ({
            ...prev,
            [part.id]: selectedColor.code,
        }));

        // Data flow simulado para o DB - Nível Diagnostic Data
        console.log(`Diagnostic Flag: ${part.id} painted ${selectedColor.name}`);

        if (part.id === 'private' && selectedColor.name !== 'red') {
            Alert.alert('Alerta Admin', 'Flag Nível Crítico: Confusão/Inversão no mapa corporal privado. (Enviando pro Supabase...)');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mapa do Carinho</Text>
            <Text style={styles.subtitle}>Como você se sente quando alguém toca nestas partes?</Text>

            {/* Paleta de Cores */}
            <View style={styles.paletteContainer}>
                {COLORS.map(c => (
                    <TouchableOpacity
                        key={c.name}
                        style={[styles.btnColor, { backgroundColor: c.code }, selectedColor?.name === c.name && styles.btnColorSelected]}
                        onPress={() => setSelectedColor(c)}
                    >
                        <Text style={styles.colorText}>{c.mean}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Boneco Interativo Mock (Para React Native Puro / Position Absolute) */}
            <View style={styles.bodyContainer}>
                {BODY_PARTS.map(part => (
                    <TouchableOpacity
                        key={part.id}
                        style={[
                            styles.partTouch,
                            { top: part.top, left: part.left, backgroundColor: markedParts[part.id] || '#E0E0E0' }
                        ]}
                        onPress={() => handlePressPart(part)}
                    >
                        <Text style={styles.partLabel}>{part.label}</Text>
                    </TouchableOpacity>
                ))}
                {/* Helper Right Arm */}
                <TouchableOpacity
                    style={[
                        styles.partTouch,
                        { top: 140, left: 170, backgroundColor: markedParts['arms'] || '#E0E0E0' }
                    ]}
                    onPress={() => handlePressPart(BODY_PARTS.find(p => p.id === 'arms')!)}
                >
                    <Text style={styles.partLabel}>Arm</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF', padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#1565C0', textAlign: 'center', marginBottom: 10 },
    subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
    paletteContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 40 },
    btnColor: { padding: 10, borderRadius: 20, elevation: 3, width: '30%', alignItems: 'center' },
    btnColorSelected: { borderWidth: 3, borderColor: '#333', transform: [{ scale: 1.1 }] },
    colorText: { fontSize: 12, fontWeight: 'bold', color: '#333', textAlign: 'center' },
    bodyContainer: { width: 300, height: 400, alignSelf: 'center', position: 'relative', backgroundColor: '#F5F5F5', borderRadius: 20, overflow: 'hidden' },
    partTouch: { position: 'absolute', padding: 15, borderRadius: 30, elevation: 2, alignItems: 'center', justifyContent: 'center' },
    partLabel: { fontSize: 12, fontWeight: 'bold', color: '#333' }
});
