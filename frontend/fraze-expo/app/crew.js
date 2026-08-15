import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Screen from '../components/Screen';
import MemoryCard from '../components/MemoryCard';
import { useCrews, useMemories } from '../hooks/useData';
import { c, f, avatarColor } from '../lib/theme';

const CHIPS = ['CREW HQ', 'THE FEED', 'DICTIONARY', 'QUOTES', 'VAULT'];
const KINDS = { DICTIONARY: 'term', QUOTES: 'quote', VAULT: 'unpostable' };

export default function Crew() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { crews } = useCrews();
  const crew = crews.find((x) => x.id === id);
  const [chipTab, setChipTab] = useState('CREW HQ');
  const { memories, loading } = useMemories({ crewId: id, kind: KINDS[chipTab] });
  const [rand, setRand] = useState(null);
  const members = crew?.crew_members ?? [];

  const tiles = useMemo(() => ([
    { glyph: '\u00A7', label: 'the dictionary', phrase: 'The story behind the story.', tab: 'DICTIONARY' },
    { glyph: '\u201D', label: 'the quote book', phrase: 'Screenshot before it scrolls away.', tab: 'QUOTES' },
    { glyph: '\u25CE', label: 'the vault', phrase: 'Unfiltered, unposted, unforgotten.', tab: 'VAULT' },
    { glyph: '?', label: 'game night', phrase: 'Pick your poison.', go: () => router.push({ pathname: '/who-said-it', params: { crew: id } }) },
  ]), [id]);

  return (
    <Screen tabs>
      <View style={s.head}>
        <Pressable onPress={() => router.back()}><Text style={{ fontSize: 16, color: c.goldDark, padding: 4 }}>{'\u2190'}</Text></Pressable>
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{crew?.name ?? '…'}</Text>
          {crew?.subtitle ? <Text style={s.sub}>{crew.subtitle}</Text> : null}
        </View>
        <View style={{ flexDirection: 'row' }}>
          {members.slice(0, 5).map((m, i) => (
            <View key={i} style={[s.avatar, { backgroundColor: avatarColor(m.profiles?.display_name), marginLeft: i ? -6 : 0 }]} />
          ))}
        </View>
      </View>
      <View style={s.chipRow}>
        {CHIPS.map((ch) => (
          <Pressable key={ch} style={[s.chip, chipTab === ch && s.chipSel]} onPress={() => setChipTab(ch)}>
            <Text style={[s.chipText, chipTab === ch && { color: c.goldDark }]}>{ch}</Text>
          </Pressable>
        ))}
      </View>
      {chipTab === 'CREW HQ' ? (
        <FlatList
          data={[]}
          renderItem={null}
          contentContainerStyle={{ padding: 20, gap: 14 }}
          ListHeaderComponent={
            <View style={{ gap: 14 }}>
              <View style={s.roulette}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={s.rouletteTitle}>{'\u273A'} REMINISCE ROULETTE</Text>
                  <Pressable style={s.spin} onPress={() => setRand(memories.length ? memories[Math.floor(Math.random() * memories.length)] : null)}>
                    <Text style={s.spinText}>SPIN →</Text>
                  </Pressable>
                </View>
                {rand
                  ? <Text style={s.rouletteQuote}>"{rand.text}"</Text>
                  : <Text style={s.rouletteHint}>Pull a random memory from the archive. Dealer's choice.</Text>}
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {tiles.map((t) => (
                  <Pressable key={t.label} style={s.tile} onPress={() => (t.go ? t.go() : setChipTab(t.tab))}>
                    <Text style={{ color: c.gold, fontSize: 15 }}>{t.glyph}</Text>
                    <Text style={s.tileLabel}>{t.label}</Text>
                    <Text style={s.tilePhrase}>{t.phrase}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          }
        />
      ) : (
        <FlatList
          data={memories}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 20, gap: 14 }}
          ListEmptyComponent={
            <Text style={s.emptyText}>{loading ? 'consulting the record…' : 'Nothing here yet. Get weirder.'}</Text>
          }
          renderItem={({ item }) => <MemoryCard memory={item} authorName={item.profiles?.display_name} />}
        />
      )}
    </Screen>
  );
}
const s = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 12 },
  name: { fontFamily: f.bold, fontSize: 19, letterSpacing: -0.3, color: c.ink },
  sub: { fontFamily: f.bold, fontSize: 9.5, letterSpacing: 0.4, color: c.faint, marginTop: 2 },
  avatar: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: c.bg },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: c.divider },
  chip: { borderWidth: 1, borderColor: c.borderInput, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: c.cardLight },
  chipSel: { borderColor: c.gold, backgroundColor: c.goldWash },
  chipText: { fontFamily: f.bold, fontSize: 10, letterSpacing: 0.4, color: c.muted },
  roulette: { borderWidth: 1, borderColor: 'rgba(182,130,53,.5)', borderRadius: 14, padding: 18, backgroundColor: c.goldWash },
  rouletteTitle: { fontFamily: f.bold, fontSize: 10, letterSpacing: 0.6, color: c.goldDark },
  spin: { borderWidth: 1, borderColor: c.gold, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: 'rgba(253,252,249,.6)' },
  spinText: { fontFamily: f.heavy, fontSize: 9.5, letterSpacing: 0.5, color: c.goldDark },
  rouletteQuote: { fontFamily: f.italicMed, fontStyle: 'italic', fontSize: 15, lineHeight: 22, color: c.ink, marginTop: 10 },
  rouletteHint: { fontFamily: f.italic, fontStyle: 'italic', fontSize: 12.5, color: c.muted, marginTop: 10 },
  tile: { flexBasis: '47%', flexGrow: 1, borderWidth: 1, borderColor: c.border, borderRadius: 14, padding: 16, backgroundColor: c.cardTop },
  tileLabel: { fontFamily: f.bold, fontSize: 12.5, color: c.ink, marginTop: 8 },
  tilePhrase: { fontFamily: f.italic, fontStyle: 'italic', fontSize: 11, color: c.metaGray, marginTop: 3, lineHeight: 15 },
  emptyText: { fontFamily: f.italic, fontStyle: 'italic', color: c.faint, textAlign: 'center', marginTop: 30 },
});
