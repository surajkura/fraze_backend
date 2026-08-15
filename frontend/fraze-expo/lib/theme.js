// fraze design tokens — translated from the prototype's styles.css / inline styles.
export const c = {
  bg: '#f6f4ef', bgTop: '#f9f6ee', bgBottom: '#efe6d3',
  card: '#efe9dc', cardTop: '#f1ebde', cardBottom: '#ece2cd', cardLight: '#fdfcf9',
  ink: '#201f1d', inkSoft: '#3d3a35', muted: '#6e6a62', faint: '#a09a8e', metaGray: '#8a8478',
  gold: '#b68235', goldDark: '#7d5411', goldWash: '#f2e8d5', goldWashDeep: '#efdcbb',
  rust: '#b0523f', rustBorder: 'rgba(176,82,63,.5)',
  border: 'rgba(32,31,29,.13)', borderInput: 'rgba(32,31,29,.16)', borderStrong: 'rgba(32,31,29,.22)',
  divider: 'rgba(32,31,29,.1)',
  avatars: { P: '#8b7bd8', M: '#7bafd8', E: '#d88ba8', S: '#7bc9a4', J: '#c9b07b', D: '#c98a7b', A: '#7bc9c1', R: '#b8a4d8', G: '#d8a47b', K: '#8bb87b', N: '#d87b96', T: '#7b96d8' },
};
export const f = {
  heavy: 'BricolageGrotesque_800ExtraBold',
  bold: 'BricolageGrotesque_700Bold',
  body: 'InstrumentSans_400Regular',
  bodyMed: 'InstrumentSans_500Medium',
  italic: 'InstrumentSans_400Regular_Italic',
  italicMed: 'InstrumentSans_500Medium_Italic',
};
// shared bits
export const shadows = { card: { shadowColor: '#2d2b2b', shadowOpacity: 0.08, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 2 } };
export const kicker = { fontFamily: f.bold, fontSize: 9, letterSpacing: 0.5, color: c.goldDark };
export const metaLabel = { fontFamily: f.bold, fontSize: 10, letterSpacing: 0.6, color: c.metaGray };
export function avatarColor(name) {
  const ch = (name || '?').charAt(0).toUpperCase();
  return c.avatars[ch] || '#9b9797';
}
