import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import * as Device from 'expo-device';
import LottieView from 'lottie-react-native';
import { useAppStore } from '../../store/useAppStore';
import { supabase } from '../../lib/supabase';

const { width, height } = Dimensions.get('window');

const ONBOARDING_STEPS = [
    'USER_TYPE',
    'FORMAL_TERMS',
    'CHILD_INTRO',
    'GENDER',
    'AGE',
    'NICKNAME',
    'SAFETY_PACT',
    'TUTORIAL'
];

export default function OnboardingLudo() {
    const [step, setStep] = useState(0);
    const [userType, setUserType] = useState<'child' | 'guardian' | null>(null);
    const [gender, setGender] = useState<'male' | 'female' | null>(null);
    const [age, setAge] = useState<number | null>(null);
    const [nickname, setNickname] = useState('');
    const navigation = useNavigation<any>();
    const setProfileComplete = useAppStore((state: any) => state.setProfileComplete);

    const currentStepString = ONBOARDING_STEPS[step];

    useEffect(() => {
        handleStepLogic();
    }, [step]);

    const handleStepLogic = () => {
        if (currentStepString === 'CHILD_INTRO') {
            Speech.speak("Olá! Vamos começar nossa aventura? Eu vou ser seu guia!", { language: 'pt-BR' });
        }
        if (currentStepString === 'SAFETY_PACT') {
            const childTerms = "Oi! Para eu ser seu melhor amigo protetor, preciso de um combinado com você: Sempre que você estiver em perigo e me chamar, eu vou ligar meus olhos e ouvidos mágicos. Eu vou guardar tudo em um cofre secreto que só os grandes heróis conseguem abrir. Ninguém na sua casa vai ver isso, tá bom? Você aceita que eu te proteja assim?";
            Speech.speak(childTerms, { language: 'pt-BR' });
        }
    };

    const logConsent = async () => {
        await supabase.from('consent_logs').insert({
            device_id: Device.osBuildId || 'unknown_device',
            terms_version: '2.0_HYBRID',
            user_id: userType === 'child' ? null : undefined // Logic for guardian link if needed
        });
    };

    const nextStep = () => {
        if (currentStepString === 'USER_TYPE') {
            if (userType === 'guardian') setStep(ONBOARDING_STEPS.indexOf('FORMAL_TERMS'));
            else setStep(ONBOARDING_STEPS.indexOf('CHILD_INTRO'));
            return;
        }

        if (currentStepString === 'FORMAL_TERMS') {
            logConsent();
            navigation.navigate('GamesHub'); // Guardian skips child onboarding
            setProfileComplete();
            return;
        }

        if (currentStepString === 'SAFETY_PACT') logConsent();

        if (step < ONBOARDING_STEPS.length - 1) {
            setStep(step + 1);
        } else {
            finishOnboarding();
        }
    };

    const finishOnboarding = async () => {
        await supabase.from('profiles').insert([{ gender, age, nickname }]);
        setProfileComplete();
        navigation.navigate('GamesHub');
    };

    return (
        <View style={styles.container}>
            {/* Background Character for Child Steps */}
            {step >= ONBOARDING_STEPS.indexOf('CHILD_INTRO') && (
                <View style={styles.characterContainer}>
                    <LottieView
                        source={{ uri: 'https://assets5.lottiefiles.com/packages/lf20_m6cuL6.json' }}
                        autoPlay loop style={styles.lottie}
                    />
                </View>
            )}

            <View style={[styles.card, currentStepString === 'FORMAL_TERMS' && styles.fullCard]}>

                {currentStepString === 'USER_TYPE' && (
                    <View style={styles.stepContent}>
                        <Text style={styles.title}>Quem está usando?</Text>
                        <Text style={styles.desc}>Selecione para configurar o App Cuidar.</Text>
                        <View style={styles.row}>
                            <TouchableOpacity style={styles.typeBtn} onPress={() => { setUserType('child'); nextStep(); }}>
                                <Text style={styles.emoji}>🧒</Text>
                                <Text style={styles.typeLabel}>Sou Criança</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.typeBtn} onPress={() => { setUserType('guardian'); nextStep(); }}>
                                <Text style={styles.emoji}>👤</Text>
                                <Text style={styles.typeLabel}>Sou Responsável</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {currentStepString === 'FORMAL_TERMS' && (
                    <View style={styles.stepContent}>
                        <Text style={styles.formalTitle}>TERMO DE USO E PRIVACIDADE</Text>
                        <ScrollView style={styles.formalScroll}>
                            <Text style={styles.formalText}>
                                <Text style={styles.boldText}>FINALIDADE:</Text> O Aplicativo Cuidar é uma ferramenta de segurança pessoal destinada à interrupção de ciclos de violência e abuso.{"\n\n"}
                                <Text style={styles.boldText}>COLETA DE DADOS CRÍTICOS:</Text> Ao ativar as funções de emergência (Camada B ou SOS), o usuário autoriza expressamente a captura de áudio, vídeo e geolocalização em tempo real.{"\n\n"}
                                <Text style={styles.boldText}>BASE LEGAL:</Text> Esta coleta fundamenta-se no Estado de Necessidade e na Legítima Defesa de Terceiros, visando a preservação da vida e da integridade física (Art. 23, CP e Lei 13.431/2017).{"\n\n"}
                                <Text style={styles.boldText}>CUSTÓDIA DE PROVAS:</Text> Todo material audiovisual será criptografado e enviado diretamente ao servidor central, não sendo armazenado na galeria pública do dispositivo.{"\n\n"}
                                <Text style={styles.boldText}>SIGILO:</Text> Comprometemo-nos a não divulgar, comercializar ou expor os dados, utilizando-os estritamente para encaminhamento às autoridades policiais e judiciárias competentes mediante solicitação ou denúncia formalizada.
                            </Text>
                        </ScrollView>
                        <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
                            <Text style={styles.nextText}>ACEITAR TERMOS E CONTINUAR</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {currentStepString === 'CHILD_INTRO' && (
                    <View style={styles.stepContent}>
                        <Text style={styles.title}>Oi! Bem-vindo!</Text>
                        <Text style={styles.desc}>Eu sou seu novo amigo. Vamos começar nossa aventura?</Text>
                    </View>
                )}

                {currentStepString === 'SAFETY_PACT' && (
                    <View style={styles.stepContent}>
                        <Text style={styles.title}>NOSSO PACTO DE AMIZADE 🤝</Text>
                        <Text style={styles.desc}>
                            "Sempre que você estiver em perigo e me chamar, eu vou ligar meus 'olhos e ouvidos' mágicos (câmera e som). Eu vou guardar tudo em um cofre secreto que só os grandes heróis conseguem abrir.{"\n\n"}
                            Ninguém na sua casa vai ver isso, tá bom? Você aceita?"
                        </Text>
                        <TouchableOpacity style={styles.childAcceptBtn} onPress={nextStep}>
                            <Text style={styles.childAcceptText}>SIM, ME PROTEJA MELHOR AMIGO! ✨</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Generic Step Rendering for Child Onboarding */}
                {(currentStepString === 'GENDER' || currentStepString === 'AGE' || currentStepString === 'NICKNAME' || currentStepString === 'TUTORIAL') && (
                    <View style={styles.stepContent}>
                        <Text style={styles.title}>{currentStepString === 'NICKNAME' ? 'Nome de Herói' : 'Configuração'}</Text>
                        <Text style={styles.desc}>Siga as instruções para configurar seu lugar secreto.</Text>
                    </View>
                )}

                {(currentStepString !== 'USER_TYPE' && currentStepString !== 'FORMAL_TERMS' && currentStepString !== 'SAFETY_PACT') && (
                    <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
                        <Text style={styles.nextText}>Continuar ✨</Text>
                    </TouchableOpacity>
                )}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E3F2FD', justifyContent: 'flex-end', alignItems: 'center' },
    characterContainer: { width: 300, height: 300, position: 'absolute', top: 100 },
    lottie: { width: '100%', height: '100%' },
    card: { width: '100%', height: height * 0.45, backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32, alignItems: 'center', elevation: 20 },
    fullCard: { height: height * 0.8 },
    stepContent: { alignItems: 'center', width: '100%', flex: 1 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1A237E', marginBottom: 12, textAlign: 'center' },
    desc: { fontSize: 16, color: '#5C6BC0', textAlign: 'center', lineHeight: 24 },
    row: { flexDirection: 'row', gap: 20, marginTop: 40 },
    typeBtn: { width: 140, height: 160, backgroundColor: '#F5F5F5', borderRadius: 32, alignItems: 'center', justifyContent: 'center', elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
    emoji: { fontSize: 50 },
    typeLabel: { fontWeight: 'bold', color: '#1A237E', marginTop: 12 },
    formalTitle: { fontSize: 18, fontWeight: 'black', color: '#B71C1C', marginBottom: 20 },
    formalScroll: { flex: 1, width: '100%', marginBottom: 20 },
    formalText: { fontSize: 14, color: '#333', lineHeight: 22, textAlign: 'justify' },
    boldText: { fontWeight: 'bold' },
    childAcceptBtn: { width: '100%', padding: 20, backgroundColor: '#FF4081', borderRadius: 24, marginTop: 24, elevation: 10 },
    childAcceptText: { color: '#FFF', fontSize: 16, fontWeight: 'black', textAlign: 'center' },
    nextBtn: { width: '100%', height: 60, backgroundColor: '#42A5F5', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 'auto' },
    nextText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
