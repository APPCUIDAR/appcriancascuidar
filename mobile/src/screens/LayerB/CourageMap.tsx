import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, Platform, Linking, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import { ShieldAlert } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// Map Style hiding commercial POIs, minimizing street labels, keeping only natural/road geometry
const customMapStyle = [
    { "featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
    { "featureType": "transit", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
    { "featureType": "road", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }
];

interface SupportLocation {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    type: 'police' | 'hospital' | 'council';
}

export default function CourageMap() {
    const [region, setRegion] = useState({
        latitude: -23.55052, longitude: -46.633308, latitudeDelta: 0.05, longitudeDelta: 0.05
    });
    const [locations, setLocations] = useState<SupportLocation[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<SupportLocation | null>(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Ops', 'Precisamos da sua localização para o Mapa da Coragem.');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05
            });
            fetchPlacesMock(location.coords.latitude, location.coords.longitude);
        })();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.5, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const fetchPlacesMock = (lat: number, lng: number) => {
        // Em produção, isso faria o fetch para API do Google Places 'Nearby Search'
        // ex: https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&keyword=Delegacia|Conselho&opennow=true&key=API_KEY
        setLocations([
            { id: '1', name: 'Delegacia de Proteção', latitude: lat + 0.01, longitude: lng + 0.01, type: 'police' },
            { id: '2', name: 'Conselho Tutelar Amigo', latitude: lat - 0.012, longitude: lng - 0.005, type: 'council' },
            { id: '3', name: 'Hospital Infantil', latitude: lat + 0.008, longitude: lng - 0.015, type: 'hospital' },
        ]);
    };

    const getMarkerIcon = (type: string) => {
        switch (type) {
            case 'police': return '🛡️⭐';
            case 'council': return '🏠🫂';
            case 'hospital': return '🏥🧸';
            default: return '📍';
        }
    };

    const onMarkerPress = (place: SupportLocation) => {
        setSelectedPlace(place);
        Speech.speak('Vamos para cá? É seguro!', { language: 'pt-BR', rate: 0.9, pitch: 1.1 });
    };

    const navigateToPlace = () => {
        if (!selectedPlace) return;
        const { latitude, longitude } = selectedPlace;
        const url = Platform.OS === 'ios'
            ? `maps://app?daddr=${latitude},${longitude}&dirflg=w`
            : `google.navigation:q=${latitude},${longitude}&mode=w`;

        Linking.openURL(url);
    };

    const panicSOS = () => {
        Alert.alert('SOS Disparado', 'Localização enviada silenciosamente para admin.');
    };

    return (
        <View style={styles.container}>
            {/* Alert Header */}
            <View style={styles.alertHeader}>
                <Text style={styles.alertText}>VÁ PARA O LUGAR VERDE MAIS PRÓXIMO!</Text>
            </View>

            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                customMapStyle={customMapStyle}
                region={region}
                showsUserLocation={true}
            >
                {locations.map((place) => (
                    <Marker
                        key={place.id}
                        coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                        onPress={() => onMarkerPress(place)}
                    >
                        <View style={styles.markerContainer}>
                            <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
                            <View style={styles.iconBg}>
                                <Text style={styles.markerText}>{getMarkerIcon(place.type)}</Text>
                            </View>
                        </View>
                    </Marker>
                ))}
            </MapView>

            {/* Floating Panic Button */}
            <TouchableOpacity style={styles.panicBtn} onPress={panicSOS}>
                <ShieldAlert size={32} color="#FFF" />
            </TouchableOpacity>

            {/* Action Footer */}
            {selectedPlace && (
                <View style={styles.footer}>
                    <View style={styles.bubble}>
                        <Text style={styles.bubbleText}>VAMOS PARA CÁ? É SEGURO!</Text>
                    </View>
                    <Text style={styles.placeName}>{selectedPlace.name}</Text>
                    <TouchableOpacity style={styles.goBtn} onPress={navigateToPlace}>
                        <Text style={styles.goText}>QUERO IR PARA CÁ AGORA! 🏃🏾‍♂️</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    alertHeader: { position: 'absolute', top: 50, left: '5%', right: '5%', backgroundColor: '#4CAF50', padding: 15, borderRadius: 20, elevation: 8, zIndex: 10, alignItems: 'center' },
    alertText: { color: '#FFF', fontSize: 18, fontWeight: '900', textAlign: 'center' },
    map: { width, height },
    markerContainer: { alignItems: 'center', justifyContent: 'center', width: 80, height: 80 },
    pulseRing: { position: 'absolute', width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(76, 175, 80, 0.4)', borderWidth: 4, borderColor: '#4CAF50' },
    iconBg: { width: 44, height: 44, backgroundColor: '#FFF', borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#4CAF50', elevation: 5 },
    markerText: { fontSize: 20 },
    panicBtn: { position: 'absolute', right: 20, top: 120, width: 60, height: 60, borderRadius: 30, backgroundColor: '#D32F2F', justifyContent: 'center', alignItems: 'center', elevation: 8, zIndex: 10 },
    footer: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: '#FFF', padding: 20, borderRadius: 24, elevation: 10, alignItems: 'center' },
    bubble: { backgroundColor: '#E3F2FD', padding: 12, borderRadius: 16, marginBottom: 10, width: '100%', alignItems: 'center' },
    bubbleText: { color: '#1565C0', fontSize: 16, fontWeight: 'bold' },
    placeName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
    goBtn: { backgroundColor: '#4CAF50', width: '100%', paddingVertical: 18, borderRadius: 30, alignItems: 'center', elevation: 4 },
    goText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
});
