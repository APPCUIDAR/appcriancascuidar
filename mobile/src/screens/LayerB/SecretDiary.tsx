import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Book, Save, Smile, Frown, Meh, Ghost } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../store/useAppStore';

const { width } = Dimensions.get('window');

const MOODS = [
    { id: 'happy', emoji: '😊', label: 'Feliz', color: '#4CAF50' },
    { id: 'meh', emoji: '😐', label: 'Mais ou menos', color: '#FFB300' },
    { id: 'sad', emoji: '😢', label: 'Triste', color: '#03A9F4' },
    { id: 'scared', emoji: '😰', label: 'Assustado', color: '#F44336' },
];

export default function SecretDiary() {
    const navigation = useNavigation<any>();
    const [content, setContent] = useState('');
    const [mood, setMood] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSaveEntry = async () => {
        if (!content.trim()) {
            Alert.alert('Ops!', 'Escreva um pouquinho no seu diário antes de salvar! ✨');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.from('diary_entries').insert({
                child_id: 'child-user-001', // Placeholder: use session user
                content,
                mood
            });

            if (error) throw error;

            Alert.alert('Salvo no Cofre!', 'Seu segredo está guardado com cadeado agora.');
            setContent('');
            setMood(null);
            navigation.goBack();
        } catch (e) {
            Alert.alert('Erro', 'Não consegui guardar seu segredo agora. Tente de novo!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft size={24} color="#1A237E" />
                </TouchableOpacity>
                <Text style={styles.title}>Meu Diário Mágico</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.paper}>
                    <View style={styles.lines}>
                        <Text style={styles.label}>Como você está se sentindo hoje?</Text>
                        <View style={styles.moodRow}>
                            {MOODS.map(m => (
                                <TouchableOpacity
                                    key={m.id}
                                    style={[styles.moodCircle, mood === m.id && { backgroundColor: m.color, borderColor: '#FFF' }]}
                                    onPress={() => setMood(m.id)}
                                >
                                    <Text style={styles.emoji}>{m.emoji}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.divider} />

                        <TextInput
                            placeholder="Conte aqui o seu segredo... (Eu vou guardar muito bem!)"
                            multiline
                            value={content}
                            onChangeText={setContent}
                            style={styles.input}
                            placeholderTextColor="#9E9E9E"
                        />
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.saveBtn, loading && styles.disabled]}
                    onPress={handleSaveEntry}
                    disabled={loading}
                >
                    <Save size={24} color="#FFF" />
                    <Text style={styles.saveText}>{loading ? 'Guardando...' : 'Trancar no Cofre 🔒'}</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF9C4' }, // Yellow notebook color
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60, backgroundColor: '#FFF' },
    backBtn: { padding: 8 },
    title: { fontSize: 20, fontWeight: 'black', color: '#1A237E' },
    scrollContent: { padding: 20 },
    paper: { backgroundColor: '#FFF', borderRadius: 32, padding: 24, minHeight: 400, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20 },
    lines: { width: '100%', height: '100%' },
    label: { fontSize: 16, fontWeight: 'bold', color: '#3F51B5', marginBottom: 16 },
    moodRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    moodCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
    emoji: { fontSize: 32 },
    divider: { height: 1.5, backgroundColor: '#E0E0E0', width: '100%', marginBottom: 20 },
    input: { flex: 1, fontSize: 18, color: '#333', lineHeight: 28, textAlignVertical: 'top', fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'serif' },
    footer: { padding: 24, backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
    saveBtn: { backgroundColor: '#FF4081', height: 64, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, shadowColor: '#FF4081', shadowOpacity: 0.3, shadowRadius: 10 },
    saveText: { color: '#FFF', fontSize: 18, fontWeight: 'black' },
    disabled: { opacity: 0.6 }
});
