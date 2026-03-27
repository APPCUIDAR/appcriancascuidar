import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'DiagnosticHub'>;

const DIAGNOSTIC_GAMES = [
    { id: '1', name: 'Mapa do Carinho', route: 'TrafficLightMap', color: '#4CAF50', icon: '🚦' },
    { id: '2', name: 'Casas e Cômodos', route: 'HouseMapping', color: '#FF9800', icon: '🏠' },
    { id: '3', name: 'Presentes e Segredos', route: 'GiftsAndSecrets', color: '#9C27B0', icon: '🎁' },
    { id: '4', name: 'Armadura do Herói', route: 'HeroArmor', color: '#03A9F4', icon: '🛡️' },
    { id: '5', name: 'Minhas Emoções', route: 'EmotionFaces', color: '#E91E63', icon: '😀' },
];

export default function DiagnosticHub() {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Jornada de Diagnóstico</Text>

            <ScrollView contentContainerStyle={styles.grid}>
                {DIAGNOSTIC_GAMES.map(item => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.gameCard, { backgroundColor: item.color }]}
                        onPress={() => navigation.navigate(item.route as keyof RootStackParamList)}
                    >
                        <Text style={styles.gameIcon}>{item.icon}</Text>
                        <Text style={styles.gameTitle}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAFAFA', paddingTop: 40 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 20 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, paddingHorizontal: 16 },
    gameCard: { width: '45%', backgroundColor: '#FFF', padding: 24, borderRadius: 20, alignItems: 'center', justifyContent: 'center', elevation: 4, aspectRatio: 1 },
    gameIcon: { fontSize: 40, marginBottom: 12 },
    gameTitle: { fontSize: 14, fontWeight: 'bold', color: '#FFF', textAlign: 'center' }
});
