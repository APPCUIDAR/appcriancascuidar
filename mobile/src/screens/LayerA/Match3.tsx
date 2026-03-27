import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';

const COLORS = ['#FF5722', '#4CAF50', '#03A9F4', '#FFC107', '#9C27B0'];
const GRID_SIZE = 6;
const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 48) / GRID_SIZE;

interface Tile {
    id: string;
    color: string;
}

const generateTile = () => ({
    id: Math.random().toString(36).substr(2, 9),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
});

export default function Match3() {
    const [grid, setGrid] = useState<Tile[][]>([]);
    const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        initializeGrid();
    }, []);

    const initializeGrid = () => {
        let newGrid: Tile[][] = [];
        for (let r = 0; r < GRID_SIZE; r++) {
            let row: Tile[] = [];
            for (let c = 0; c < GRID_SIZE; c++) row.push(generateTile());
            newGrid.push(row);
        }
        setGrid(newGrid);
    };

    const handlePress = (r: number, c: number) => {
        if (!selected) {
            setSelected({ r, c });
            return;
        }

        // Check if adjacent
        const isAdjacent = Math.abs(selected.r - r) + Math.abs(selected.c - c) === 1;
        if (isAdjacent) {
            // Swap
            const newGrid = [...grid];
            const temp = newGrid[selected.r][selected.c];
            newGrid[selected.r][selected.c] = newGrid[r][c];
            newGrid[r][c] = temp;

            setGrid(newGrid);
            setSelected(null);
            // Mock score for simulation
            setScore(prev => prev + 10);
        } else {
            setSelected({ r, c });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Desafio das Cores</Text>
            <Text style={styles.score}>Pontos: {score}</Text>

            <View style={styles.gridContainer}>
                {grid.map((row, r) => (
                    <View key={`row_${r}`} style={styles.row}>
                        {row.map((tile, c) => (
                            <TouchableOpacity
                                key={tile.id}
                                style={[
                                    styles.cell,
                                    { backgroundColor: tile.color },
                                    selected?.r === r && selected?.c === c && styles.selectedCell
                                ]}
                                onPress={() => handlePress(r, c)}
                            />
                        ))}
                    </View>
                ))}
            </View>

            <TouchableOpacity style={styles.resetBtn} onPress={initializeGrid}>
                <Text style={styles.resetText}>Recomeçar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E3F2FD', alignItems: 'center', padding: 24 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 16 },
    score: { fontSize: 20, color: '#0277BD', marginBottom: 24, fontWeight: 'bold' },
    gridContainer: { backgroundColor: '#FFF', padding: 4, borderRadius: 12, elevation: 4 },
    row: { flexDirection: 'row' },
    cell: { width: CELL_SIZE - 4, height: CELL_SIZE - 4, margin: 2, borderRadius: 8 },
    selectedCell: { borderWidth: 3, borderColor: '#333', opacity: 0.8 },
    resetBtn: { marginTop: 32, backgroundColor: '#FF5252', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24 },
    resetText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
