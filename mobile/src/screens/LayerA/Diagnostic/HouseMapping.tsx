import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from 'react-native';

const { width } = Dimensions.get('window');

const ROOMS = [
    { id: 'living_room', name: 'Sala', icon: '🛋️' },
    { id: 'parents_room', name: 'Quarto dos Pais', icon: '🛏️' },
    { id: 'kitchen', name: 'Cozinha', icon: '🍳' },
    { id: 'bathroom', name: 'Banheiro', icon: '🚿' },
];

export default function HouseMapping() {
    const [fearRoom, setFearRoom] = useState<string | null>(null);

    const handleRoomSelect = (room: typeof ROOMS[0]) => {
        setFearRoom(room.id);

        // Admin Logic Flag
        if (['parents_room', 'bathroom'].includes(room.id)) {
            Alert.alert(
                'Diagnóstico Lúdico - Admin Flag',
                `ALERTA NÍVEL 2 GERADO: Risco de Local marcado em ${room.name}. Inserindo em diagnostic_data...`
            );
        } else {
            Alert.alert('Diagnóstico Lúdico', `Registro salvo: ${room.name}`);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Casas e Cômodos</Text>

            <View style={styles.baloon}>
                <Text style={styles.baloonText}>
                    "Qual cômodo da casa você tem medo de entrar ou ficar sozinha(o)?" 🏠
                </Text>
            </View>

            <View style={styles.grid}>
                {ROOMS.map(room => (
                    <TouchableOpacity
                        key={room.id}
                        style={[styles.roomCard, fearRoom === room.id && styles.roomCardDangerous]}
                        onPress={() => handleRoomSelect(room)}
                    >
                        <Text style={styles.roomIcon}>{room.icon}</Text>
                        <Text style={styles.roomName}>{room.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF3E0', padding: 20, alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#E65100', marginBottom: 20 },
    baloon: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, borderBottomLeftRadius: 0, elevation: 4, marginBottom: 40, width: '90%' },
    baloonText: { fontSize: 18, color: '#424242', fontStyle: 'italic', fontWeight: '500' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
    roomCard: { width: width * 0.4, aspectRatio: 1, backgroundColor: '#FFE082', borderRadius: 20, alignItems: 'center', justifyContent: 'center', elevation: 2 },
    roomCardDangerous: { backgroundColor: '#FF8A65', borderWidth: 4, borderColor: '#D84315' },
    roomIcon: { fontSize: 50, marginBottom: 10 },
    roomName: { fontSize: 16, fontWeight: 'bold', color: '#5D4037', textAlign: 'center' }
});
