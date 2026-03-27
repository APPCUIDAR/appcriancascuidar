import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppStore } from '../store/useAppStore';

import GamesHub from '../screens/LayerA/GamesHub';
import MemoryGame from '../screens/LayerA/MemoryGame';
import VirtualPet from '../screens/LayerA/VirtualPet';
import Match3 from '../screens/LayerA/Match3';
import FunMath from '../screens/LayerA/FunMath';
import SnakeGame from '../screens/LayerA/SnakeGame';
import ChessGame from '../screens/LayerA/ChessGame';
import SudokuGame from '../screens/LayerA/SudokuGame';
import Calculator from '../screens/LayerA/Calculator';

import DiagnosticHub from '../screens/LayerA/Diagnostic/DiagnosticHub';
import AvatarCreator from '../screens/LayerA/Diagnostic/AvatarCreator';
import TrafficLightMap from '../screens/LayerA/Diagnostic/TrafficLightMap';
import HouseMapping from '../screens/LayerA/Diagnostic/HouseMapping';
import GiftsAndSecrets from '../screens/LayerA/Diagnostic/GiftsAndSecrets';
import HeroArmor from '../screens/LayerA/Diagnostic/HeroArmor';
import EmotionFaces from '../screens/LayerA/Diagnostic/EmotionFaces';
import OnboardingLudo from '../screens/LayerA/OnboardingLudo';

import SafeEnvironment from '../screens/LayerB/SafeEnvironment';
import CourageMap from '../screens/LayerB/CourageMap';
import SecretDiary from '../screens/LayerB/SecretDiary';

export type RootStackParamList = {
    GamesHub: undefined;
    MemoryGame: undefined;
    VirtualPet: undefined;
    Match3: undefined;
    FunMath: undefined;
    SnakeGame: undefined;
    ChessGame: undefined;
    SudokuGame: undefined;
    DiagnosticHub: undefined;
    AvatarCreator: undefined;
    TrafficLightMap: undefined;
    HouseMapping: undefined;
    GiftsAndSecrets: undefined;
    HeroArmor: undefined;
    EmotionFaces: undefined;
    Calculator: undefined;
    SafeEnvironment: undefined;
    CourageMap: undefined;
    OnboardingLudo: undefined;
    SecretDiary: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    const { isLayerBUnlocked, isProfileComplete } = useAppStore((state: any) => ({
        isLayerBUnlocked: state.isLayerBUnlocked,
        isProfileComplete: state.isProfileComplete
    }));

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={!isProfileComplete ? "OnboardingLudo" : "GamesHub"}>
                {!isLayerBUnlocked ? (
                    <Stack.Group>
                        <Stack.Screen name="OnboardingLudo" component={OnboardingLudo} />
                        <Stack.Screen name="GamesHub" component={GamesHub} />
                        <Stack.Screen name="AvatarCreator" component={AvatarCreator} />
                        <Stack.Screen name="DiagnosticHub" component={DiagnosticHub} />
                        <Stack.Screen name="TrafficLightMap" component={TrafficLightMap} />
                        <Stack.Screen name="HouseMapping" component={HouseMapping} />
                        <Stack.Screen name="GiftsAndSecrets" component={GiftsAndSecrets} />
                        <Stack.Screen name="HeroArmor" component={HeroArmor} />
                        <Stack.Screen name="EmotionFaces" component={EmotionFaces} />

                        <Stack.Screen name="MemoryGame" component={MemoryGame} />
                        <Stack.Screen name="VirtualPet" component={VirtualPet} />
                        <Stack.Screen name="Match3" component={Match3} />
                        <Stack.Screen name="FunMath" component={FunMath} />
                        <Stack.Screen name="SnakeGame" component={SnakeGame} />
                        <Stack.Screen name="ChessGame" component={ChessGame} />
                        <Stack.Screen name="SudokuGame" component={SudokuGame} />
                        <Stack.Screen name="Calculator" component={Calculator} />
                    </Stack.Group>
                ) : (
                    <Stack.Group>
                        <Stack.Screen name="SafeEnvironment" component={SafeEnvironment} />
                        <Stack.Screen name="CourageMap" component={CourageMap} />
                        <Stack.Screen name="SecretDiary" component={SecretDiary} />
                    </Stack.Group>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
