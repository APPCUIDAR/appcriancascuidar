import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { Chess } from 'chess.js';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width * 0.95;
const SQUARE_SIZE = BOARD_SIZE / 8;

export default function ChessGame() {
    const [game, setGame] = useState(new Chess());
    const [board, setBoard] = useState(game.board());
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

    useEffect(() => {
        if (game.isGameOver()) {
            Alert.alert('Fim de Jogo!', game.isCheckmate() ? 'Xeque-mate!' : 'Empate!');
            return;
        }

        if (game.turn() === 'b') {
            // AI Move (Random)
            setTimeout(() => {
                const moves = game.moves();
                if (moves.length > 0) {
                    const randomMove = moves[Math.floor(Math.random() * moves.length)];
                    game.move(randomMove);
                    setBoard(game.board());
                }
            }, 500);
        }
    }, [board]);

    const onSquarePress = (row: number, col: number) => {
        if (game.turn() === 'b') return; // Wait for AI

        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const rank = 8 - row;
        const file = files[col];
        const squareRef = `${file}${rank}`;

        if (selectedSquare) {
            if (selectedSquare === squareRef) {
                setSelectedSquare(null);
                return;
            }

            try {
                const move = game.move({ from: selectedSquare, to: squareRef, promotion: 'q' });
                if (move) {
                    setBoard(game.board());
                    setSelectedSquare(null);
                } else {
                    // If valid piece clicked instead
                    const piece = game.get(squareRef as any);
                    if (piece && piece.color === 'w') {
                        setSelectedSquare(squareRef);
                    } else {
                        setSelectedSquare(null);
                    }
                }
            } catch {
                const piece = game.get(squareRef as any);
                if (piece && piece.color === 'w') {
                    setSelectedSquare(squareRef);
                } else {
                    setSelectedSquare(null);
                }
            }
        } else {
            const piece = game.get(squareRef as any);
            if (piece && piece.color === 'w') {
                setSelectedSquare(squareRef);
            }
        }
    };

    const getPieceSymbol = (piece: any) => {
        if (!piece) return '';
        const symbols: any = {
            p: piece.color === 'w' ? '♙' : '♟',
            r: piece.color === 'w' ? '♖' : '♜',
            n: piece.color === 'w' ? '♘' : '♞',
            b: piece.color === 'w' ? '♗' : '♝',
            q: piece.color === 'w' ? '♕' : '♛',
            k: piece.color === 'w' ? '♔' : '♚',
        };
        return symbols[piece.type];
    };

    const resetGame = () => {
        const newGame = new Chess();
        setGame(newGame);
        setBoard(newGame.board());
        setSelectedSquare(null);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Xadrez</Text>
            <Text style={styles.turnText}>{game.turn() === 'w' ? 'Sua Vez (Brancas)' : 'IA Pensando...'}</Text>

            <View style={styles.board}>
                {board.map((row, rIdx) => (
                    <View key={rIdx} style={styles.row}>
                        {row.map((square, cIdx) => {
                            const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
                            const squareRef = `${files[cIdx]}${8 - rIdx}`;
                            const isDark = (rIdx + cIdx) % 2 === 1;
                            const isSelected = selectedSquare === squareRef;
                            return (
                                <TouchableOpacity
                                    key={cIdx}
                                    style={[
                                        styles.square,
                                        { backgroundColor: isDark ? '#769656' : '#eeeed2' },
                                        isSelected && styles.selectedSquare,
                                    ]}
                                    onPress={() => onSquarePress(rIdx, cIdx)}
                                >
                                    <Text style={[styles.pieceText, { color: square?.color === 'w' ? '#FFF' : '#000' }]}>
                                        {getPieceSymbol(square)}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </View>

            <TouchableOpacity style={styles.resetBtn} onPress={resetGame}>
                <Text style={styles.resetText}>Recomeçar Jogo</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAFAFA', alignItems: 'center', paddingTop: 40 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    turnText: { fontSize: 18, color: '#666', marginBottom: 20 },
    board: { width: BOARD_SIZE, height: BOARD_SIZE, elevation: 5, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5 },
    row: { flexDirection: 'row', flex: 1 },
    square: { width: SQUARE_SIZE, height: SQUARE_SIZE, justifyContent: 'center', alignItems: 'center' },
    selectedSquare: { borderWidth: 3, borderColor: '#FFEB3B' },
    pieceText: { fontSize: SQUARE_SIZE * 0.7, fontWeight: 'bold' },
    resetBtn: { marginTop: 40, backgroundColor: '#333', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
    resetText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
