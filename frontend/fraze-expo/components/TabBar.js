import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { c, f } from '../lib/theme';

const tabs = [
  { href: '/', glyph: '\u2302', label: 'HOME' },
  { href: '/crews', glyph: '\u2767', label: 'CREWS' },
  { href: '/add', plus: true },
  { href: '/vault', glyph: '\u25CE', label: 'VAULT' },
  { href: '/games', glyph: '?', label: 'GAMES' },
];

export default function TabBar() {
  const router = useRouter();
  const path = usePathname();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(32,31,29,.12)', backgroundColor: 'rgba(249,246,238,.97)', paddingTop: 10, paddingBottom: Math.max(insets.bottom, 8), paddingHorizontal: 8 }}>
      {tabs.map((t) =>
        t.plus ? (
          <View key="add" style={{ flex: 1, alignItems: 'center' }}>
            <Pressable onPress={() => router.push('/add')}
              style={{ width: 46, height: 46, borderRadius: 23, borderWidth: 1.5, borderColor: c.gold, backgroundColor: c.goldWash, alignItems: 'center', justifyContent: 'center', marginTop: -14, shadowColor: '#2d2b2b', shadowOpacity: 0.18, shadowRadius: 5, shadowOffset: { width: 0, height: 3 }, elevation: 4 }}>
              <Text style={{ fontFamily: f.heavy, fontSize: 22, color: c.goldDark, marginTop: -2 }}>+</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable key={t.href} onPress={() => router.push(t.href)} style={{ flex: 1, alignItems: 'center', gap: 3 }}>
            <Text style={{ fontSize: 13, color: path === t.href ? c.goldDark : c.faint }}>{t.glyph}</Text>
            <Text style={{ fontFamily: f.bold, fontSize: 8.5, letterSpacing: 0.4, color: path === t.href ? c.goldDark : c.faint }}>{t.label}</Text>
          </Pressable>
        )
      )}
    </View>
  );
}
