import React from 'react';
import { FlatList, Text } from 'react-native';
import Screen from '../components/Screen';
import MemoryCard from '../components/MemoryCard';
import { useMemories } from '../hooks/useData';
import { c, f } from '../lib/theme';

export default function Vault() {
  const { memories, loading } = useMemories({ kind: 'unpostable' });
  return (
    <Screen title="the vault" subtitle="Unfiltered, unposted, unforgotten.">
      <FlatList
        data={memories}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 22, gap: 14 }}
        ListEmptyComponent={
          <Text style={{ fontFamily: f.italic, fontStyle: 'italic', color: c.faint, textAlign: 'center', marginTop: 30 }}>
            {loading ? 'dusting off the shoebox…' : 'The vault is empty. Statistically, that cannot last.'}
          </Text>
        }
        renderItem={({ item }) => (
          <MemoryCard memory={item} authorName={item.profiles?.display_name} crewName={item.crews?.name} />
        )}
      />
    </Screen>
  );
}
