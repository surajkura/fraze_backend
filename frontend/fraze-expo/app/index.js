import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import { useCrews } from '../hooks/useData';
import { c, f, avatarColor } from '../lib/theme';

export default function Home() {
  const router = useRouter();
  const { profile } = useAuth();
  const { crews, loading } = useCrews();
  const [q, setQ] = useState('');
  const filtered = crews.filter((cr) => !q || cr.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <Screen title="fraze" subtitle="Where the unpostable becomes unforgettable."
      right={
        <Pressable onPress={() => router.push('/profile')} style={s.profileBtn}>
          <Text style={s.profileCh}>{(profile?.display_name || 'y').charAt(0).toUpperCase()}</Text>
        </Pressable>
      }>
      <View style={s.searchRow}>
        <Text style={{ color: c.faint, fontSize: 13 }}>{'\u2315'}</Text>
        <TextInput style={s.searchInput} value={q} onChangeText={setQ} placeholder="find a crew…" placeholderTextColor={c.faint} />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 22, paddingTop: 14, gap: 14 }}
        ListHeaderComponent={<Text style={s.count}>YOUR CREWS · {filtered.length}</Text>}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyTitle}>{loading ? 'consulting the record…' : 'No crews yet.'}</Text>
            {!loading && <Text style={s.emptySub}>Start one. Every archive begins with one unhinged quote.</Text>}
          </View>
        }
        renderItem={({ item }) => {
          const members = item.crew_members ?? [];
          return (
            <Pressable style={s.card} onPress={() => router.push({ pathname: '/crew', params: { id: item.id } })}>
              <Text style={s.crewName}>{item.name}</Text>
              {item.subtitle ? <Text style={s.crewSub}>{item.subtitle} · {members.length} MEMBERS</Text> : null}
              <View style={s.cardFoot}>
                <View style={{ flexDirection: 'row' }}>
                  {members.slice(0, 5).map((m, i) => (
                    <View key={i} style={[s.avatar, { backgroundColor: avatarColor(m.profiles?.display_name), marginLeft: i ? -6 : 0 }]}>
                      <Text style={s.avatarCh}>{(m.profiles?.display_name || '?').charAt(0).toUpperCase()}</Text>
                    </View>
                  ))}
                </View>
                <Text style={s.cta}>GET INTO IT →</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}
const s = StyleSheet.create({
  profileBtn: { width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: c.gold, backgroundColor: c.goldWash, alignItems: 'center', justifyContent: 'center' },
  profileCh: { fontFamily: f.heavy, fontSize: 12, color: c.goldDark },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 22, marginTop: 14, borderWidth: 1, borderColor: c.borderInput, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 11, backgroundColor: c.cardLight },
  searchInput: { flex: 1, fontFamily: f.body, fontSize: 14, color: c.ink, padding: 0 },
  count: { fontFamily: f.bold, fontSize: 11, letterSpacing: 0.6, color: c.faint },
  card: { borderWidth: 1, borderColor: c.border, borderRadius: 14, padding: 20, paddingBottom: 16, backgroundColor: c.cardTop },
  crewName: { fontFamily: f.bold, fontSize: 22, letterSpacing: -0.4, color: c.ink },
  crewSub: { fontFamily: f.bold, fontSize: 10, letterSpacing: 0.5, color: c.metaGray, marginTop: 5 },
  cardFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  avatar: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: c.cardTop, alignItems: 'center', justifyContent: 'center' },
  avatarCh: { fontFamily: f.bold, fontSize: 9, color: c.cardLight },
  cta: { fontFamily: f.bold, fontSize: 10, letterSpacing: 0.4, color: c.goldDark },
  empty: { borderWidth: 1, borderColor: c.border, borderRadius: 14, padding: 24, backgroundColor: c.cardTop, alignItems: 'center', marginTop: 8 },
  emptyTitle: { fontFamily: f.italic, fontStyle: 'italic', fontSize: 14, color: c.muted },
  emptySub: { fontFamily: f.body, fontSize: 12.5, color: c.faint, marginTop: 6, textAlign: 'center' },
});
