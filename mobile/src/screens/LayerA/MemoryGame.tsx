import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';

const EMOJIS = ['🐶', '🐱', '🐰', '🦊', '🐼', '🐨', '🐮', '🐷'];
const PAIRS = [...EMOJIS, ...EMOJIS];

interface CardData {
    id: number;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
}

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48 - 3 * 16) / 4;

export default function MemoryGame() {
    const [cards, setCards] = useState<CardData[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matches, setMatches] = useState(0);

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        const shuffled = [...PAIRS].sort(() => Math.random() - 0.5);
        setCards(shuffled.map((emoji, index) => ({
            id: index,
            emoji,
            isFlipped: false,
            isMatched: false,
        })));
        setFlippedCards([]);
        setMatches(0);
    };

    const handleCardPress = (index: number) => {
        if (flippedCards.length === 2) return;
        if (cards[index].isFlipped || cards[index].isMatched) return;

        const newFlipped = [...flippedCards, index];
        setFlippedCards(newFlipped);

        setCards(prev => {
            const newCards = [...prev];
            newCards[index].isFlipped = true;
            return newCards;
        });

        if (newFlipped.length === 2) {
            const [first, second] = newFlipped;
            if (cards[first].emoji === cards[index].emoji) {
                // Match found
                setTimeout(() => {
                    setCards(prev => {
                        const newCards = [...prev];
                        newCards[first].isMatched = true;
                        newCards[index].isMatched = true;
                        return newCards;
                    });
                    setFlippedCards([]);
                    setMatches(m => {
                        const newMatches = m + 1;
                        if (newMatches === EMOJIS.length) {
                            Alert.alert('Parabéns!', 'Você encontrou todos os pares.', [
                                { text: 'Jogar Novamente', onPress: initializeGame }
                            ]);
                        }
                        return newMatches;
                    });
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    setCards(prev => {
                        const newCards = [...prev];
                        newCards[first].isFlipped = false;
                        newCards[index].isFlipped = false;
                        return newCards;
                    });
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Jogo da Memória</Text>
            <Text style={styles.score}>Pares: {matches} / {EMOJIS.length}</Text>
            <View style={styles.grid}>
                {cards.map((card, index) => (
                    <TouchableOpacity
                        key={card.id}
                        style={[styles.card, (card.isFlipped || card.isMatched) ? styles.cardFlipped : null]}
                        onPress={() => handleCardPress(index)}
                    >
                        <Text style={styles.cardText}>
                            {(card.isFlipped || card.isMatched) ? card.emoji : '❓'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={styles.resetButton} onPress={initializeGame}>
                <Text style={styles.resetText}>Reiniciar Jogo</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    score: {
        fontSize: 18,
        color: '#666',
        marginBottom: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'center',
    },
    card: {
        width: CARD_SIZE,
        height: CARD_SIZE,
        backgroundColor: '#FFB6C1',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    cardFlipped: {
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#FFB6C1',
    },
    cardText: {
        fontSize: CARD_SIZE * 0.5,
    },
    resetButton: {
        marginTop: 32,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#4CAF50',
        borderRadius: 24,
    },
    resetText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
