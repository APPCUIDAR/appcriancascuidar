import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { getSudoku } from 'sudoku-gen';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width * 0.9;
const CELL_SIZE = BOARD_SIZE / 9;

interface Puzzle {
    puzzle: string[];
    solution: string[];
}

export default function SudokuGame() {
    const [board, setBoard] = useState<string[][]>([]);
    const [original, setOriginal] = useState<string[][]>([]);
    const [solution, setSolution] = useState<string[][]>([]);
    const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
    const [difficulty, setDifficulty] = useState('easy');

    useEffect(() => {
        generateNewPuzzle();
    }, [difficulty]);

    const generateNewPuzzle = () => {
        const s = getSudoku(difficulty as any);
        const pz = s.puzzle.split('');
        const sol = s.solution.split('');

        let b: string[][] = [];
        let o: string[][] = [];
        let sl: string[][] = [];

        for (let i = 0; i < 9; i++) {
            b[i] = []; o[i] = []; sl[i] = [];
            for (let j = 0; j < 9; j++) {
                const char = pz[i * 9 + j];
                const val = char === '-' ? '' : char;
                b[i][j] = val;
                o[i][j] = val;
                sl[i][j] = sol[i * 9 + j];
            }
        }
        setBoard(b);
        setOriginal(o);
        setSolution(sl);
        setSelectedCell(null);
    };

    const handleInput = (num: string) => {
        if (!selectedCell) return;
        const { r, c } = selectedCell;

        if (original[r][c] !== '') return; // Original cell

        const newBoard = [...board];
        newBoard[r] = [...newBoard[r]];
        newBoard[r][c] = num === 'C' ? '' : num;
        setBoard(newBoard);

        // Check completion
        if (newBoard.every((row, i) => row.every((val, j) => val === solution[i][j]))) {
            Alert.alert('Parabéns!', 'Você resolveu o Sudoku!', [
                { text: 'Novo Jogo', onPress: generateNewPuzzle }
            ]);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sudoku</Text>

            <View style={styles.diffRow}>
                {['easy', 'medium', 'hard'].map(level => (
                    <TouchableOpacity
                        key={level} style={[styles.diffBtn, difficulty === level && styles.diffBtnActive]}
                        onPress={() => setDifficulty(level)}
                    >
                        <Text style={[styles.diffText, difficulty === level && styles.diffTextActive]}>{level.toUpperCase()}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.board}>
                {board.map((row, r) => (
                    <View key={`row_${r}`} style={styles.row}>
                        {row.map((cell, c) => {
                            const isOriginal = original[r][c] !== '';
                            const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                            const borderRightWidth = c === 2 || c === 5 ? 2 : 1;
                            const borderBottomWidth = r === 2 || r === 5 ? 2 : 1;

                            return (
                                <TouchableOpacity
                                    key={`cell_${r}_${c}`}
                                    style={[
                                        styles.cell,
                                        { borderRightWidth, borderBottomWidth },
                                        isSelected && styles.cellSelected,
                                        isOriginal && styles.cellOriginal
                                    ]}
                                    onPress={() => setSelectedCell({ r, c })}
                                >
                                    <Text style={[styles.cellText, isOriginal && styles.cellTextOriginal]}>{cell}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </View>

            <View style={styles.numpad}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C'].map(btn => (
                    <TouchableOpacity key={btn} style={styles.numBtn} onPress={() => handleInput(btn.toString())}>
                        <Text style={styles.numText}>{btn}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF', alignItems: 'center', paddingTop: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    diffRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    diffBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#EEE' },
    diffBtnActive: { backgroundColor: '#333' },
    diffText: { fontSize: 12, fontWeight: 'bold', color: '#666' },
    diffTextActive: { color: '#FFF' },
    board: { width: BOARD_SIZE, height: BOARD_SIZE, borderWidth: 2, borderColor: '#333' },
    row: { flexDirection: 'row', flex: 1 },
    cell: { flex: 1, borderColor: '#CCC', borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
    cellOriginal: { backgroundColor: '#F5F5F5' },
    cellSelected: { backgroundColor: '#BBDEFB' },
    cellText: { fontSize: 18, color: '#1976D2' },
    cellTextOriginal: { color: '#333', fontWeight: 'bold' },
    numpad: { flexDirection: 'row', flexWrap: 'wrap', width: BOARD_SIZE, gap: 5, justifyContent: 'center', marginTop: 30 },
    numBtn: { width: BOARD_SIZE / 5 - 10, paddingVertical: 15, alignItems: 'center', backgroundColor: '#E0E0E0', borderRadius: 8 },
    numText: { fontSize: 20, fontWeight: 'bold', color: '#333' },
});
