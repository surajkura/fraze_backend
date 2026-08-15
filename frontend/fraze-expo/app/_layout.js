import React from 'react';
import { Stack } from 'expo-router';
import { useFonts, BricolageGrotesque_700Bold, BricolageGrotesque_800ExtraBold } from '@expo-google-fonts/bricolage-grotesque';
import { InstrumentSans_400Regular, InstrumentSans_500Medium, InstrumentSans_400Regular_Italic, InstrumentSans_500Medium_Italic } from '@expo-google-fonts/instrument-sans';
import { View, Text } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { c, f } from '../lib/theme';

function Gate() {
  const { user, loading } = useAuth();
  if (loading) return (
    <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: f.italic, fontStyle: 'italic', color: c.muted }}>consulting the record…</Text>
    </View>
  );
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg } }}>
      {/* Protected guards: signed-out users only ever see sign-up/log-in */}
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="index" />
        <Stack.Screen name="crews" />
        <Stack.Screen name="vault" />
        <Stack.Screen name="games" />
        <Stack.Screen name="crew" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="who-said-it" />
        <Stack.Screen name="add" options={{ presentation: 'modal' }} />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="log-in" />
      </Stack.Protected>
    </Stack>
  );
}

export default function Root() {
  const [loaded] = useFonts({
    BricolageGrotesque_700Bold, BricolageGrotesque_800ExtraBold,
    InstrumentSans_400Regular, InstrumentSans_500Medium,
    InstrumentSans_400Regular_Italic, InstrumentSans_500Medium_Italic,
  });
  if (!loaded) return null;
  return <AuthProvider><Gate /></AuthProvider>;
}
