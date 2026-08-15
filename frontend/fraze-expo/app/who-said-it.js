import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Screen from '../components/Screen';
import { useMemories, useCrews } from '../hooks/useData';
import { c, f } from '../lib/theme';

function shuffle(a) { return [...a].sort(() => Math.random() - 0.5); }

export default function WhoSaidIt() {
  const { crew } = useLocalSearchParams();
  const router = useRouter();
  const { crews } = useCrews();
  const { memories } = useMemories({ crewId: crew || undefined, kind: 'quote' });
  const quotes = memories.filter((m) => m.said_by);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState({ r: 0, t: 0 });

  const q = quotes[idx % Math.max(quotes.length, 1)];
  const options = useMemo(() => {
    if (!q) return [];
    const names = new Set([q.said_by]);
    const pool = crew
      ? (crews.find((x) => x.id === crew)?.crew_members ?? []).map((m) => m.profiles?.display_name)
      : quotes.map((m) => m.said_by);
    shuffle(pool.filter(Boolean)).forEach((n) => names.size < 4 && names.add(n));
    return shuffle([...names]);
  }, [q?.id, crews.length]);

  function pick(name) {
    if (picked) return;
    setPicked(name);
    setScore((s) => ({ r: s.r + (name === q.said_by ? 1 : 0), t: s.t + 1 }));
  }

  return (
    <Screen tabs={false}>
      <ScrollView contentContainerStyle={{ padding: 22, gap: 14 }}>
        <Pressable onPress={() => router.back()}><Text style={{ fontSize: 16, color: c.goldDark }}>{'\u2190'} GAMES</Text></Pressable>
        <Text style={s.title}>who said it?</Text>
        <Text style={s.meta}>{crew ? 'THIS CREW ONLY' : 'ALL YOUR CREWS'} · SCORE {score.r}/{score.t}</Text>
        {!q ? (
          <View style={s.card}><Text style={s.hint}>No attributed quotes yet. File some quotes with a "who said it" and come back — the archive needs material.</Text></View>
        ) : (
          <>
            <View style={s.card}><Text style={s.quote}>"{q.text}"</Text></View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {options.map((name) => {
                const isAnswer = picked && name === q.said_by;
                const isWrongPick = picked === name && name !== q.said_by;
                return (
                  <Pressable key={name} onPress={() => pick(name)}
                    style={[s.opt, isAnswer && s.optRight, isWrongPick && s.optWrong]}>
                    <Text style={[s.optText, isAnswer && { color: c.goldDark }, isWrongPick && { color: c.rust }]}>
                      {name} {isAnswer ? '\u2713' : isWrongPick ? '\u2715' : ''}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {picked && (
              <View style={s.reveal}>
                <Text style={s.revealTitle}>{picked === q.said_by ? '\u2713 CORRECT. YOU KNOW YOUR PEOPLE.' : '\u2715 WRONG. STUDY THE ARCHIVE.'}</Text>
                <Pressable style={s.next} onPress={() => { setIdx((i) => i + 1); setPicked(null); }}>
                  <Text style={s.nextText}>NEXT QUOTE →</Text>
                </Pressable>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
const s = StyleSheet.create({
  title: { fontFamily: f.heavy, fontSize: 28, letterSpacing: -0.9, color: c.gold },
  meta: { fontFamily: f.bold, fontSize: 10, letterSpacing: 0.6, color: c.metaGray },
  card: { borderWidth: 1, borderColor: c.border, borderRadius: 14, padding: 22, backgroundColor: c.cardTop },
  quote: { fontFamily: f.italicMed, fontStyle: 'italic', fontSize: 17, lineHeight: 26, color: c.ink },
  hint: { fontFamily: f.italic, fontStyle: 'italic', fontSize: 13.5, lineHeight: 20, color: c.muted },
  opt: { flexBasis: '47%', flexGrow: 1, borderWidth: 1, borderColor: c.borderInput, borderRadius: 12, padding: 15, backgroundColor: c.cardLight },
  optRight: { borderColor: c.gold, backgroundColor: c.goldWash },
  optWrong: { borderColor: 'rgba(176,82,63,.6)' },
  optText: { fontFamily: f.bodyMed, fontSize: 14, color: c.ink },
  reveal: { borderWidth: 1, borderColor: 'rgba(182,130,53,.5)', borderRadius: 14, padding: 17, backgroundColor: c.goldWash },
  revealTitle: { fontFamily: f.bold, fontSize: 10, letterSpacing: 0.6, color: c.goldDark },
  next: { alignSelf: 'flex-start', marginTop: 12, borderWidth: 1, borderColor: c.gold, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 8 },
  nextText: { fontFamily: f.bold, fontSize: 10, letterSpacing: 0.5, color: c.goldDark },
});
