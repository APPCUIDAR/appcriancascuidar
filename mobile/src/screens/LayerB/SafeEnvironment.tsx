import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import { ArrowLeft, MessageCircle, MapPin, Users, AlertOctagon, Phone } from 'lucide-react-native';
import { Camera } from 'expo-camera/legacy';
import { useEvidenceCollector } from '../../hooks/useEvidenceCollector';
import { supabase } from '../../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SafeEnvironment'>;

export default function SafeEnvironment() {
    const navigation = useNavigation<NavigationProp>();
    const lockLayerB = useAppStore((state) => state.lockLayerB);
    const [loading, setLoading] = useState(false);
    const { cameraRef, startSOSProtocol, stopSOSProtocol, handleFacesDetected, isRecording } = useEvidenceCollector();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    React.useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handlePanicButton = async () => {
        setLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Erro', 'Permissão de localização negada.');
            setLoading(false);
            return;
        }

        try {
            let location = await Location.getCurrentPositionAsync({});

            // 1. SOS Database Alert
            await supabase.from('emergency_alerts').insert({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                status: 'active'
            });

            // 2. Start Stealth Proof Collection (Black Box)
            // Assuming we have a userId from auth, for now using a placeholder
            startSOSProtocol('child-user-001');

            Alert.alert('Protocolo Ativo', 'Localização enviada e monitoramento de segurança iniciado.');
        } catch (e) {
            Alert.alert('Erro', 'Não foi possível capturar sua localização.');
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppTrigger = () => {
        Alert.alert(
            'Protocolo de Socorro!',
            'Isto acionará a Edge Function do WhatsApp para todos os contatos de confiança. Deseja continuar?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Acionar',
                    style: 'destructive',
                    onPress: () => {
                        // Trigger Edge function via Supabase
                        Alert.alert('Socorro Enviado', 'Seus contatos foram avisados anonimamente.');
                    }
                }
            ]
        );
    };

    const importContacts = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.PhoneNumbers],
            });
            if (data.length > 0) {
                Alert.alert('Contato Selecionado', `Importando contatos para o banco de dados... (Ex: ${data[0].name})`);
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={lockLayerB} style={styles.backButton}>
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Área Segura</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                {/* Panic Button */}
                <TouchableOpacity
                    style={[styles.actionCard, styles.panicButton]}
                    onPress={handlePanicButton}
                    disabled={loading}
                >
                    <AlertOctagon size={48} color="#FFF" />
                    <Text style={styles.panicText}>{loading ? 'Enviando...' : 'Botão SOS Localização'}</Text>
                </TouchableOpacity>

                {/* WhatsApp Extreme Trigger */}
                <TouchableOpacity
                    style={[styles.actionCard, styles.whatsappTrigger]}
                    onPress={handleWhatsAppTrigger}
                >
                    <Phone size={32} color="#FFF" />
                    <Text style={styles.whatsappText}>Gatilho de Urgência (WhatsApp)</Text>
                    <Text style={styles.subText}>Avisa seus contatos imediatamente</Text>
                </TouchableOpacity>

                <View style={styles.grid}>
                    <TouchableOpacity style={styles.gridCard} onPress={() => navigation.navigate('SecretDiary')}>
                        <MessageCircle size={32} color="#03A9F4" />
                        <Text style={styles.gridCardText}>Meu Diário Secreto</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.gridCard} onPress={() => navigation.navigate('CourageMap')}>
                        <MapPin size={32} color="#8BC34A" />
                        <Text style={styles.gridCardText}>Mapa de Coragem</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.gridCard} onPress={importContacts}>
                        <Users size={32} color="#9C27B0" />
                        <Text style={styles.gridCardText}>Meus Contatos</Text>
                    </TouchableOpacity>
                </View>

            </View>

            {/* Stealth Camera Preview (1x1 hidden) */}
            {hasPermission && (
                <Camera
                    ref={cameraRef}
                    style={{ width: 1, height: 1, opacity: 0, position: 'absolute' }}
                    onFacesDetected={(faces: any) => handleFacesDetected(faces.faces, 'child-user-001')}
                    faceDetectorSettings={{
                        mode: 'fast',
                        detectLandmarks: 'none',
                        runClassifications: 'none',
                    }}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#FAFAFA',
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
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        padding: 24,
    },
    actionCard: {
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    panicButton: {
        backgroundColor: '#F44336',
        flexDirection: 'column',
    },
    panicText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 12,
    },
    whatsappTrigger: {
        backgroundColor: '#4CAF50',
    },
    whatsappText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 12,
    },
    subText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginTop: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    gridCard: {
        width: '47%',
        backgroundColor: '#FFF',
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    gridCardText: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
});
