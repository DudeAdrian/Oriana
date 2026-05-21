import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SpatialEngine({ triggerNotification }) {
  const [animalsTagged, setAnimalsTagged] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  const tagNativeFauna = (species, points) => {
    if (!animalsTagged.includes(species)) {
      setAnimalsTagged([...animalsTagged, species]);
      setTotalPoints(totalPoints + points);
      triggerNotification("?? SPECIES TAGGED: " + species + " // +" + points + " XP");
    }
  };

  return (
    <View style={st.container}>
      <Text style={st.header}>???? FAUNA LEDGER</Text>
      <View style={st.grid}>
        {['Kookaburra', 'Wombat', 'Platypus'].map(s => (
          <TouchableOpacity key={s} style={st.btn} onPress={() => tagNativeFauna(s, 50)}>
            <Text style={st.btnTxt}>{animalsTagged.includes(s) ? '?' : '??'} {s}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={st.points}>Total Credits: {totalPoints} AUD Equivalency</Text>
    </View>
  );
}

const st = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0A1128', borderRadius: 12, borderWidth: 1, borderColor: '#D4AF37' },
  header: { color: '#D4AF37', fontWeight: '900', marginBottom: 10 },
  grid: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { backgroundColor: '#060B1A', padding: 8, borderRadius: 6, borderWidth: 0.5, borderColor: '#D4AF37' },
  btnTxt: { color: '#FFFFFF', fontSize: 10 },
  points: { color: '#39FF14', marginTop: 12, fontWeight: '800', textAlign: 'center' }
});
