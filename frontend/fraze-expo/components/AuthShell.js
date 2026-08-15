import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { c, f } from '../lib/theme';

export default function AuthShell({ children }) {
  return (
    <KeyboardAvoidingView style={s.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
        <Text style={s.wordmark}>fraze</Text><Text style={{ color: c.gold, fontSize: 19 }}>{'\u273A'}</Text>
      </View>
      <Text style={s.tagline}>Where the unpostable becomes unforgettable.</Text>
      <View style={s.card}>{children}</View>
      <Text style={s.footer}>Private by default. No feeds, no followers, no strangers.</Text>
    </KeyboardAvoidingView>
  );
}
export const auth = StyleSheet.create({
  blurb: { fontFamily: f.italic, fontStyle: 'italic', fontSize: 12.5, color: c.muted, marginTop: 4 },
  label: { fontFamily: f.bold, fontSize: 9.5, letterSpacing: 0.6, color: c.metaGray, marginTop: 14 },
  input: { borderWidth: 1, borderColor: c.borderInput, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: c.cardLight, fontFamily: f.body, fontSize: 14, color: c.ink, marginTop: 7 },
  codeInput: { fontFamily: f.bold, fontSize: 18, letterSpacing: 6, textAlign: 'center' },
  error: { borderWidth: 1, borderColor: c.rustBorder, borderRadius: 10, padding: 10, marginTop: 12, fontFamily: f.italic, fontStyle: 'italic', fontSize: 12, color: c.rust, backgroundColor: 'rgba(176,82,63,.05)' },
  cta: { marginTop: 18, borderWidth: 1.5, borderColor: c.gold, borderRadius: 999, paddingVertical: 13, alignItems: 'center', backgroundColor: c.goldWash },
  ctaText: { fontFamily: f.heavy, fontSize: 11, letterSpacing: 0.7, color: c.goldDark },
  link: { fontFamily: f.italic, fontStyle: 'italic', fontSize: 12.5, color: c.goldDark, textAlign: 'center', marginTop: 14 },
});
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.bg, paddingHorizontal: 28, justifyContent: 'center' },
  wordmark: { fontFamily: f.heavy, fontSize: 40, letterSpacing: -1.2, color: c.gold },
  tagline: { fontFamily: f.italic, fontStyle: 'italic', fontSize: 14, color: c.muted, textAlign: 'center', marginTop: 6, marginBottom: 18 },
  card: { borderWidth: 1, borderColor: c.border, borderRadius: 18, padding: 22, backgroundColor: c.card },
  footer: { fontFamily: f.italic, fontStyle: 'italic', fontSize: 11.5, color: c.faint, textAlign: 'center', marginTop: 18 },
});
