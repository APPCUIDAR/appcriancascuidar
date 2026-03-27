import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useAppStore } from '../../store/useAppStore';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = width / 4 - 16;
const SECRET_PIN = '1305';

export default function Calculator() {
    const [display, setDisplay] = useState('0');
    const [expression, setExpression] = useState('');
    const unlockLayerB = useAppStore((state) => state.unlockLayerB);

    const handlePress = (value: string) => {
        if (value === 'C') {
            setDisplay('0');
            setExpression('');
            return;
        }

        if (value === '=') {
            if (display === SECRET_PIN || expression === SECRET_PIN) {
                unlockLayerB();
            } else {
                try {
                    // A very simple math evaluation for the calculator, just to be functional
                    // eslint-disable-next-line no-eval
                    const result = eval(expression || display);
                    setDisplay(String(result));
                    setExpression('');
                } catch {
                    setDisplay('Error');
                }
            }
            return;
        }

        if (['+', '-', '*', '/'].includes(value)) {
            setExpression((prev) => (prev ? prev + value : display + value));
            setDisplay('0');
            return;
        }

        if (display === '0') {
            setDisplay(value);
            setExpression((prev) => prev + value);
        } else {
            setDisplay(display + value);
            setExpression((prev) => prev + value);
        }
    };

    const getButtonColor = (btn: string) => {
        if (btn === 'C' || btn === '=') return '#FF9800';
        if (['+', '-', '*', '/'].includes(btn)) return '#03A9F4';
        return '#E0E0E0';
    };

    const buttons = [
        '7', '8', '9', '/',
        '4', '5', '6', '*',
        '1', '2', '3', '-',
        'C', '0', '=', '+'
    ];

    return (
        <View style={styles.container}>
            <View style={styles.displayContainer}>
                <Text style={styles.expressionText}>{expression}</Text>
                <Text style={styles.displayText} numberOfLines={1}>{display}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                {buttons.map((btn) => (
                    <TouchableOpacity
                        key={btn}
                        style={[styles.button, { backgroundColor: getButtonColor(btn) }]}
                        onPress={() => handlePress(btn)}
                    >
                        <Text style={[styles.buttonText, { color: btn === 'C' || btn === '=' || ['+', '-', '*', '/'].includes(btn) ? '#FFF' : '#333' }]}>
                            {btn}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    displayContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: 24,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    expressionText: {
        fontSize: 24,
        color: '#9E9E9E',
        marginBottom: 8,
    },
    displayText: {
        fontSize: 64,
        fontWeight: '300',
        color: '#212121',
    },
    buttonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 8,
        justifyContent: 'space-between',
        backgroundColor: '#F5F5F5',
    },
    button: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        marginVertical: 4,
        borderRadius: BUTTON_SIZE / 2,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    buttonText: {
        fontSize: 32,
        fontWeight: '400',
    },
});
