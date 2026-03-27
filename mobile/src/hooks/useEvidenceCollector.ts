import { useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Camera } from 'expo-camera/legacy';
import * as Speech from 'expo-speech';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import * as Network from 'expo-network';
import * as SMS from 'expo-sms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const CACHE_KEY = '@evidence_sync_queue';
const LAST_FACE_CAPTURE = '@last_face_time';

export function useEvidenceCollector() {
    const [isRecording, setIsRecording] = useState(false);
    const audioRecorder = useRef<Audio.Recording | null>(null);
    const cameraRef = useRef<Camera | null>(null);
    const recordingInterval = useRef<NodeJS.Timeout | null>(null);

    const startSOSProtocol = async (childId: string) => {
        setIsRecording(true);

        // 1. Silent Confirmation (TTS)
        Speech.speak("Reconhecimento facial ativo. Estamos de olho em tudo.", {
            language: 'pt-BR',
            rate: 0.9
        });

        // 2. Offline Trigger (Existing)
        const { isConnected } = await Network.getNetworkStateAsync();
        if (!isConnected) {
            const location = await Location.getCurrentPositionAsync({});
            const encodedMsg = `SOS:EYE:${location.coords.latitude}:${location.coords.longitude}`;
            await SMS.sendSMSAsync(['911-PLACEHOLDER'], encodedMsg);
        }

        // 3. Periodic Background Chunking (Existing)
        recordingInterval.current = setInterval(async () => {
            await captureGenericChunk(childId);
        }, 10000);
    };

    const handleFacesDetected = async (faces: any[], childId: string) => {
        if (!isRecording || faces.length === 0 || !cameraRef.current) return;

        const now = Date.now();
        const lastCapRaw = await AsyncStorage.getItem(LAST_FACE_CAPTURE);
        const lastCap = lastCapRaw ? parseInt(lastCapRaw) : 0;

        // Rate Limit Face Capture: Max 1 every 8 seconds per face detected event
        if (now - lastCap > 8000) {
            await AsyncStorage.setItem(LAST_FACE_CAPTURE, now.toString());
            await captureSpecialEvidence(childId, 'face_detected');
        }
    };

    const captureGenericChunk = async (childId: string) => {
        await captureSpecialEvidence(childId, 'generic_chunk');
    };

    const captureSpecialEvidence = async (childId: string, type: 'generic_chunk' | 'face_detected') => {
        if (!cameraRef.current) return;

        try {
            const photo = await cameraRef.current.takePictureAsync({ quality: 0.5, skipProcessing: true });
            const location = await Location.getCurrentPositionAsync({});

            const fileUri = photo.uri;
            const fileContent = await FileSystem.readAsStringAsync(fileUri, { encoding: 'base64' });
            const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, fileContent);

            const payload = {
                id: `${type}_${Date.now()}`,
                childId,
                fileUri,
                hash,
                lat: location.coords.latitude,
                lng: location.coords.longitude,
                type,
                timestamp: new Date().toISOString()
            };

            const { isConnected } = await Network.getNetworkStateAsync();
            if (isConnected) {
                await uploadToSupabaseStorage(payload);
            } else {
                const queueRaw = await AsyncStorage.getItem(CACHE_KEY);
                const queue = queueRaw ? JSON.parse(queueRaw) : [];
                queue.push(payload);
                await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(queue));
            }

        } catch (e) {
            console.error("Special Capture Error", e);
        }
    };

    const uploadToSupabaseStorage = async (payload: any) => {
        // Invisible Watermark: Encode childId and timestamp in the immutable filename
        const txId = Date.now().toString(36).toUpperCase();
        const fileName = `${payload.childId}/CID_${payload.childId.slice(0, 4)}_TX_${txId}_H_${payload.hash.slice(0, 8)}.jpg`;

        const formData = new FormData();
        formData.append('file', { uri: payload.fileUri, name: fileName, type: 'image/jpeg' } as any);

        const { data, error } = await supabase.storage.from('evidence_storage').upload(fileName, formData);

        if (!error) {
            // Success: Immediate deletion from child's device
            await FileSystem.deleteAsync(payload.fileUri, { idempotent: true });

            await supabase.from('evidence_logs').insert({
                child_id: payload.childId,
                file_path: fileName,
                file_hash: payload.hash,
                latitude: payload.lat,
                longitude: payload.lng,
                type: payload.type
            });
        }
    };

    const stopSOSProtocol = async () => {
        setIsRecording(false);
        if (recordingInterval.current) clearInterval(recordingInterval.current);

        if (audioRecorder.current) {
            await audioRecorder.current.stopAndUnloadAsync();
        }
    };

    return { cameraRef, startSOSProtocol, stopSOSProtocol, handleFacesDetected, isRecording };
}
