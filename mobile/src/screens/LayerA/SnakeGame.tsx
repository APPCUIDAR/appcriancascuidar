import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Alert } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const BOARD_SIZE = 20;
const CELL_SIZE = width * 0.9 / BOARD_SIZE;

const randomFood = () => ({
    x: Math.floor(Math.random() * BOARD_SIZE),
    y: Math.floor(Math.random() * BOARD_SIZE),
});

export default function SnakeGame() {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [direction, setDirection] = useState({ x: 0, y: -1 });
    const [food, setFood] = useState(randomFood());
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (isGameOver) return;
        const updateGame = setInterval(() => {
            setSnake((prev) => {
                const head = { x: prev[0].x + direction.x, y: prev[0].y + direction.y };

                // Game Over Conditions
                if (
                    head.x < 0 || head.y < 0 ||
                    head.x >= BOARD_SIZE || head.y >= BOARD_SIZE ||
                    prev.some((segment) => segment.x === head.x && segment.y === head.y)
                ) {
                    setIsGameOver(true);
                    return prev;
                }

                const newSnake = [head, ...prev];
                if (head.x === food.x && head.y === food.y) {
                    setScore(s => s + 10);
                    setFood(randomFood());
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        }, 200);

        return () => clearInterval(updateGame);
    }, [direction, food, isGameOver]);

    const onGestureEvent = (event: any) => {
        const { translationX, translationY } = event.nativeEvent;
        if (Math.abs(translationX) > Math.abs(translationY)) {
            if (translationX > 0 && direction.x === 0) setDirection({ x: 1, y: 0 });
            else if (translationX < 0 && direction.x === 0) setDirection({ x: -1, y: 0 });
        } else {
            if (translationY > 0 && direction.y === 0) setDirection({ x: 0, y: 1 });
            else if (translationY < 0 && direction.y === 0) setDirection({ x: 0, y: -1 });
        }
    };

    const restart = () => {
        setSnake([{ x: 10, y: 10 }]);
        setDirection({ x: 0, y: -1 });
        setFood(randomFood());
        setIsGameOver(false);
        setScore(0);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cobra Comilona</Text>
            <Text style={styles.score}>Pontos: {score}</Text>

            <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onGestureEvent}>
                <View style={styles.board}>
                    {snake.map((segment, index) => (
                        <View
                            key={index}
                            style={[
                                styles.snakeSegment,
                                { left: segment.x * CELL_SIZE, top: segment.y * CELL_SIZE },
                            ]}
                        />
                    ))}
                    <View
                        style={[
                            styles.food,
                            { left: food.x * CELL_SIZE, top: food.y * CELL_SIZE },
                        ]}
                    />
                </View>
            </PanGestureHandler>

            {isGameOver && (
                <View style={styles.gameOverOverlay}>
                    <Text style={styles.gameOverText}>Fim de Jogo!</Text>
                    <TouchableOpacity style={styles.restartBtn} onPress={restart}>
                        <Text style={styles.restartText}>Recomeçar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#212121', alignItems: 'center', paddingTop: 40 },
    title: { fontSize: 28, color: '#4CAF50', fontWeight: 'bold' },
    score: { fontSize: 20, color: '#FFF', marginBottom: 20 },
    board: { width: width * 0.9, height: width * 0.9, backgroundColor: '#333', position: 'relative', overflow: 'hidden' },
    snakeSegment: { position: 'absolute', width: CELL_SIZE, height: CELL_SIZE, backgroundColor: '#4CAF50' },
    food: { position: 'absolute', width: CELL_SIZE, height: CELL_SIZE, backgroundColor: '#F44336', borderRadius: CELL_SIZE / 2 },
    gameOverOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
    gameOverText: { color: '#F44336', fontSize: 36, fontWeight: 'bold', marginBottom: 20 },
    restartBtn: { backgroundColor: '#4CAF50', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25 },
    restartText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
