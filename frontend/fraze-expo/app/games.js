import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '../components/Screen';
import { c, f } from '../lib/theme';

const GAMES = [
  { id: 'who', glyph: '\u201D', title: 'who said it?', tag: 'You know. Prove it.', href: '/who-said-it', live: true },
  { id: 'define', glyph: '\u00A7', title: 'define it', tag: 'Flip the card. Was yours better?' },
  { id: 'caption', glyph: '\u25CE', title: 'caption this', tag: 'Blind captions. Vote the funniest.' },
  { id: 'timeline', glyph: '\u21BA', title: 'timeline rewind', tag: 'Put the chaos in order.' },
  { id: 'ttl', glyph: '\u2715', title: 'two truths & a lie', tag: 'Spot the planted definition.' },
  { id: 'year', glyph: '\u2605', title: 'the yearbook', tag: 'Superlatives, with receipts.' },
];

export default function Games() {
  const router = useRouter();
  return (
    <Screen title="game night" subtitle="Pick your poison. The archive remembers everything.">
      <ScrollView contentContainerStyle={{ padding: 22, gap: 10 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {GAMES.map((g) => (
            <Pressable key={g.id} onPress={() => g.href && router.push(g.href)}
              style={[s.card, !g.live && { opacity: 0.55 }]}>
              <Text style={{ color: c.gold, fontSize: 17 }}>{g.glyph}</Text>
              <Text style={s.gameTitle}>{g.title}</Text>
              <Text style={s.gameTag}>{g.live ? g.tag : 'coming soon — milestone 2'}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
const s = StyleSheet.create({
  card: { flexBasis: '47%', flexGrow: 1, borderWidth: 1, borderColor: c.border, borderRadius: 14, padding: 16, backgroundColor: c.cardTop },
  gameTitle: { fontFamily: f.bold, fontSize: 13, color: c.ink, marginTop: 8 },
  gameTag: { fontFamily: f.italic, fontStyle: 'italic', fontSize: 11, color: c.metaGray, marginTop: 3, lineHeight: 15 },
});
