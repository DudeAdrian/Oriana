import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

export default function TasksARScreen({ totalWalletPoints, handleFaunaTag, setArModalActive, faunaTasksList }) {
  const [arTab, setArTab] = useState('INFO'); // INFO, MAP, CARDS, REWARDS
  const [capturingId, setCapturingId] = useState(null);
  const [captureStage, setCaptureStage] = useState(0); // 0: Idle, 1: Hive Dropped, 2: Honey Flowing, 3: Minting NFT

  // Expanded Taxonomy Database Setup for 144+ Scale Alignment
  const [extendedFauna, setExtendedFauna] = useState([
    { id: 't1', name: 'Laughing Kookaburra', class: 'Aves (Bird)', schedule: 'Diurnal (Daytime)', difficulty: 'Lvl 1 (Common)', points: 150, region: 'Victoria Capital (0-50km Range)', desc: 'Carnivorous tree kingfisher native to eastern Australia. Spawns predominantly around morning solar spikes.', tagged: false },
    { id: 't2', name: 'Bare-nosed Wombat', class: 'Marsupial', schedule: 'Nocturnal (Night)', difficulty: 'Lvl 2 (Uncommon)', points: 250, region: 'Victoria Forest (50-100km Buffer)', desc: 'Sturdy burrowing herbivore. Leaves distinct cubic structural ledger markings in wilderness territories.', tagged: false },
    { id: 't3', name: 'Platypus', class: 'Semi-Aquatic Mammal', schedule: 'Crepuscular (Dawn/Dusk)', difficulty: 'Lvl 3 (Rare)', points: 400, region: 'Yarra Catchment Streams (Local)', desc: 'Venomous egg-laying mammal. Extreme structural sensory detection via electromagnetic bill sensors.', tagged: false },
    { id: 't4', name: 'Southern Right Whale', class: 'Marine Mammal', schedule: 'Tidal Alignment Shift', difficulty: 'Lvl 4 (Apex)', points: 850, region: 'Coastal Port Phillip Marine Zone', desc: 'Baleen whale migration sentinel. Spawns strictly on high-tide ocean node triggers.', tagged: false }
  ]);

  const triggerCaptureSequence = (id) => {
    setCapturingId(id);
    setCaptureStage(1); // Drop Hive Cell
  };

  useEffect(() => {
    if (captureStage === 1) {
      const t = setTimeout(() => setCaptureStage(2), 1000); // Deploy Digital Honey Bait
      return () => clearTimeout(t);
    }
    if (captureStage === 2) {
      const t = setTimeout(() => setCaptureStage(3), 1500); // Fauna feeding & minting loop
      return () => clearTimeout(t);
    }
  }, [captureStage]);

  const confirmCaptureToLedger = (id, points, name) => {
    // Pass execution up to master points index hook
    handleFaunaTag(id, name, points);
    
    // Update local database shadow state card parameters instantly
    setExtendedFauna(prev => prev.map(f => f.id === id ? { ...f, tagged: true } : f));
    setCapturingId(null);
    setCaptureStage(0);
  };

  return (
    <View style={st.container}>
      {/* Immersive Header Panel Block */}
      <View style={st.arOverlayHeaderBannerBlock}>
        <Text style={st.arOverlayHeaderTitle}>???? ECOSYSTEM PROTOCOL MATRIX</Text>
        <TouchableOpacity style={st.arOverlayCloseTextBtn} onPress={() => setArModalActive(false)}>
          <Text style={st.closeTxtBtnLabel}>? CLOSE PROT</Text>
        </TouchableOpacity>
      </View>

      {/* Synchronized Point Status Deck Ticker */}
      <View style={st.arPointsWalletTickerStrip}>
        <Text style={st.tickerLabel}>TOTAL NATIVE INCENTIVES LEDGER</Text>
        <Text style={st.tickerPoints}>{totalWalletPoints} CREDITS</Text>
      </View>

      {/* Custom Inner Mode Navigation Selector Tabs Row */}
      <View style={st.arInnerTabRowSelector}>
        {['INFO', 'MAP', 'CARDS', 'REWARDS'].map(tab => (
          <TouchableOpacity key={tab} style={[st.arInnerTabBtn, arTab === tab && st.arInnerTabBtnActive]} onPress={() => setArTab(tab)}>
            <Text style={[st.arInnerTabBtnTxt, arTab === tab && { color: '#060B1A', fontWeight: '900' }]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conditional Inner Content Body Routing */}
      <View style={{ flex: 1, marginTop: 8 }}>
        
        {/* 1. Protocol Welcome Info Deck Section */}
        {arTab === 'INFO' && (
          <ScrollView style={st.scrollPane}>
            <Text style={st.sectionHeader}>?? CROWD-SOURCED ECOLOGICAL PROTOCOL</Text>
            <Text style={st.bodyPara}>Oriana interfaces directly with your localized grid node to track native Australian fauna and botanical send vectors. By mapping these environments, you establish crowdsourced data checkpoints anchoring directly to the decentralized ledger framework.</Text>
            <Text style={st.bodyPara}>Every successful interaction verifies biodiversity parameters within your active 100km capital jurisdiction zone. This action mints unique shadow tracking assets straight into your platform wallet database.</Text>
          </ScrollView>
        )}

        {/* 2. Interactive Spatial Map Spawn Grid Section */}
        {arTab === 'MAP' && (
          <View style={st.mapLayoutContainerSpace}>
            <Text style={st.sectionHeader}>?? LOCAL JURISDICTION RADIUS MAPPING</Text>
            <View style={st.simulatedMapGridCanvasFrame}>
              <Text style={st.mapPingTextMarker}>? ACTIVE USER LOCATION LAYER</Text>
              <View style={st.mapGridHollowBeeCellPulseNode} />
              <Text style={st.mapCoordinatesLabelDeck}>GPS Latency Bridge: Synergized via Local Host Mesh</Text>
              
              {/* Dynamic proximity live tracker indicators */}
              <View style={st.proximityAlertWarningBannerCard}>
                <Text style={st.proximityWarningTxt}>?? UNVERIFIED LIVE FAUNA PHENOMENON DETECTED NEARBY</Text>
              </View>
            </View>
            <Text style={st.mapFooterScheduleSubText}>Schedule Spawn Cycles update automatically via ledger rotation timetables every 120 minutes.</Text>
          </View>
        )}

        {/* 3. Immersive Shadow Trading Cards Section */}
        {arTab === 'CARDS' && (
          <ScrollView style={st.scrollPane} contentContainerStyle={{ paddingBottom: 24 }}>
            {extendedFauna.map(f => (
              <View key={f.id} style={[st.shadowTradingCardFrame, f.tagged && st.shadowTradingCardFrameTagged]}>
                <View style={st.cardTopHeaderRow}>
                  <Text style={st.cardSpeciesTitleNode}>{f.name}</Text>
                  <Text style={st.cardDifficultyLabelTier}>{f.difficulty}</Text>
                </View>

                <View style={st.cardTaxonomyMetadataMatrixBlock}>
                  <Text style={st.metaMatrixTxtNode}><Text style={st.boldLabel}>Class:</Text> {f.class}</Text>
                  <Text style={st.metaMatrixTxtNode}><Text style={st.boldLabel}>Schedule:</Text> {f.schedule}</Text>
                  <Text style={st.metaMatrixTxtNode}><Text style={st.boldLabel}>Jurisdiction:</Text> {f.region}</Text>
                </View>

                <Text style={st.cardSpeciesTaxonomicDescriptionPara}>{f.desc}</Text>
                <Text style={st.cardIncentivePointsPayoutValueTicker}>+{f.points} Allotment Points</Text>

                {capturingId === f.id ? (
                  <View style={st.immersiveCellNftCaptureSequencingOverlayBox}>
                    {captureStage === 1 && <Text style={st.captureAnimationPulseTxt}>?? DEPLOYING HOLLOW HIVE CELL CONTAINER...</Text>}
                    {captureStage === 2 && <Text style={st.captureAnimationPulseTxt}>?? DIGITAL HONEY BAIT FLOWING INTO CELL GRID...</Text>}
                    {captureStage === 3 && (
                      <TouchableOpacity style={st.mintConfirmBtnTriggerNode} onPress={() => confirmCaptureToLedger(f.id, f.points, f.name)}>
                        <Text style={st.mintConfirmBtnTxt}>? MINT FAUNA NFT CARD TO WALLET</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <TouchableOpacity style={[st.tagFaunaActionButtonNode, f.tagged && st.tagFaunaActionButtonNodeDisabled]} onPress={() => triggerCaptureSequence(f.id)} disabled={f.tagged}>
                    <Text style={st.tagFaunaActionBtnTxtLabel}>{f.tagged ? '? LEDGER RECORD LOCKED' : '?? INITIALIZE HOLLOW HIVE CAPTURE'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
        )}

        {/* 4. Rewards Ledger Opportunity Details Section */}
        {arTab === 'REWARDS' && (
          <ScrollView style={st.scrollPane}>
            <Text style={st.sectionHeader}>?? LEDGER CONVERSION & RETAIL OPPORTUNITY</Text>
            <Text style={st.bodyPara}>Point allocations accumulated through successful capture actions resolve instantly to the internal system wallet state.</Text>
            <View style={st.rewardsStructureInvoiceCard}>
              <Text style={st.invoiceLineNodeItem}>• 100 Credits = $1.00 AUD Market Purchasing Power</Text>
              <Text style={st.invoiceLineNodeItem}>• Directly redeemable at checkout layers within the Marketplace tab</Text>
              <Text style={st.invoiceLineNodeItem}>• Zero external network conversion gas fees apply</Text>
            </View>
            <Text style={st.bodyPara}>Future expansion tracks indicate direct scalability to include the **Botanica Spectrum** and verified **Herbal Natural Therapy arrays** using this identical state mapping platform template block.</Text>
          </ScrollView>
        )}

      </View>
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060B1A' },
  arOverlayHeaderBannerBlock: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#D4AF37', paddingBottom: 10, marginBottom: 12 },
  arOverlayHeaderTitle: { color: '#D4AF37', fontSize: 13, fontWeight: '900', fontFamily: 'monospace', letterSpacing: 0.5 },
  arOverlayCloseTextBtn: { backgroundColor: '#D4AF37', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 4 },
  closeTxtBtnLabel: { color: '#060B1A', fontWeight: '900', fontSize: 10, fontFamily: 'monospace' },
  arPointsWalletTickerStrip: { backgroundColor: '#0A1128', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#39FF14', marginBottom: 12 },
  tickerLabel: { color: '#7E8FA7', fontSize: 9, fontWeight: '700', fontFamily: 'monospace' },
  tickerPoints: { color: '#39FF14', fontSize: 20, fontWeight: '900', fontFamily: 'monospace', marginTop: 2 },
  arInnerTabRowSelector: { flexDirection: 'row', backgroundColor: '#0A1128', padding: 3, borderRadius: 6, marginBottom: 4 },
  arInnerTabBtn: { flex: 1, height: 26, justifyContent: 'center', alignItems: 'center', borderRadius: 4 },
  arInnerTabBtnActive: { backgroundColor: '#D4AF37' },
  arInnerTabBtnTxt: { color: '#7E8FA7', fontSize: 10, fontWeight: '800', fontFamily: 'monospace' },
  scrollPane: { flex: 1, marginTop: 6 },
  sectionHeader: { color: '#D4AF37', fontSize: 12, fontWeight: '900', marginBottom: 10, fontFamily: 'monospace' },
  bodyPara: { color: '#E2E8F0', fontSize: 12, lineHeight: 17, marginBottom: 12 },
  mapLayoutContainerSpace: { flex: 1, marginTop: 4 },
  simulatedMapGridCanvasFrame: { flex: 1, minHeight: 240, backgroundColor: '#0A1128', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(212,175,55,0.15)', justifyContent: 'center', alignItems: 'center', position: 'relative', padding: 16 },
  mapPingTextMarker: { color: '#39FF14', fontSize: 10, fontWeight: '800', fontFamily: 'monospace', position: 'absolute', top: 12, left: 12 },
  mapGridHollowBeeCellPulseNode: { width: 44, height: 44, borderRadius: 22, borderHeight: 2, borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.05)', animationName: 'pulse', animationDuration: '2s', animationIterationCount: 'infinite' },
  mapCoordinatesLabelDeck: { color: '#7E8FA7', fontSize: 9, fontFamily: 'monospace', position: 'absolute', bottom: 12, left: 12 },
  proximityAlertWarningBannerCard: { position: 'absolute', top: '35%', left: 12, right: 12, backgroundColor: 'rgba(6,11,26,0.9)', borderWidth: 0.5, borderColor: '#39FF14', padding: 10, borderRadius: 6 },
  proximityWarningTxt: { color: '#39FF14', fontSize: 9, fontWeight: '800', textAlign: 'center', fontFamily: 'monospace' },
  mapFooterScheduleSubText: { color: '#7E8FA7', fontSize: 9, fontStyle: 'italic', marginTop: 8, lineHeight: 12 },
  shadowTradingCardFrame: { backgroundColor: '#0A1128', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)', marginBottom: 12, position: 'relative' },
  shadowTradingCardFrameTagged: { borderColor: '#39FF14' },
  cardTopHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 0.5, borderColor: 'rgba(255,255,255,0.05)', paddingBottom: 6, marginBottom: 8 },
  cardSpeciesTitleNode: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  cardDifficultyLabelTier: { color: '#D4AF37', fontSize: 10, fontWeight: '800', fontFamily: 'monospace' },
  cardTaxonomyMetadataMatrixBlock: { backgroundColor: '#060B1A', padding: 8, borderRadius: 6, marginBottom: 8, borderWidth: 0.5, borderColor: 'rgba(212,175,55,0.05)' },
  metaMatrixTxtNode: { color: '#E2E8F0', fontSize: 11, marginBottom: 2 },
  boldLabel: { color: '#7E8FA7', fontWeight: '700' },
  cardSpeciesTaxonomicDescriptionPara: { color: '#7E8FA7', fontSize: 11, lineHeight: 15, marginBottom: 10 },
  cardIncentivePointsPayoutValueTicker: { color: '#39FF14', fontSize: 12, fontWeight: '800', fontFamily: 'monospace', marginBottom: 12 },
  tagFaunaActionButtonNode: { height: 32, backgroundColor: '#D4AF37', borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  tagFaunaActionButtonNodeDisabled: { backgroundColor: '#060B1A', borderWidth: 1, borderColor: '#39FF14' },
  tagFaunaActionBtnTxtLabel: { color: '#060B1A', fontSize: 10, fontWeight: '900' },
  immersiveCellNftCaptureSequencingOverlayBox: { backgroundColor: '#060B1A', padding: 10, borderRadius: 8, borderWidth: 0.5, borderColor: '#D4AF37', alignItems: 'center' },
  captureAnimationPulseTxt: { color: '#D4AF37', fontSize: 10, fontWeight: '700', fontFamily: 'monospace', textAlign: 'center' },
  mintConfirmBtnTriggerNode: { height: 28, backgroundColor: '#39FF14', borderRadius: 4, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12, marginTop: 4 },
  mintConfirmBtnTxt: { color: '#060B1A', fontSize: 10, fontWeight: '900', fontFamily: 'monospace' },
  rewardsStructureInvoiceCard: { backgroundColor: '#060B1A', padding: 12, borderRadius: 8, marginVertical: 8, borderWidth: 0.5, borderColor: 'rgba(57,255,20,0.2)' },
  invoiceLineNodeItem: { color: '#39FF14', fontSize: 11, fontFamily: 'monospace', marginBottom: 4 }
});
