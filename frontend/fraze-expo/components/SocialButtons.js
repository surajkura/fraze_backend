import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../lib/supabase';
import { c, f } from '../lib/theme';

WebBrowser.maybeCompleteAuthSession();
const redirectTo = makeRedirectUri();

async function oauth(provider, onError) {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo, skipBrowserRedirect: true } });
  if (error) return onError?.(error.message);
  const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (res.type === 'success') {
    const params = new URLSearchParams(res.url.split('#')[1]);
    await supabase.auth.setSession({ access_token: params.get('access_token'), refresh_token: params.get('refresh_token') });
  }
}

const btn = { marginTop: 9, borderWidth: 1, borderColor: c.borderStrong, borderRadius: 999, paddingVertical: 12, alignItems: 'center', backgroundColor: c.cardLight };
export default function SocialButtons({ onError }) {
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(32,31,29,.14)' }} />
        <Text style={{ fontFamily: f.bold, fontSize: 8.5, letterSpacing: 0.8, color: c.faint }}>OR</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(32,31,29,.14)' }} />
      </View>
      <Pressable onPress={() => oauth('apple', onError)} style={[btn, { marginTop: 12 }]}>
        <Text style={{ fontFamily: f.bold, fontSize: 10.5, letterSpacing: 0.4, color: c.ink }}>{'\uF8FF'} CONTINUE WITH APPLE</Text>
      </Pressable>
      <Pressable onPress={() => oauth('google', onError)} style={btn}>
        <Text style={{ fontFamily: f.bold, fontSize: 10.5, letterSpacing: 0.4, color: c.ink }}>G  CONTINUE WITH GOOGLE</Text>
      </Pressable>
    </View>
  );
}
