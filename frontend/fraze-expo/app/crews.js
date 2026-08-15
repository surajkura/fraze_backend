import React from 'react';
import { FlatList, Text, View } from 'react-native';
import Screen from '../components/Screen';
import MemoryCard from '../components/MemoryCard';
import { useMemories } from '../hooks/useData';
import { c, f } from '../lib/theme';

export default function Crews() {
  const { memories, loading } = useMemories();
  return (
    <Screen title="crews" subtitle="Too real for the feed. Fresh from every crew.">
      <FlatList
        data={memories}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 22, gap: 14 }}
        ListEmptyComponent={
          <Text style={{ fontFamily: f.italic, fontStyle: 'italic', color: c.faint, textAlign: 'center', marginTop: 30 }}>
            {loading ? 'consulting the record…' : 'Nothing here yet. Get weirder.'}
          </Text>
        }
        renderItem={({ item }) => (
          <MemoryCard memory={item} authorName={item.profiles?.display_name} crewName={item.crews?.name} />
        )}
      />
    </Screen>
  );
}
