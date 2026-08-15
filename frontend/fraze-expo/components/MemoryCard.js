import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { c, f, avatarColor } from '../lib/theme';

const KICKERS = { quote: '\u201D A QUOTE', term: '\u00A7 AN INSIDE JOKE', unpostable: '\u25CE AN UNPOSTABLE', voice: '\u25B6 A VOICE MEMO' };

export default function MemoryCard({ memory, authorName, crewName }) {
  const kind = memory.kind;
  const when = new Date(memory.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toUpperCase();
  return (
    <View style={s.card}>
      <View style={s.headRow}>
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', flex: 1 }}>
          <Text style={s.kicker}>{KICKERS[kind] || KICKERS.quote}</Text>
          {crewName ? <Text style={s.crewTag}>IN {crewName.toUpperCase()}</Text> : null}
        </View>
        <Text style={s.time}>{when}</Text>
      </View>
      {kind === 'unpostable' && (
        <View style={s.photoWrap}>
          <View style={s.photo}><Text style={s.photoPh}>{memory.text || '[ evidence on file ]'}</Text></View>
          <Text style={s.unpostable}>{'\u25CE'} UNPOSTABLE</Text>
        </View>
      )}
      {kind !== 'unpostable' && memory.text ? (
        <View style={s.quoteRow}>
          <Text style={s.quoteText}>{kind === 'quote' ? '"' + memory.text + '"' + (memory.said_by ? ' — ' + memory.said_by : '') : memory.text}</Text>
        </View>
      ) : null}
      {kind === 'term' && memory.definition ? <Text style={s.def}>{memory.definition}</Text> : null}
      <View style={s.footRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
          <View style={[s.avatar, { backgroundColor: avatarColor(authorName) }]}>
            <Text style={s.avatarCh}>{(authorName || '?').charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={s.attr}>Filed by {authorName || 'someone'}</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderWidth: 1, borderColor: c.border, borderRadius: 14, backgroundColor: c.cardTop, overflow: 'hidden', shadowColor: '#2d2b2b', shadowOpacity: 0.08, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingTop: 14 },
  kicker: { borderWidth: 1, borderColor: 'rgba(182,130,53,.45)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, fontFamily: f.bold, fontSize: 9, letterSpacing: 0.5, color: c.goldDark, backgroundColor: 'rgba(182,130,53,.08)', overflow: 'hidden' },
  crewTag: { borderWidth: 1, borderColor: 'rgba(32,31,29,.18)', borderRadius: 999, paddingHorizontal: 11, paddingVertical: 4, fontFamily: f.bold, fontSize: 9, letterSpacing: 0.4, color: '#5c584f', backgroundColor: c.cardLight, overflow: 'hidden' },
  time: { fontFamily: f.bold, fontSize: 9.5, letterSpacing: 0.4, color: c.faint },
  photoWrap: { marginHorizontal: 18, marginTop: 14, position: 'relative' },
  photo: { height: 190, borderRadius: 8, backgroundColor: '#e3dccb', alignItems: 'center', justifyContent: 'center' },
  photoPh: { fontFamily: f.bold, fontSize: 10.5, color: c.metaGray },
  unpostable: { position: 'absolute', top: 10, left: 10, borderWidth: 1, borderColor: 'rgba(176,82,63,.65)', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3, fontFamily: f.bold, fontSize: 8.5, letterSpacing: 0.5, color: c.rust, backgroundColor: 'rgba(246,244,239,.9)', transform: [{ rotate: '-2deg' }], overflow: 'hidden' },
  quoteRow: { paddingHorizontal: 18, paddingTop: 14, borderLeftWidth: 0 },
  quoteText: { borderLeftWidth: 3, borderLeftColor: c.gold, paddingLeft: 14, fontFamily: f.italicMed, fontStyle: 'italic', fontSize: 16, lineHeight: 24, color: c.ink },
  def: { paddingHorizontal: 18, paddingTop: 10, fontFamily: f.body, fontSize: 13.5, lineHeight: 21, color: c.inkSoft },
  footRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14 },
  avatar: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  avatarCh: { fontFamily: f.bold, fontSize: 9, color: c.cardLight },
  attr: { fontFamily: f.italic, fontStyle: 'italic', fontSize: 11.5, color: c.muted },
});
