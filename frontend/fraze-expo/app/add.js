import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useCrews } from '../hooks/useData';
import { c, f } from '../lib/theme';

const TYPES = [
  { kind: 'quote', label: '\u201D A QUOTE', prompt: 'word for word. no cleaning it up.' },
  { kind: 'term', label: '\u00A7 AN INSIDE JOKE', prompt: "explain it like they'll forget by next week." },
  { kind: 'unpostable', label: '\u25CE AN UNPOSTABLE', prompt: 'describe the evidence. photo upload lands in milestone 2.' },
  { kind: 'voice', label: '\u25B6 A VOICE MEMO', prompt: 'what will we hear? recording lands in milestone 2.' },
];

export default function Add() {
  const router = useRouter();
  const { user } = useAuth();
  const { crews } = useCrews();
  const [type, setType] = useState(TYPES[0]);
  const [crewId, setCrewId] = useState(null);
  const [text, setText] = useState('');
  const [saidBy, setSaidBy] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(null);
    const crew = crewId ?? crews[0]?.id;
    if (!crew) return setError('No crew to file it in. Start one first.');
    if (!text.trim()) return setError('The archive accepts many things. Blank is not one of them.');
    setBusy(true);
    const { error } = await supabase.from('memories').insert({
      crew_id: crew, author_id: user.id, kind: type.kind,
      text: text.trim(), said_by: type.kind === 'quote' ? saidBy.trim() || null : null,
    });
    setBusy(false);
    if (error) return setError(error.message);
    router.back();
  }

  const chip = (sel) => [s.chip, sel && s.chipSel];
  const chipText = (sel) => [s.chipText, sel && { color: c.goldDark }];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ padding: 22, paddingTop: 26 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text style={s.title}>add a memory</Text>
        <Pressable onPress={() => router.back()}><Text style={{ fontFamily: f.bold, color: c.faint, fontSize: 13 }}>{'\u2715'}</Text></Pressable>
      </View>
      <Text style={s.sub}>Screenshot before it scrolls away. No caption required.</Text>
      <Text style={s.label}>WHAT IS IT</Text>
      <View style={s.chipRow}>
        {TYPES.map((t) => (
          <Pressable key={t.kind} style={chip(type.kind === t.kind)} onPress={() => setType(t)}>
            <Text style={chipText(type.kind === t.kind)}>{t.label}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={s.label}>WHICH CREW</Text>
      <View style={s.chipRow}>
        {crews.map((cr) => (
          <Pressable key={cr.id} style={chip((crewId ?? crews[0]?.id) === cr.id)} onPress={() => setCrewId(cr.id)}>
            <Text style={chipText((crewId ?? crews[0]?.id) === cr.id)}>{cr.name}</Text>
          </Pressable>
        ))}
      </View>
      {type.kind === 'quote' && (
        <>
          <Text style={s.label}>WHO SAID IT</Text>
          <TextInput style={s.input} value={saidBy} onChangeText={setSaidBy} placeholder="name them. this is a legal document." placeholderTextColor={c.faint} />
        </>
      )}
      <Text style={s.label}>WHAT HAPPENED</Text>
      <TextInput style={[s.input, { minHeight: 80, textAlignVertical: 'top' }]} value={text} onChangeText={setText}
        multiline placeholder={type.prompt} placeholderTextColor={c.faint} />
      {error && <Text style={s.error}>{error}</Text>}
      <Pressable style={s.cta} onPress={submit} disabled={busy}>
        <Text style={s.ctaText}>{busy ? 'FILING…' : 'PUT IT IN THE RECORD →'}</Text>
      </Pressable>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  title: { fontFamily: f.bold, fontSize: 22, letterSpacing: -0.4, color: c.ink },
  sub: { fontFamily: f.italic, fontStyle: 'italic', fontSize: 12.5, color: c.muted, marginTop: 2 },
  label: { fontFamily: f.bold, fontSize: 10, letterSpacing: 0.6, color: c.metaGray, marginTop: 18 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 8 },
  chip: { borderWidth: 1, borderColor: c.borderInput, borderRadius: 999, paddingHorizontal: 15, paddingVertical: 7, backgroundColor: c.cardLight },
  chipSel: { borderColor: c.gold, backgroundColor: c.goldWash },
  chipText: { fontFamily: f.bold, fontSize: 10, letterSpacing: 0.4, color: c.muted },
  input: { borderWidth: 1, borderColor: c.borderInput, borderRadius: 12, padding: 13, backgroundColor: c.cardLight, fontFamily: f.body, fontSize: 14, color: c.ink, marginTop: 8 },
  error: { borderWidth: 1, borderColor: c.rustBorder, borderRadius: 10, padding: 10, marginTop: 12, fontFamily: f.italic, fontStyle: 'italic', fontSize: 12, color: c.rust },
  cta: { marginTop: 18, borderWidth: 1.5, borderColor: c.gold, borderRadius: 999, paddingVertical: 13, alignItems: 'center', backgroundColor: c.goldWash },
  ctaText: { fontFamily: f.heavy, fontSize: 11, letterSpacing: 0.7, color: c.goldDark },
});
