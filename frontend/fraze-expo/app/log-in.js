import React, { useState } from 'react';
import { Text, TextInput, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '../lib/supabase';
import { c } from '../lib/theme';
import AuthShell, { auth as s } from '../components/AuthShell';
import SocialButtons from '../components/SocialButtons';

export default function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onLogIn() {
    setError(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) return setError(error.message);
  }

  return (
    <AuthShell>
      <Text style={s.blurb}>Welcome back. The archive kept the receipts.</Text>
      <Text style={s.label}>EMAIL</Text>
      <TextInput style={s.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@somewhere.com" placeholderTextColor={c.faint} />
      <Text style={s.label}>PASSWORD</Text>
      <TextInput style={s.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="you know the drill" placeholderTextColor={c.faint} />
      {error && <Text style={s.error}>{error}</Text>}
      <Pressable style={s.cta} onPress={onLogIn} disabled={busy}>
        <Text style={s.ctaText}>{busy ? 'CHECKING WHO YOU ARE…' : 'BACK TO THE ARCHIVE →'}</Text>
      </Pressable>
      <SocialButtons onError={setError} />
      <Link href="/sign-up" style={s.link}>New here? Join the record</Link>
    </AuthShell>
  );
}
