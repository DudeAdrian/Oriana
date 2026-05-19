import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, TextInput, ScrollView } from 'react-native';
import { AppRegistry } from 'react-native';

const REAL_VIDEOS = [
  { id: '1', creator: '@oriana_peace', title: 'Letting Go Meditation', desc: 'Sovereign conscious frequency mapping and deep letting go audio stream.', tags: '#peace #meditation #oriana', likes: 12400, comments: 842, streamUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-aerial-view-of-a-forest-and-a-river-41857-large.mp4' },
  { id: '2', creator: '@squat_verse', title: 'Squatchverse LOVE Meditation', desc: 'Calibrating system love parameters across localized community energy fields.', tags: '#love #squatverse #conscious', likes: 45100, comments: 2100, streamUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-rocks-from-above-41551-large.mp4' },
  { id: '3', creator: '@inner_peace', title: 'Squatch Inner Peace Session', desc: 'Processing truth-verified meditation metrics to achieve stable internal states.', tags: '#innerpeace #balance #ledger', likes: 9800, comments: 431, streamUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-sun-rays-4861-large.mp4' }
];

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
    .svg-node-wrapper { display: flex !important; align-items: center !important; justify-content: center !important; width: 26px !important; height: 26px !important; }
    .oriana-video-frame { width: 100%; height: 100%; object-fit: cover; border: none; position: absolute; top: 0; left: 0; z-index: 5; background-color: #070E22; }
  `;
  document.head.appendChild(style);
}

// Custom High-Fidelity SVG Visual Assets
const SunIcon = ({ color = "#D4AF37" }) => (
  <div className="svg-node-wrapper"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><circle cx="12" cy="12" r="5" fill={color}/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 18.36l1.42-1.42M18.36 4.22l1.42-1.42"/></svg></div>
);
const MsgBubbleIcon = ({ color = "#D4AF37" }) => (
  <div className="svg-node-wrapper"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" fill={color}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
);
const VaultIcon = ({ color = "#D4AF37" }) => (
  <div className="svg-node-wrapper"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" fill={color === "#060B1A" ? "#060B1A" : "none"}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><circle cx="12" cy="12" r="2" fill={color}/></svg></div>
);
const AntennaIcon = ({ color = "#D4AF37" }) => (
  <div className="svg-node-wrapper"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><path d="M12 2a10 10 0 0 1 10 10M12 6a6 6 0 0 1 6 6M12 10a2 2 0 0 1 2 2"/><circle cx="12" cy="18" r="1" fill={color}/><path d="M12 14v3"/></svg></div>
);

// Navigation Tray High-Fidelity SVG Vectors
const HiveTriangularCluster = ({ color = "#D4AF37" }) => (
  <div className="svg-node-wrapper"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 2l4 2.3v4.6l-4 2.3-4-2.3V4.3L12 2z" fill={color}/><path d="M6 11.5l4 2.3v4.6l-4 2.3-4-2.3v-4.6l4-2.3z" fill={color}/><path d="M18 11.5l4 2.3v4.6l-4 2.3-4-2.3v-4.6l4-2.3z" fill={color}/></svg></div>
);
const SharpBeeIcon = ({ color = "#7E8FA7" }) => (
  <div className="svg-node-wrapper"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="4" fill={color === "#D4AF37" ? "#D4AF37" : "none"}/><path d="M12 8c-2-1.5-4-1.5-4 1s2 2.5 4 2.5M12 8c2-1.5 4-1.5 4 1s-2 2.5-4 2.5M12 16c-2 1.5-4 1.5-4-1s2-2.5 4-2.5M12 16c2 1.5 4 1.5 4-1s-2-2.5-4-2.5M12 4V2M10 2h4"/></svg></div>
);
const MessengerInboxIcon = ({ color = "#7E8FA7" }) => (
  <div className="svg-node-wrapper"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" fill={color === "#D4AF37" ? "#D4AF37" : "none"}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></div>
);
const NativeProfileIcon = ({ color = "#7E8FA7" }) => (
  <div className="svg-node-wrapper"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4" fill={color === "#D4AF37" ? "#D4AF37" : "none"}/></svg></div>
);

function ClockwiseMarqueeCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const W = 420;
    const H = 840;
    const padding = 12;

    const pipeline = [
      { type: 'invader', color: '#D4AF37' },
      { type: 'text', text: ' ORIANA SOVEREIGN ECOSYSTEM ' },
      { type: 'invader', color: '#00F0FF' },
      { type: 'text', text: ' TERRACARE LEDGER SECURED ' },
      { type: 'invader', color: '#39FF14' },
      { type: 'text', text: ' ACCESS THE NEW GOLDEN HOUR ' },
      { type: 'invader', color: '#FF073A' },
      { type: 'text', text: ' HOLLOW HIVE NETWORKS ACTIVE ' }
    ];

    let motionOffset = 0;
    let frameId;

    ctx.font = 'bold 11px Arial, sans-serif';
    const trackItems = pipeline.map(p => {
      if (p.type === 'invader') return { ...p, size: 16 };
      return { ...p, size: ctx.measureText(p.text).width };
    });
    
    const perimeterTotal = (W - padding * 2) * 2 + (H - padding * 2) * 2;

    const calculate2DPosition = (pos) => {
      let current = (pos % perimeterTotal + perimeterTotal) % perimeterTotal;

      if (current < (W - padding * 2)) {
        return { x: padding + current, y: padding, angle: 0 };
      }
      current -= (W - padding * 2);

      if (current < (H - padding * 2)) {
        return { x: W - padding, y: padding + current, angle: Math.PI / 2 };
      }
      current -= (H - padding * 2);

      if (current < (W - padding * 2)) {
        return { x: (W - padding) - current, y: H - padding, angle: Math.PI };
      }
      current -= (W - padding * 2);

      return { x: padding, y: (H - padding) - current, angle: -Math.PI / 2 };
    };

    const drawTick = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#D4AF37';
      ctx.fillRect(0, 0, W, H);

      let stepPointer = motionOffset;

      for (let pass = 0; pass < 4; pass++) {
        trackItems.forEach((node) => {
          const coord = calculate2DPosition(stepPointer);
          
          ctx.save();
          ctx.translate(coord.x, coord.y);
          ctx.rotate(coord.angle);
          
          if (node.type === 'invader') {
            ctx.fillStyle = node.color;
            ctx.font = '14px Arial';
            ctx.textBaseline = 'middle';
            ctx.fillText('??', -8, 0);
          } else {
            ctx.fillStyle = '#060B1A';
            ctx.font = 'bold 11px Arial, sans-serif';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.text, 0, 0);
          }
          ctx.restore();
          
          stepPointer += node.size + 24;
        });
      }

      motionOffset += 1.2; 
      frameId = requestAnimationFrame(drawTick);
    };

    drawTick();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return <canvas ref={canvasRef} width={420} height={840} style={{ position: 'absolute', top: 0, left: 0, width: '420px', height: '840px', pointerEvents: 'none' }} />;
}

export default function App() {
  const [splash, setSplash] = useState(true);
  const [phase, setPhase] = useState('AURORA');
  const [idx, setIdx] = useState(0);
  
  const [isIlluminated, setIsIlluminated] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [hudMessage, setHudMessage] = useState(null);
  const [currentTab, setCurrentTab] = useState('PROFILE');
  
  const [username, setUsername] = useState('sovereign');
  const [legalName, setLegalName] = useState('Adrian Sortino');
  const [postalAddress, setPostalAddress] = useState('Victoria, Australia');
  const [bioText, setBioText] = useState('Peace Architect // Conscious conversations within the Hollow Hive logic framework.');
  
  const cellTokenId = 'CELL-NFT #1,000,000 / 1';
  const networkDomain = 'Hollow_Hive_Mainnet';

  const [commentsList, setCommentsList] = useState({ 1: [], 2: [], 3: [] });
  const [commentInput, setCommentInput] = useState('');
  
  const videoRef = useRef(null);

  useEffect(() => {
    setPhase('SOL');
    const t1 = setTimeout(() => setPhase('READY'), 600);
    const t2 = setTimeout(() => setSplash(false), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
    setIsIlluminated(false);
    setIsSaved(false);
    setShowComments(false);
  }, [idx]);

  const currentTrack = REAL_VIDEOS[idx];

  const triggerNotification = (msg) => {
    setHudMessage(msg);
    setTimeout(() => setHudMessage(null), 3000);
  };

  const submitComment = () => {
    if (!commentInput.trim()) return;
    setCommentsList(p => ({
      ...p,
      [currentTrack.id]: [...p[currentTrack.id], { id: Date.now().toString(), text: commentInput }]
    }));
    setCommentInput('');
    triggerNotification("?? COMMENT APPENDED TO LEDGER");
  };

  if (splash) {
    return (
      <View style={st.splash}>
        <StatusBar barStyle="light-content" />
        <View style={st.sunWrap}><View style={st.sun} /></View>
        <View style={st.brand}>
          <Text style={st.h1}>ORIANA</Text>
          <Text style={st.sub}>A NEW GOLDEN DAY ARCHITECTURE</Text>
          <View style={st.badge}>
            <Text style={st.badgeTxt}>
              {phase === 'AURORA' ? 'Incipiens Aurora...' : phase === 'SOL' ? 'Sol Oritur...' : 'Systema Paratum.'}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={st.outerCanvas}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={st.deviceDisplay}>
        
        <View style={st.unifiedGoldFrameOverlay}>
          <ClockwiseMarqueeCanvas />
        </View>

        <View style={st.innerContentSpace}>
          <View style={st.header}>
            <Text style={st.tabIn}>Following</Text>
            <Text style={st.tabAct}>For You</Text>
          </View>

          <View style={{ flex: 1, position: 'relative' }}>
            
            {/* Core Feed Screen */}
            {currentTab === 'HIVE' && (
              <View style={StyleSheet.absoluteFill}>
                <View style={st.mediaContainer}>
                  <video 
                    ref={videoRef}
                    className="oriana-video-frame"
                    src={currentTrack.streamUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  
                  <View style={st.videoOverlayNavGate}>
                    <TouchableOpacity style={st.nextBtn} onPress={() => setIdx((p) => (p + 1) % REAL_VIDEOS.length)}>
                      <Text style={st.nextTxt}>?? SWIPE UP / NEXT MEDITATION</Text>
                    </TouchableOpacity>
                  </View>

                  {showComments && (
                    <View style={st.commentsOverlayTray}>
                      <View style={st.commentHeaderRow}>
                        <Text style={st.commentTitleText}>Ledger Comments ({commentsList[currentTrack.id].length + currentTrack.comments})</Text>
                        <TouchableOpacity onPress={() => setShowComments(false)} style={st.closeTrayBtn}><Text style={{color: '#D4AF37', fontSize: 11, fontWeight: '800'}}>?</Text></TouchableOpacity>
                      </View>
                      <ScrollView style={st.commentsScrollDeck}>
                        <Text style={st.fallbackComment}>@system_witness: Metadata block origin verified successfully.</Text>
                        {commentsList[currentTrack.id].map(c => (
                          <Text key={c.id} style={st.userCommentText}><Text style={{color: '#D4AF37'}}>@anonymous: </Text>{c.text}</Text>
                        ))}
                      </ScrollView>
                      <View style={st.commentInputRow}>
                        <TextInput 
                          style={st.hudInputField} 
                          value={commentInput} 
                          onChangeText={setCommentInput} 
                          placeholder="Write encrypted block data..." 
                          placeholderTextColor="rgba(255,255,255,0.3)" 
                        />
                        <TouchableOpacity style={st.sendCommentBtn} onPress={submitComment}><Text style={{color: '#060B1A', fontWeight: '800', fontSize: 11}}>POST</Text></TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {hudMessage && (
                    <View style={st.witnessHudOverlay}>
                      <Text style={st.hudTitle}>{hudMessage}</Text>
                    </View>
                  )}
                </View>

                <View style={st.leftActionsRail}>
                  <TouchableOpacity style={st.actBtn} onPress={() => { setIsIlluminated(!isIlluminated); triggerNotification(isIlluminated ? "?? SUN FREQUENCY MODULATED" : "?? SUN ECOSYSTEM ILLUMINATED"); }}>
                    <View style={[st.iconContainer, isIlluminated && st.sunIlluminated]}>
                      <SunIcon color={isIlluminated ? "#060B1A" : "#D4AF37"} />
                    </View>
                    <Text style={[st.actNum, isIlluminated && { color: '#D4AF37', fontWeight: '800' }]}>
                      {isIlluminated ? "SHINE" : currentTrack.likes}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={st.actBtn} onPress={() => setShowComments(!showComments)}>
                    <View style={[st.iconContainer, showComments && st.sunIlluminated]}><MsgBubbleIcon color={showComments ? "#060B1A" : "#D4AF37"} /></View>
                    <Text style={st.actNum}>{commentsList[currentTrack.id].length + currentTrack.comments}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={st.actBtn} onPress={() => { setIsSaved(!isSaved); triggerNotification(isSaved ? "??? REMOVED FROM SOVEREIGN VAULT" : "??? LEDGER INDEXED TO SOVEREIGN VAULT"); }}>
                    <View style={[st.iconContainer, isSaved && st.sunIlluminated]}><VaultIcon color={isSaved ? "#060B1A" : "#D4AF37"} /></View>
                    <Text style={st.actNum}>{isSaved ? "SAVED" : "Save"}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={st.actBtn} onPress={() => triggerNotification("?? P2P MESH BROADCAST TRANSMITTED")}>
                    <View style={st.iconContainer}><AntennaIcon /></View>
                    <Text style={st.actNum}>Share</Text>
                  </TouchableOpacity>
                </View>

                <View style={st.mediaContainer} style={st.metaDataDeck}>
                  <Text style={st.handleTxt}>{currentTrack.creator}</Text>
                  <Text style={st.bodyTxt}>{currentTrack.title} - {currentTrack.desc}</Text>
                  <Text style={st.tagTxt}>{currentTrack.tags}</Text>
                </View>
              </View>
            )}

            {currentTab === 'FRIENDS' && (
              <View style={st.subRouterViewWorkspace}>
                <Text style={st.routerHeaderTitle}>?? SWARM COOPERATIVE</Text>
                <Text style={st.routerSubText}>Active Node Mesh Tracking Topology</Text>
                <View style={st.swarmStatusCard}>
                  <Text style={st.swarmStatusText}>?? Swarm Synchronization Status: <Text style={{color: '#39FF14'}}>OPTIMIZED</Text></Text>
                  <Text style={st.swarmStatusSubText}>18 Active PicoClaw Nodes Connected on Loop</Text>
                </View>
              </View>
            )}

            {currentTab === 'MESSENGER' && (
              <View style={st.subRouterViewWorkspace}>
                <Text style={st.routerHeaderTitle}>?? TERRACARE MESSENGER</Text>
                <Text style={st.routerSubText}>Encrypted End-to-End Peer Channels</Text>
                <View style={st.swarmStatusCard}>
                  <Text style={st.swarmStatusText}>?? Session Security Architecture:</Text>
                  <Text style={st.swarmStatusSubText}>P2P Mesh Routing Active over Localized Gateway Nodes</Text>
                </View>
              </View>
            )}

            {/* Account Setup View */}
            {currentTab === 'PROFILE' && (
              <ScrollView style={st.profileContentScrollDeck} contentContainerStyle={{ paddingBottom: 40 }}>
                
                <View style={st.profileHeaderCluster}>
                  <View style={st.sovereignAvatarCellHex}>
                    <Text style={st.avatarInitialText}>S</Text>
                  </View>
                  <Text style={st.displayHandleText}>@{username}</Text>
                  <Text style={st.cellNftSerialText}>{cellTokenId} // {networkDomain}</Text>
                </View>

                <View style={st.profileStatsRowDeck}>
                  <View style={st.statItemBox}><Text style={st.statVal}>1</Text><Text style={st.statLbl}>Secure Cell</Text></View>
                  <View style={st.statItemBox}><Text style={st.statVal}>18</Text><Text style={st.statLbl}>Swarm Nodes</Text></View>
                  <View style={st.statItemBox}><Text style={st.statVal}>1M</Text><Text style={st.statLbl}>Grid Finite</Text></View>
                </View>

                <View style={st.formSectionHeaderRow}>
                  <Text style={st.formSectionTitle}>ACCOUNT PROFILE SETUP</Text>
                </View>

                <View style={st.inputFormFieldCard}>
                  <Text style={st.fieldInputLabelText}>Sovereign Username</Text>
                  <TextInput style={st.profileTextInputNode} value={username} onChangeText={setUsername} />
                  
                  <Text style={st.fieldInputLabelText}>Captured Real Legal Name</Text>
                  <TextInput style={st.profileTextInputNode} value={legalName} onChangeText={setLegalName} />

                  <Text style={st.fieldInputLabelText}>Required Legal Jurisdiction / Location</Text>
                  <TextInput style={st.profileTextInputNode} value={postalAddress} onChangeText={setPostalAddress} />

                  <Text style={st.fieldInputLabelText}>Biography / Focus</Text>
                  <TextInput style={[st.profileTextInputNode, { height: 50, paddingTop: 8 }]} multiline value={bioText} onChangeText={setBioText} />
                </View>

                <TouchableOpacity style={st.commitLedgerBtnNode} onPress={() => triggerNotification("?? PROFILE DETAIL RECORDS UPDATED")}>
                  <Text style={st.commitLedgerBtnText}>UPDATE SECURE PROFILE DETAILS</Text>
                </TouchableOpacity>

                {hudMessage && (
                  <View style={[st.witnessHudOverlay, { bottom: 80, top: undefined }]}>
                    <Text style={st.hudTitle}>{hudMessage}</Text>
                  </View>
                )}

              </ScrollView>
            )}

          </View>

          {/* Core Bottom Navigation Tray */}
          <View style={st.bottomNavTray}>
            <TouchableOpacity style={st.navBtnNode} onPress={() => setCurrentTab('HIVE')}>
              <HiveTriangularCluster color={currentTab === 'HIVE' ? '#D4AF37' : '#7E8FA7'} />
              <Text style={[st.lblIn, currentTab === 'HIVE' && st.lblAct]}>Hive</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={st.navBtnNode} onPress={() => setCurrentTab('FRIENDS')}>
              <SharpBeeIcon color={currentTab === 'FRIENDS' ? '#D4AF37' : '#7E8FA7'} />
              <Text style={[st.lblIn, currentTab === 'FRIENDS' && st.lblAct]}>Friends</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={st.navBtnNode} onPress={() => triggerNotification("? WITNESS SIGNATURE BROADCAST GENERATED")}>
              <View style={st.centerUploadBtn}>
                <Text style={st.plusSign}>+</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={st.navBtnNode} onPress={() => setCurrentTab('MESSENGER')}>
              <MessengerInboxIcon color={currentTab === 'MESSENGER' ? '#D4AF37' : '#7E8FA7'} />
              <Text style={[st.lblIn, currentTab === 'MESSENGER' && st.lblAct]}>Messenger</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={st.navBtnNode} onPress={() => setCurrentTab('PROFILE')}>
              <NativeProfileIcon color={currentTab === 'PROFILE' ? '#D4AF37' : '#7E8FA7'} />
              <Text style={[st.lblIn, currentTab === 'PROFILE' && st.lblAct]}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </View>
  );
}

const st = StyleSheet.create({
  splash: { backgroundColor: '#0A1128', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', zIndex: 9999 },
  sunWrap: { justifyContent: 'center', alignItems: 'center', height: 150, width: 150 },
  sun: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#D4AF37' },
  brand: { position: 'absolute', bottom: 60, alignItems: 'center', width: '100%' },
  h1: { fontSize: 36, fontWeight: '900', color: '#D4AF37', letterSpacing: 8, marginBottom: 4 },
  sub: { fontSize: 10, color: '#93B1E6', letterSpacing: 2, marginBottom: 20 },
  badge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: '#060B1A', borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.25)' },
  badgeTxt: { fontSize: 11, color: '#D4AF37', fontStyle: 'italic' },
  outerCanvas: { backgroundColor: '#060B1A', width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  deviceDisplay: { width: '420px', height: '840px', backgroundColor: '#D4AF37', position: 'relative', overflow: 'hidden', borderRadius: 40, borderWidth: 2, borderColor: '#1E293B', display: 'flex', flexDirection: 'column' },
  unifiedGoldFrameOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 30, pointerEvents: 'none' },
  innerContentSpace: { position: 'absolute', top: '24px', bottom: '24px', left: '24px', right: '24px', backgroundColor: '#060B1A', borderRadius: 24, display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 40 },
  header: { position: 'absolute', top: 16, left: 16, right: 16, height: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  tabIn: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 14, fontWeight: '600', marginHorizontal: 12 },
  tabAct: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginHorizontal: 12, borderBottomWidth: 2, borderBottomColor: '#D4AF37', paddingBottom: 2 },
  card: { flex: 1, justifyContent: 'flex-end', position: 'relative' },
  mediaContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#070E22', zIndex: 11 },
  videoOverlayNavGate: { position: 'absolute', top: 60, left: 0, right: 0, alignItems: 'center', zIndex: 20 },
  nextBtn: { paddingHorizontal: 14, paddingVertical: 6, backgroundColor: 'rgba(6, 11, 26, 0.8)', borderWidth: 1, borderColor: '#D4AF37', borderRadius: 6 },
  nextTxt: { color: '#D4AF37', fontSize: 11, fontWeight: '700' },
  leftActionsRail: { position: 'absolute', bottom: 90, left: 12, alignItems: 'center', zIndex: 40 },
  actBtn: { alignItems: 'center', marginVertical: 6 },
  iconContainer: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(10, 17, 40, 0.85)', borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  sunIlluminated: { backgroundColor: '#D4AF37', borderColor: '#FFFFFF' },
  actNum: { color: '#FFFFFF', fontSize: 9, fontWeight: '600', textAlign: 'center' },
  metaDataDeck: { position: 'absolute', bottom: 80, left: 64, right: 12, zIndex: 40, backgroundColor: 'rgba(6, 11, 26, 0.75)', padding: 8, borderRadius: 8, borderWidth: 0.5, borderColor: 'rgba(212, 175, 55, 0.2)' },
  handleTxt: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginBottom: 2 },
  bodyTxt: { color: '#E2E8F0', fontSize: 12, marginBottom: 2 },
  tagTxt: { color: '#D4AF37', fontSize: 12, fontWeight: '600' },
  bottomNavTray: { height: 60, backgroundColor: '#0A1128', borderTopWidth: 1, borderColor: 'rgba(212, 175, 55, 0.15)', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', zIndex: 200 },
  navBtnNode: { alignItems: 'center', justifyContent: 'center', width: 65 },
  lblAct: { fontSize: 9, color: '#D4AF37', fontWeight: '700', marginTop: 1 },
  lblIn: { fontSize: 9, color: '#7E8FA7', fontWeight: '500', marginTop: 1 },
  centerUploadBtn: { width: 32, height: 22, backgroundColor: '#D4AF37', borderRadius: 5, justifyContent: 'center', alignItems: 'center' },
  plusSign: { color: '#0A1128', fontSize: 14, fontWeight: '900' },
  witnessHudOverlay: { position: 'absolute', top: '40%', left: '10%', right: '10%', backgroundColor: 'rgba(6, 11, 26, 0.95)', borderWidth: 1, borderColor: '#D4AF37', borderRadius: 8, padding: 10, zIndex: 150 },
  hudTitle: { color: '#D4AF37', fontSize: 11, fontWeight: '900', letterSpacing: 1, textAlign: 'center' },
  
  subRouterViewWorkspace: { flex: 1, backgroundColor: '#060B1A', padding: 24, paddingTop: 80 },
  routerHeaderTitle: { color: '#D4AF37', fontSize: 20, fontWeight: '900', letterSpacing: 1, marginBottom: 4 },
  routerSubText: { color: '#7E8FA7', fontSize: 12, marginBottom: 20 },
  swarmStatusCard: { backgroundColor: '#0A1128', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.15)' },
  swarmStatusText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', marginBottom: 6 },
  swarmStatusSubText: { color: '#7E8FA7', fontSize: 11, fontFamily: 'monospace' },

  commentsOverlayTray: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%', backgroundColor: 'rgba(6, 11, 26, 0.98)', borderTopWidth: 1, borderColor: '#D4AF37', zIndex: 120, padding: 16, display: 'flex', flexDirection: 'column' },
  commentHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  commentTitleText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  closeTrayBtn: { padding: 4 },
  commentsScrollDeck: { flex: 1, marginBottom: 12 },
  fallbackComment: { color: '#7E8FA7', fontSize: 11, marginBottom: 8, fontStyle: 'italic' },
  userCommentText: { color: '#E2E8F0', fontSize: 12, marginBottom: 8, backgroundColor: 'rgba(255,255,255,0.03)', padding: 6, borderRadius: 6 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center' },
  hudInputField: { flex: 1, height: 36, backgroundColor: '#0A1128', borderRadius: 6, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)', color: '#FFFFFF', fontSize: 12, paddingHorizontal: 10, marginRight: 8 },
  sendCommentBtn: { height: 36, paddingHorizontal: 16, backgroundColor: '#D4AF37', borderRadius: 6, justifyContent: 'center', alignItems: 'center' },

  profileContentScrollDeck: { flex: 1, backgroundColor: '#060B1A', paddingTop: 60, paddingHorizontal: 20 },
  profileHeaderCluster: { alignItems: 'center', marginBottom: 20 },
  sovereignAvatarCellHex: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#0A1128', borderWidth: 2, borderColor: '#D4AF37', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  avatarInitialText: { color: '#D4AF37', fontSize: 24, fontWeight: '900' },
  displayHandleText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  cellNftSerialText: { color: '#7E8FA7', fontSize: 10, fontFamily: 'monospace', marginTop: 4 },
  profileStatsRowDeck: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  statItemBox: { alignItems: 'center', width: 90 },
  statVal: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  statLbl: { color: '#7E8FA7', fontSize: 10, marginTop: 2 },
  formSectionHeaderRow: { borderBottomWidth: 1, borderBottomColor: 'rgba(212, 175, 55, 0.15)', paddingBottom: 4, marginBottom: 10, marginTop: 12 },
  formSectionTitle: { color: '#D4AF37', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  inputFormFieldCard: { backgroundColor: '#0A1128', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.05)', marginBottom: 14 },
  fieldInputLabelText: { color: '#7E8FA7', fontSize: 9, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  profileTextInputNode: { height: 32, backgroundColor: '#060B1A', borderRadius: 6, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.15)', color: '#FFFFFF', fontSize: 12, paddingHorizontal: 10, marginBottom: 12 },
  commitLedgerBtnNode: { height: 38, backgroundColor: '#D4AF37', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 4, marginBottom: 20 },
  commitLedgerBtnText: { color: '#060B1A', fontSize: 11, fontWeight: '900', letterSpacing: 1 }
});

AppRegistry.registerComponent('main', () => App);
const rootEl = document.getElementById('root');
if (rootEl) { AppRegistry.runApplication('main', { rootTag: rootEl }); }
