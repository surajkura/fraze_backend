import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { c, f } from '../lib/theme';
import TabBar from './TabBar';

// Shared page shell: safe area + gradient-ish warm bg + bottom tab bar.
export default function Screen({ children, title, subtitle, right, tabs = true }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bgTop }} edges={['top']}>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        {title ? (
          <View style={s.header}>
            <View style={{ flex: 1 }}>
              <Text style={s.title}>{title}</Text>
              {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
            </View>
            {right}
          </View>
        ) : null}
        <View style={{ flex: 1 }}>{children}</View>
        {tabs && <TabBar />}
      </View>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 22, paddingTop: 12, paddingBottom: 4 },
  title: { fontFamily: f.heavy, fontSize: 28, letterSpacing: -0.9, color: c.gold },
  subtitle: { fontFamily: f.italic, fontStyle: 'italic', fontSize: 13, color: c.muted, marginTop: 4 },
});
