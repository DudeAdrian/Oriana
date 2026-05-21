import React from 'react';
import { View, StyleSheet } from 'react-native';

const st = StyleSheet.create({
  iconSvgFix: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }
});

export const SunIcon = ({ color = "#D4AF37" }) => (
  <View style={st.iconSvgFix}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><circle cx="12" cy="12" r="5" fill={color}/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 18.36l1.42-1.42M18.36 4.22l1.42-1.42"/></svg></View>
);

export const MsgBubbleIcon = ({ color = "#D4AF37" }) => (
  <View style={st.iconSvgFix}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" fill={color}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></View>
);

export const VaultIcon = ({ color = "#D4AF37" }) => (
  <View style={st.iconSvgFix}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" fill={color === "#060B1A" ? "#060B1A" : "none"}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><circle cx="12" cy="12" r="2" fill={color}/></svg></View>
);

export const AntennaIcon = ({ color = "#D4AF37" }) => (
  <View style={st.iconSvgFix}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><path d="M12 2a10 10 0 0 1 10 10M12 6a6 6 0 0 1 6 6M12 10a2 2 0 0 1 2 2"/><circle cx="12" cy="18" r="1" fill={color}/><path d="M12 14v3"/></svg></View>
);

export const HiveTriangularCluster = ({ color = "#D4AF37" }) => (
  <View style={st.iconSvgFix}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 2l4 2.3v4.6l-4 2.3-4-2.3V4.3L12 2z" fill={color}/><path d="M6 11.5l4 2.3v4.6l-4 2.3-4-2.3v-4.6l4-2.3z" fill={color}/><path d="M18 11.5l4 2.3v4.6l-4 2.3-4-2.3v-4.6l4-2.3z" fill={color}/></svg></View>
);

export const TrueHollowBeeIcon = ({ color = "#7E8FA7" }) => (
  <View style={st.iconSvgFix}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="1.5" fill={color} />
      <path d="M10 2.5c-.5-.8-1.2-1-1.2-1M14 2.5c.5-.8 1.2-1 1.2-1" />
      <path d="M12 5.5c1.8 0 2.5 1.5 2.5 3s-.7 3.5-2.5 3.5-2.5-2-2.5-3.5.7-3.5 2.5-3.5z" fill={color === "#D4AF37" ? color : "none"} />
      <path d="M9.5 7.5C7 6 3.5 6 2.5 7.5S4 11 7.5 10c2-.5 2-1.5 2-2.5z" fill={color === "#D4AF37" ? "rgba(212, 175, 55, 0.2)" : "none"} />
      <path d="M14.5 7.5c2.5-1.5 6-1.5 7 0s-1.5 3.5-5 2.5c-2-.5-2-1.5-2-2.5z" fill={color === "#D4AF37" ? "rgba(212, 175, 55, 0.2)" : "none"} />
      <path d="M12 12c2 0 3 2 3 4.5S13.5 21 12 22.5c-1.5-1.5-3-3.5-3-6s1-4.5 3-4.5z" />
      <path d="M9.5 15h5M9.2 17.5h5.6M10 20h4" />
    </svg>
  </View>
);

export const MessengerInboxIcon = ({ color = "#7E8FA7" }) => (
  <View style={st.iconSvgFix}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></View>
);

export const NativeProfileIcon = ({ color = "#7E8FA7" }) => (
  <View style={st.iconSvgFix}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4" fill={color === "#D4AF37" ? "#D4AF37" : "none"}/></svg></View>
);
