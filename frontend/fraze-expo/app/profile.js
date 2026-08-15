import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { c, f } from '../lib/theme';

export default function Profile() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const [stats, setStats] = useState({ crews: 0, quotes: 0, terms: 0, frazes: 0 });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const count = (q) => q.then((r) => r.count ?? 0);
      const [crews, quotes, terms, frazes] = await Promise.all([
        count(supabase.from('crew_members').select('*', { count: 'exact', head: true }).eq('user_id', user.id)),
        count(supabase.from('memories').select('*', { count: 'exact', head: true }).eq('author_id', user.id).eq('kind', 'quote')),
        count(supabase.from('memories').select('*', { count: 'exact', head: true }).eq('author_id', user.id).eq('kind', 'term')),
        count(supabase.from('memories').select('*', { count: 'exact', head: true }).eq('author_id', user.id)),
      ]);
      setStats({ crews, quotes, terms, frazes });
    })();
  }, [user?.id]);

  const name = profile?.display_name ?? 'you';
  const cells = [[stats.crews, 'CREWS'], [stats.quotes, 'QUOTES SAID'], [stats.terms, 'TERMS COINED'], [stats.frazes, 'FRAZES CONTRIBUTED']];

  return (
    <Screen tabs={false}>
      <ScrollView contentContainerStyle={{ padding: 22, gap: 16 }}>
        <Pressable onPress={() => router.back()}><Text style={{ fontSize: 16, color: c.goldDark }}>{'\u2190'}</Text></Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={s.bigAvatar}><Text style={s.bigAvatarCh}>{name.charAt(0).toUpperCase()}</Text></View>
          <View>
            <Text style={s.name}>{name}</Text>
            <Text style={s.tag}>The archive knows you well.</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {cells.map(([n, label]) => (
            <View key={label} style={s.stat}>
              <Text style={s.statN}>{n}</Text>
              <Text style={s.statLabel}>{label}</Text>
            </View>
          ))}
        </View>
        <View style={s.cert}>
          <Text style={s.certTitle}>CERTIFIED: HAS NEVER VIOLATED OUR COMMUNITY GUIDELINES</Text>
          <Text style={s.certSub}>Technically. The vault says otherwise.</Text>
        </View>
        <Pressable onPress={signOut} style={s.logout}>
          <Text style={s.logoutText}>LOG OUT — THE ARCHIVE WILL WAIT</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}
const s = StyleSheet.create({
  bigAvatar: { width: 58, height: 58, borderRadius: 29, borderWidth: 1.5, borderColor: c.gold, backgroundColor: c.goldWash, alignItems: 'center', justifyContent: 'center' },
  bigAvatarCh: { fontFamily: f.heavy, fontSize: 23, color: c.goldDark },
  name: { fontFamily: f.heavy, fontSize: 28, letterSpacing: -0.8, color: c.gold },
  tag: { fontFamily: f.italic, fontStyle: 'italic', fontSize: 12, color: c.muted, marginTop: 3 },
  stat: { flexBasis: '47%', flexGrow: 1, borderWidth: 1, borderColor: c.border, borderRadius: 14, padding: 17, backgroundColor: c.cardTop },
  statN: { fontFamily: f.heavy, fontSize: 28, letterSpacing: -0.5, color: c.gold },
  statLabel: { fontFamily: f.bold, fontSize: 9.5, letterSpacing: 0.5, color: c.metaGray, marginTop: 2 },
  cert: { borderWidth: 1, borderColor: 'rgba(182,130,53,.5)', borderRadius: 14, padding: 17, backgroundColor: c.goldWash },
  certTitle: { fontFamily: f.bold, fontSize: 9.5, letterSpacing: 0.4, color: c.goldDark },
  certSub: { fontFamily: f.italic, fontStyle: 'italic', fontSize: 12.5, color: c.muted, marginTop: 8 },
  logout: { borderWidth: 1, borderColor: c.borderStrong, borderRadius: 999, paddingVertical: 12, alignItems: 'center', backgroundColor: c.cardLight },
  logoutText: { fontFamily: f.bold, fontSize: 10, letterSpacing: 0.5, color: c.muted },
});
