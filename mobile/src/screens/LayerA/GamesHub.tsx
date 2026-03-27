import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { Calculator } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'GamesHub'>;

const CHILD_GAMES = [
    { id: '1', name: 'Jogo da Memória', route: 'MemoryGame', color: '#FFB6C1', icon: '🧠' },
    { id: '2', name: 'Bichinho Virtual', route: 'VirtualPet', color: '#FFCC80', icon: '🐶' },
    { id: '3', name: 'Desafio das Cores', route: 'Match3', color: '#CE93D8', icon: '🎨' },
    { id: '4', name: 'Matemática Divertida', route: 'FunMath', color: '#A5D6A7', icon: '➕' },
];

const ADULT_GAMES = [
    { id: '5', name: 'Cobra Comilona', route: 'SnakeGame', color: '#4CAF50', icon: '🐍' },
    { id: '6', name: 'Xadrez Clássico', route: 'ChessGame', color: '#90A4AE', icon: '♟' },
    { id: '7', name: 'Sudoku Lógico', route: 'SudokuGame', color: '#64B5F6', icon: '🔢' },
];

const LUDO_THERAPY = [
    { id: '8', name: 'Diagnóstico Play', route: 'AvatarCreator', color: '#F06292', icon: '💖' },
];

export default function GamesHub() {
    const navigation = useNavigation<NavigationProp>();

    const renderGameCard = (item: any) => (
        <TouchableOpacity
            key={item.id}
            style={[styles.gameCard, { backgroundColor: item.color }]}
            onPress={() => navigation.navigate(item.route as keyof RootStackParamList)}
        >
            <Text style={styles.gameIcon}>{item.icon}</Text>
            <Text style={styles.gameTitle}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>PlayKids Hub</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Calculator')} style={styles.discreetButton}>
                    <Calculator size={24} color="#D3D3D3" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.sectionTitle}>Infantil e Lúdico</Text>
                <View style={styles.grid}>
                    {CHILD_GAMES.map(renderGameCard)}
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 24, color: '#D81B60' }]}>Aventuras e Missões (Ludo)</Text>
                <View style={styles.grid}>
                    {LUDO_THERAPY.map(renderGameCard)}
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Adolescente e Clássicos</Text>
                <View style={styles.grid}>
                    {ADULT_GAMES.map(renderGameCard)}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    discreetButton: {
        padding: 8,
    },
    scroll: {
        padding: 16,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#555',
        marginBottom: 16,
        marginLeft: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    gameCard: {
        width: '48%',
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        aspectRatio: 1,
    },
    gameIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    gameTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
});
