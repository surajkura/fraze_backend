# fraze — Expo + React Native + Supabase

The real app. The HTML prototype repo was visual reference only; this recreates its look
with native components (View/Text/Pressable + StyleSheet), tokens in `lib/theme.js`.

## Run

```
npm install
cp .env.example .env   # fill in Supabase URL + anon key
npx expo start
```

## Supabase setup (once)

1. Run `supabase/schema.sql` in the SQL editor — profiles/crews/crew_members/memories, signup trigger, RLS.
2. Auth > Email: enable **Email OTP** (two-step signup: signUp() emails a 6-digit code, verifyOtp() completes it).
3. Auth > Providers: enable Apple/Google; add the redirect URI from makeRedirectUri() to Redirect URLs.
4. Optional: `supabase/seed.sql` to seed a first crew.

## Structure

- `app/_layout.js` — fonts, AuthProvider, Stack.Protected auth gate (signed-out users only ever see sign-up/log-in)
- `app/sign-up.js`, `app/log-in.js` — two-step OTP signup, password login, social buttons
- `app/index.js` (home), `app/crews.js`, `app/vault.js`, `app/games.js` — tab screens (custom TabBar, matches prototype)
- `app/crew.js?id=` — Crew HQ (roulette, tiles) + feed/dictionary/quotes/vault chips
- `app/add.js` — modal add-a-memory with per-category reactive prompts
- `app/who-said-it.js` — live game pulling attributed quotes; other five games are stubs for milestone 2
- `components/` MemoryCard, TabBar, Screen, AuthShell, SocialButtons; `hooks/useData.js` crews/memories queries

## Milestone 2 (not built yet)
- Photo upload for unpostables (Supabase Storage), voice memos, comments/reactions tables,
  remaining five games, crew management (invites, cover vibes), person filter.

Note: route files use flat names (`app/crew.js?id=`) rather than `(group)/[param]` segments.
