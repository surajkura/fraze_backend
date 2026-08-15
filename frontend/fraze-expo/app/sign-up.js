import React, { useState } from 'react';
import { Text, TextInput, Pressable, View } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '../lib/supabase';
import { c } from '../lib/theme';
import AuthShell, { auth as s } from '../components/AuthShell';
import SocialButtons from '../components/SocialButtons';

export default function SignUp() {
  const [step, setStep] = useState('form');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onSignUp() {
    setError(null);
    if (!displayName.trim()) return setError('The crew needs something to call you.');
    if (password.length < 8) return setError('Eight characters minimum. Your secrets deserve better.');
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(), password,
      options: { data: { display_name: displayName.trim() } },
    });
    setBusy(false);
    if (error) return setError(error.message);
    setStep('code');
  }

  async function onVerify() {
    setError(null);
    if (!/^\d{6}$/.test(code.trim())) return setError('Six digits. The archive counted, and that was not six digits.');
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'signup' });
    setBusy(false);
    if (error) return setError(error.message);
  }

  return (
    <AuthShell>
      {step === 'form' ? (
        <>
          <Text style={s.blurb}>The archive doesn't know you yet. Fix that.</Text>
          <Text style={s.label}>WHAT THE CREW CALLS YOU</Text>
          <TextInput style={s.input} value={displayName} onChangeText={setDisplayName} placeholder="display name — nicknames encouraged" placeholderTextColor={c.faint} />
          <Text style={s.label}>EMAIL</Text>
          <TextInput style={s.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@somewhere.com" placeholderTextColor={c.faint} />
          <Text style={s.label}>PASSWORD</Text>
          <TextInput style={s.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="something even the crew can't guess" placeholderTextColor={c.faint} />
          {error && <Text style={s.error}>{error}</Text>}
          <Pressable style={s.cta} onPress={onSignUp} disabled={busy}>
            <Text style={s.ctaText}>{busy ? 'CONSULTING THE RECORD…' : 'JOIN THE RECORD →'}</Text>
          </Pressable>
          <SocialButtons onError={setError} />
          <Link href="/log-in" style={s.link}>Already in the record? Log in</Link>
        </>
      ) : (
        <>
          <Text style={s.blurb}>Check your inbox. We sent a six-digit code to {email.trim()} — the archive doesn't let just anyone in.</Text>
          <Text style={s.label}>THE CODE</Text>
          <TextInput style={[s.input, s.codeInput]} value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} placeholder="6 digits, no pressure" placeholderTextColor={c.faint} />
          {error && <Text style={s.error}>{error}</Text>}
          <Pressable style={s.cta} onPress={onVerify} disabled={busy}>
            <Text style={s.ctaText}>{busy ? 'CHECKING THE CODE…' : 'VERIFY & JOIN THE RECORD →'}</Text>
          </Pressable>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }}>
            <Pressable onPress={() => supabase.auth.resend({ type: 'signup', email: email.trim() })}><Text style={s.link}>Resend the code</Text></Pressable>
            <Pressable onPress={() => setStep('form')}><Text style={[s.link, { color: c.faint }]}>← Wrong email</Text></Pressable>
          </View>
        </>
      )}
    </AuthShell>
  );
}
