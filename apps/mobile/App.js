import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { AppRegistry } from 'react-native';

const REAL_VIDEOS = [
  { id: '1', creator: '@oriana_peace', title: 'Letting Go Meditation', desc: 'Sovereign conscious frequency mapping and deep letting go audio stream.', tags: '#peace #meditation #oriana', likes: 12400, comments: 842, streamUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-aerial-view-of-a-forest-and-a-river-41857-large.mp4' },
  { id: '2', creator: '@squat_verse', title: 'Squatchverse LOVE Meditation', desc: 'Calibrating system love parameters across localized community energy fields.', tags: '#love #squatverse #conscious', likes: 45100, comments: 2100, streamUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-rocks-from-above-41551-large.mp4' }
];

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
    .svg-node-wrapper { display: flex !important; align-items: center !important; justify-content: center !important; width: 24px !important; height: 24px !important; }
    .oriana-video-frame { width: 100%; height: 100%; object-fit: cover; border: none; position: absolute; top: 0; left: 0; z-index: 5; background-color: #060B1A; }
    .merchant-brand-logo-frame { width: 44px; height: 44px; border-radius: 22px; object-fit: cover; border: 1px solid #D4AF37; margin-right: 10px; background-color: #0A1128; }
    .product-thumbnail-frame { width: 54px; height: 54px; border-radius: 6px; object-fit: cover; border: 0.5px solid rgba(212, 175, 55, 0.3); background-color: #060B1A; }
  `;
  document.head.appendChild(style);
}

// Vector Assets
const SunIcon = () => (<View style={st.iconSvgFix}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5"><circle cx="12" cy="12" r="5" fill="#D4AF37"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 18.36l1.42-1.42M18.36 4.22l1.42-1.42"/></svg></View>);
const MsgBubbleIcon = () => (<View style={st.iconSvgFix}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5" fill="#D4AF37"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></View>);
const VaultIcon = () => (<View style={st.iconSvgFix}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><circle cx="12" cy="12" r="2" fill="#D4AF37"/></svg></View>);
const AntennaIcon = () => (<View style={st.iconSvgFix}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5"><path d="M12 2a10 10 0 0 1 10 10M12 6a6 6 0 0 1 6 6M12 10a2 2 0 0 1 2 2"/><circle cx="12" cy="18" r="1" fill="#D4AF37"/><path d="M12 14v3"/></svg></View>);
const HiveTriangularCluster = ({ color }) => (<View style={st.iconSvgFix}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 2l4 2.3v4.6l-4 2.3-4-2.3V4.3L12 2z" fill={color}/><path d="M6 11.5l4 2.3v4.6l-4 2.3-4-2.3v-4.6l4-2.3z" fill={color}/><path d="M18 11.5l4 2.3v4.6l-4 2.3-4-2.3v-4.6l4-2.3z" fill={color}/></svg></View>);

const TrueHollowBeeIcon = ({ color }) => (
  <View style={st.iconSvgFix}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="1.5" fill={color} /><path d="M10 2.5c-.5-.8-1.2-1-1.2-1M14 2.5c.5-.8 1.2-1 1.2-1" />
      <path d="M12 5.5c1.8 0 2.5 1.5 2.5 3s-.7 3.5-2.5 3.5-2.5-2-2.5-3.5.7-3.5 2.5-3.5z" fill={color === "#D4AF37" ? color : "none"} />
      <path d="M9.5 7.5C7 6 3.5 6 2.5 7.5S4 11 7.5 10c2-.5 2-1.5 2-2.5z" fill={color === "#D4AF37" ? "rgba(212, 175, 55, 0.2)" : "none"} />
      <path d="M14.5 7.5c2.5-1.5 6-1.5 7 0s-1.5 3.5-5 2.5c-2-.5-2-1.5-2-2.5z" fill={color === "#D4AF37" ? "rgba(212, 175, 55, 0.2)" : "none"} />
      <path d="M12 12c2 0 3 2 3 4.5S13.5 21 12 22.5c-1.5-1.5-3-3.5-3-6s1-4.5 3-4.5z" /><path d="M9.5 15h5M9.2 17.5h5.6M10 20h4" />
    </svg>
  </View>
);

const PlusIcon = () => (<View style={st.iconSvgFix}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#060B1A" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></View>);
const MessengerInboxIcon = ({ color }) => (<View style={st.iconSvgFix}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></View>);
const NativeProfileIcon = ({ color }) => (<View style={st.iconSvgFix}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4" fill={color === "#D4AF37" ? "#D4AF37" : "none"}/></svg></View>);

function ClockwiseMarqueeCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 420; const H = 840; const padding = 12;
    const pipeline = [{ type: 'text', text: ' ORIANA SOVEREIGN ECOSYSTEM ' }, { type: 'text', text: ' TERRACARE LEDGER SECURED ' }];
    let motionOffset = 0; let frameId;
    ctx.font = 'bold 11px Arial, sans-serif';
    const perimeterTotal = (W - padding * 2) * 2 + (H - padding * 2) * 2;
    const calculate2DPosition = (pos) => {
      let current = (pos % perimeterTotal + perimeterTotal) % perimeterTotal;
      if (current < (W - padding * 2)) return { x: padding + current, y: padding, angle: 0 };
      current -= (W - padding * 2);
      if (current < (H - padding * 2)) return { x: W - padding, y: padding + current, angle: Math.PI / 2 };
      current -= (H - padding * 2);
      if (current < (W - padding * 2)) return { x: (W - padding) - current, y: H - padding, angle: Math.PI };
      current -= (W - padding * 2);
      return { x: padding, y: (H - padding) - current, angle: -Math.PI / 2 };
    };
    const drawTick = () => {
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#D4AF37'; ctx.fillRect(0, 0, W, H);
      let stepPointer = motionOffset;
      for (let pass = 0; pass < 2; pass++) {
        pipeline.forEach((node) => {
          const coord = calculate2DPosition(stepPointer);
          ctx.save(); ctx.translate(coord.x, coord.y); ctx.rotate(coord.angle);
          ctx.fillStyle = '#060B1A'; ctx.fillText(node.text, 0, 0);
          ctx.restore(); stepPointer += 240;
        });
      }
      motionOffset += 1.2; frameId = requestAnimationFrame(drawTick);
    };
    drawTick(); return () => cancelAnimationFrame(frameId);
  }, []);
  return <canvas ref={canvasRef} width={420} height={840} style={{ position: 'absolute', top: 0, left: 0, width: '420px', height: '840px', pointerEvents: 'none' }} />;
}

export default function App() {
  const [subFeed, setSubFeed] = useState('FOR_YOU'); 
  const [currentTab, setCurrentTab] = useState('HIVE');
  const [hudMessage, setHudMessage] = useState(null);

  // AR Overlay State
  const [arModalActive, setArModalActive] = useState(false);
  const [totalWalletPoints, setTotalWalletPoints] = useState(0);
  const [faunaTasksList, setFaunaTasksList] = useState([
    { id: 't1', animal: 'Kookaburra', points: 150, tagged: false },
    { id: 't2', animal: 'Wombat', points: 250, tagged: false },
    { id: 't3', animal: 'Platypus', points: 400, tagged: false }
  ]);

  // Marketplace State
  const [marketTabContext, setMarketTabContext] = useState('EXPLORE'); 
  const [shopFormName, setShopFormName] = useState('');
  const [shopFormDetails, setShopFormDetails] = useState('');
  const [shopFormLogoUrl, setShopFormLogoUrl] = useState('');
  
  const [prodFormName, setProdFormName] = useState('');
  const [prodFormPriceAud, setProdFormPriceAud] = useState('');
  const [prodFormImgUrl, setProdFormImgUrl] = useState('');
  const [selectedMerchantShop, setSelectedMerchantShop] = useState(null);

  const [marketplaceServices, setMarketplaceServices] = useState([
    { 
      id: 's1', provider: '@oriana_peace', shopName: 'Oriana Resonance Systems', 
      logoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      details: 'Acoustic alignment setups.', products: [{ name: 'Resonant Sound Bowl Pack', priceAud: '240.00', imgUrl: 'https://images.unsplash.com/photo-1617791160505-6f006e121980?w=150' }]
    },
    { 
      id: 's2', provider: '@squat_verse', shopName: 'Community Energy Calibration', 
      logoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      details: 'P2P alignment sets for regional cells.', products: [{ name: 'Sovereign Node Router Kit', priceAud: '700.00', imgUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=150' }]
    }
  ]);

  const triggerNotification = (msg) => {
    setHudMessage(msg); setTimeout(() => setHudMessage(null), 3000);
  };

  const executeSaleWithFee = (productName, price) => {
    const gross = parseFloat(price);
    const calculatedFee = (gross * 0.06).toFixed(2);
    triggerNotification(`?? SALE SECURED: $${gross} AUD | Platform Fee (6%): $${calculatedFee} AUD`);
  };

  const handleFaunaTag = (id, animal, pts) => {
    setFaunaTasksList(prev => prev.map(t => {
      if (t.id === id && !t.tagged) {
        setTotalWalletPoints(c => c + pts);
        triggerNotification(`?? AR TAG COMPLETE: ${animal} (+${pts} pts)`);
        return { ...t, tagged: true };
      }
      return t;
    }));
  };

  return (
    <View style={st.outerCanvas}>
      <View style={st.deviceDisplay}>
        <View style={st.unifiedGoldFrameOverlay}><ClockwiseMarqueeCanvas /></View>

        <View style={st.innerContentSpace}>
          
          {/* Top Navbar Header */}
          <View style={st.header}>
            <TouchableOpacity style={st.arOverlayTriggerTextBtn} onPress={() => setArModalActive(true)}>
              <Text style={st.arBtnInlineTxt}>AR</Text>
            </TouchableOpacity>
            <View style={st.centerTabsWrapperFrame}>
              <TouchableOpacity onPress={() => { setCurrentTab('HIVE'); setSubFeed('FOLLOWING'); }} style={st.headerTabTouch}><Text style={(currentTab === 'HIVE' && subFeed === 'FOLLOWING') ? st.tabAct : st.tabIn}>Following</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => { setCurrentTab('HIVE'); setSubFeed('FOR_YOU'); }} style={st.headerTabTouch}><Text style={(currentTab === 'HIVE' && subFeed === 'FOR_YOU') ? st.tabAct : st.tabIn}>For You</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => { setCurrentTab('HIVE'); setSubFeed('MARKET'); }} style={st.headerTabTouch}><Text style={(currentTab === 'HIVE' && subFeed === 'MARKET') ? st.tabAct : st.tabIn}>Market</Text></TouchableOpacity>
            </View>
          </View>

          {/* Core Visual Windows */}
          <View style={{ flex: 1, position: 'relative' }}>
            {currentTab === 'HIVE' && (
              <View style={StyleSheet.absoluteFill}>
                {subFeed === 'FOR_YOU' && (
                  <View style={StyleSheet.absoluteFill}>
                    <video className="oriana-video-frame" src={REAL_VIDEOS[0].streamUrl} autoPlay loop muted playsInline />
                    <View style={st.leftActionsRail}>
                      <TouchableOpacity style={st.actBtn} onPress={() => triggerNotification("?? SUN ECOSYSTEM ILLUMINATED")}><SunIcon /></TouchableOpacity>
                      <TouchableOpacity style={st.actBtn} onPress={() => triggerNotification("?? CHAT FEED ACCESSED")}><MsgBubbleIcon /></TouchableOpacity>
                      <TouchableOpacity style={st.actBtn} onPress={() => triggerNotification("??? INDEXED TO SECURE VAULT")}><VaultIcon /></TouchableOpacity>
                      <TouchableOpacity style={st.actBtn} onPress={() => triggerNotification("?? PEER DISTRIBUTED P2P HANDSHAKE")}><AntennaIcon /></TouchableOpacity>
                    </View>
                    <View style={st.metaDataDeck}>
                      <Text style={st.handleTxt}>{REAL_VIDEOS[0].creator}</Text>
                      <Text style={st.bodyTxt}>{REAL_VIDEOS[0].title}</Text>
                    </View>
                  </View>
                )}
                {subFeed === 'FOLLOWING' && <View style={[StyleSheet.absoluteFill, { backgroundColor: '#060B1A', justifyContent: 'center', alignItems: 'center' }]}><Text style={{ color: '#D4AF37', fontWeight: '800' }}>?? FOLLOWING LAYER SECURED</Text></View>}
                
                {/* Complete Unified Marketplace Logic Loop */}
                {subFeed === 'MARKET' && (
                  <View style={[StyleSheet.absoluteFill, { backgroundColor: '#060B1A', padding: 16, paddingTop: 64 }]}>
                    <View style={st.marketSubToggleRow}>
                      <TouchableOpacity style={[st.marketSubToggleBtn, marketTabContext === 'EXPLORE' && st.marketSubToggleBtnActive]} onPress={() => { setMarketTabContext('EXPLORE'); setSelectedMerchantShop(null); }}>
                        <Text style={[st.marketSubToggleBtnTxt, marketTabContext === 'EXPLORE' && { color: '#060B1A' }]}>EXPLORE SHOPS</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[st.marketSubToggleBtn, marketTabContext === 'MY_SHOP' && st.marketSubToggleBtnActive]} onPress={() => setMarketTabContext('MY_SHOP')}>
                        <Text style={[st.marketSubToggleBtnTxt, marketTabContext === 'MY_SHOP' && { color: '#060B1A' }]}>?? MY SHOP</Text>
                      </TouchableOpacity>
                    </View>

                    {selectedMerchantShop ? (
                      <View style={StyleSheet.absoluteFill}>
                        <View style={st.merchantImmersiveHeaderCard}>
                          <TouchableOpacity style={st.closeShopImmersiveBtn} onPress={() => setSelectedMerchantShop(null)}>
                            <Text style={{ color: '#D4AF37', fontWeight: '900', fontSize: 11 }}>? EXIT SHOP</Text>
                          </TouchableOpacity>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            <img className="merchant-brand-logo-frame" src={selectedMerchantShop.logoUrl} alt="logo" />
                            <View>
                              <Text style={st.immersiveMerchantTitle}>{selectedMerchantShop.shopName}</Text>
                              <Text style={st.immersiveMerchantStyleLabel}>Owner: {selectedMerchantShop.provider}</Text>
                            </View>
                          </View>
                        </View>

                        <ScrollView style={{ padding: 2, marginTop: 85 }}>
                          <Text style={st.catalogSectionHeaderTitle}>?? AVAILABLE PRODUCTS & SERVICES ($AUD)</Text>
                          {selectedMerchantShop.products && selectedMerchantShop.products.map((p, pIdx) => (
                            <View key={pIdx} style={st.productRowEcomCard}>
                              <img className="product-thumbnail-frame" src={p.imgUrl} alt="product" />
                              <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={st.ecomProductNameText}>{p.name}</Text>
                                <Text style={st.ecomProductPriceText}>${p.priceAud} AUD</Text>
                              </View>
                              <TouchableOpacity style={st.checkoutBtnNode} onPress={() => executeSaleWithFee(p.name, p.priceAud)}>
                                <Text style={st.checkoutBtnTxt}>BUY</Text>
                              </TouchableOpacity>
                            </View>
                          ))}
                        </ScrollView>
                      </View>
                    ) : marketTabContext === 'EXPLORE' ? (
                      <ScrollView style={{ flex: 1 }}>
                        {marketplaceServices.map(srv => (
                          <TouchableOpacity key={srv.id} activeOpacity={0.85} onPress={() => setSelectedMerchantShop(srv)} style={st.botTelemetryCard}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <img className="merchant-brand-logo-frame" src={srv.logoUrl} alt="logo" />
                              <View style={{ flex: 1 }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '800' }}>{srv.shopName}</Text>
                                <Text style={{ color: '#D4AF37', fontSize: 11, fontFamily: 'monospace' }}>{srv.provider}</Text>
                              </View>
                            </View>
                            <Text style={{ color: '#7E8FA7', fontSize: 11, marginTop: 6 }}>{srv.details}</Text>
                            <Text style={st.clickToOpenMerchantTextNode}>?? TAP TO SCROLL STORE PRODUCTS</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    ) : (
                      <ScrollView style={st.shopBuilderContainerDeck}>
                        <Text style={st.builderLabelText}>Store Brand Name</Text>
                        <TextInput style={st.builderInputNode} placeholder="Store Title..." placeholderTextColor="rgba(255,255,255,0.2)" value={shopFormName} onChangeText={setShopFormName} />
                        <Text style={st.builderLabelText}>Brand Logo URL Link</Text>
                        <TextInput style={st.builderInputNode} placeholder="https://site.com/logo.png" placeholderTextColor="rgba(255,255,255,0.2)" value={shopFormLogoUrl} onChangeText={setShopFormLogoUrl} />
                        <Text style={st.builderLabelText}>Store Focus Description</Text>
                        <TextInput style={[st.builderInputNode, { height: 40 }]} multiline value={shopFormDetails} onChangeText={setShopFormDetails} />
                        
                        <View style={st.subProductEntryBoxSection}>
                          <Text style={st.productSectionHeaderSubText}>?? INITIAL PRODUCT INVENTORY ($AUD)</Text>
                          <TextInput style={st.builderInputNode} placeholder="Item Name" placeholderTextColor="rgba(255,255,255,0.2)" value={prodFormName} onChangeText={setProdFormName} />
                          <TextInput style={st.builderInputNode} placeholder="Price in AU Dollars" placeholderTextColor="rgba(255,255,255,0.2)" value={prodFormPriceAud} onChangeText={setProdFormPriceAud} keyboardType="numeric" />
                          <TextInput style={st.builderInputNode} placeholder="Product Thumbnail URL Link" placeholderTextColor="rgba(255,255,255,0.2)" value={prodFormImgUrl} onChangeText={setProdFormImgUrl} />
                        </View>

                        <TouchableOpacity style={st.launchShopBtnNode} onPress={() => {
                          if (!shopFormName.trim()) return;
                          const newShop = {
                            id: `s_${Date.now()}`, provider: '@sovereign', shopName: shopFormName,
                            logoUrl: shopFormLogoUrl.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                            details: shopFormDetails,
                            products: prodFormName.trim() ? [{ name: prodFormName, priceAud: prodFormPriceAud || '0.00', imgUrl: prodFormImgUrl || 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=150' }] : []
                          };
                          setMarketplaceServices([newShop, ...marketplaceServices]);
                          setMarketTabContext('EXPLORE');
                          triggerNotification("?? UNIQUE AUD SHOP DISPATCHED TO LEDGER");
                        }}>
                          <Text style={st.launchShopBtnText}>LAUNCH UNIQUE E-COMMERCE STORE</Text>
                        </TouchableOpacity>
                      </ScrollView>
                    )}
                  </View>
                )}
              </View>
            )}

            {currentTab === 'SWARM' && (
              <ScrollView style={st.fallbackTabPanelBody}>
                <Text style={st.panelSectionHeader}>?? ACTIVE SWARM INSTANCES</Text>
                <View style={st.solidDataCard}>
                  <Text style={st.dataCardMeta}>NODE_ID: #0018-PI-CLAW</Text>
                  <Text style={st.dataCardBody}>Status: SYNCED // Fleet Allocation: 18 Active Devices.</Text>
                </View>
                <View style={st.solidDataCard}>
                  <Text style={st.dataCardMeta}>MESH NETWORK PATHS</Text>
                  <Text style={st.dataCardBody}>P2P Mesh synchronization parameters verified via local server gateway.</Text>
                </View>
              </ScrollView>
            )}

            {currentTab === 'MESSENGER' && (
              <ScrollView style={st.fallbackTabPanelBody}>
                <Text style={st.panelSectionHeader}>?? SECURE P2P MESH INTERFACE</Text>
                <View style={st.solidDataCard}>
                  <Text style={st.dataCardMeta}>@oriana_peace</Text>
                  <Text style={st.dataCardBody}>Resonance frequency mapping parameters locked on ledger.</Text>
                </View>
              </ScrollView>
            )}

            {currentTab === 'PROFILE' && (
              <ScrollView style={st.fallbackTabPanelBody}>
                <Text style={st.panelSectionHeader}>?? IDENTITY META DECK</Text>
                <View style={st.solidDataCard}>
                  <Text style={st.dataCardMeta}>PEACE ARCHITECT CONTEXT</Text>
                  <Text style={st.dataCardBody}>Role: Peace Architect</Text>
                  <Text style={st.dataCardBody}>Focus: Conscious Framings & Hollow Hive System Structures.</Text>
                </View>
              </ScrollView>
            )}
          </View>

          {/* Symmetrical 5-Node Bottom Bar System */}
          <View style={st.bottomNavTray}>
            <TouchableOpacity style={st.navBtnNode} onPress={() => { setCurrentTab('HIVE'); setSubFeed('FOR_YOU'); }}><HiveTriangularCluster color={currentTab === 'HIVE' ? '#D4AF37' : '#7E8FA7'} /><Text style={[st.lblIn, currentTab === 'HIVE' && st.lblAct]}>Hive</Text></TouchableOpacity>
            <TouchableOpacity style={st.navBtnNode} onPress={() => setCurrentTab('SWARM')}><TrueHollowBeeIcon color={currentTab === 'SWARM' ? '#D4AF37' : '#7E8FA7'} /><Text style={[st.lblIn, currentTab === 'SWARM' && st.lblAct]}>Swarm</Text></TouchableOpacity>
            <TouchableOpacity style={st.navCenterPlusNodeActionBtn} onPress={() => triggerNotification("?? BROADCAST: ACTIVE ESCROW PIPELINE OPENED")}><View style={st.centerPlusCircleCore}><PlusIcon /></View></TouchableOpacity>
            <TouchableOpacity style={st.navBtnNode} onPress={() => setCurrentTab('MESSENGER')}><MessengerInboxIcon color={currentTab === 'MESSENGER' ? '#D4AF37' : '#7E8FA7'} /><Text style={[st.lblIn, currentTab === 'MESSENGER' && st.lblAct]}>Messenger</Text></TouchableOpacity>
            <TouchableOpacity style={st.navBtnNode} onPress={() => setCurrentTab('PROFILE')}><NativeProfileIcon color={currentTab === 'PROFILE' ? '#D4AF37' : '#7E8FA7'} /><Text style={[st.lblIn, currentTab === 'PROFILE' && st.lblAct]}>Profile</Text></TouchableOpacity>
          </View>
          
          {/* Immersive AR Tasks Sheet */}
          {arModalActive && (
            <View style={st.arOverlayImmersiveContainerDeck}>
              <View style={st.arOverlayHeaderBannerBlock}>
                <Text style={st.arOverlayHeaderTitle}>???? AR FAUNA REWARDS TASKS</Text>
                <TouchableOpacity style={st.arOverlayCloseTextBtn} onPress={() => setArModalActive(false)}>
                  <Text style={{ color: '#060B1A', fontWeight: '900', fontSize: 11 }}>? CLOSE WINDOW</Text>
                </TouchableOpacity>
              </View>
              <View style={st.arPointsWalletTickerStrip}>
                <Text style={{ color: '#7E8FA7', fontSize: 10, fontWeight: '700' }}>TOTAL NATIVE GAME INCENTIVES COLLECTED</Text>
                <Text style={{ color: '#39FF14', fontSize: 20, fontWeight: '900', fontFamily: 'monospace', marginTop: 2 }}>{totalWalletPoints} CREDITS</Text>
              </View>
              <ScrollView style={{ flex: 1, padding: 4 }}>
                {faunaTasksList.map(task => (
                  <View key={task.id} style={[st.productRowEcomCard, task.tagged && { borderColor: '#39FF14' }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '800' }}>{task.animal}</Text>
                      <Text style={{ color: '#39FF14', fontSize: 11, fontWeight: '700', marginTop: 2 }}>+{task.points} Task Credits</Text>
                    </View>
                    <TouchableOpacity 
                      style={[st.checkoutBtnNode, task.tagged && { backgroundColor: '#060B1A', borderColor: '#39FF14', borderWidth: 1 }]}
                      onPress={() => handleFaunaTag(task.id, task.animal, task.points)}
                      disabled={task.tagged}
                    >
                      <Text style={[st.checkoutBtnTxt, task.tagged && { color: '#39FF14' }]}>{task.tagged ? 'TAGGED' : 'TAG FAUNA'}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {hudMessage && <View style={st.witnessHudOverlay}><Text style={st.hudTitle}>{hudMessage}</Text></View>}
        </View>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  outerCanvas: { backgroundColor: '#060B1A', width: '100vw', height: '100vh', position: 'fixed', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  deviceDisplay: { width: '420px', height: '840px', backgroundColor: '#D4AF37', position: 'relative', overflow: 'hidden', borderRadius: 40, borderWidth: 2, borderColor: '#1E293B', display: 'flex', flexDirection: 'column' },
  unifiedGoldFrameOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 30, pointerEvents: 'none' },
  innerContentSpace: { position: 'absolute', top: '24px', bottom: '24px', left: '24px', right: '24px', backgroundColor: '#060B1A', borderRadius: 24, display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 40 },
  header: { position: 'absolute', top: 12, left: 12, right: 12, height: 44, flexDirection: 'row', alignItems: 'center', zIndex: 100, backgroundColor: 'rgba(6, 11, 26, 0.85)', borderRadius: 12, paddingLeft: 8 },
  arOverlayTriggerTextBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A1128', borderRadius: 6, borderWidth: 1, borderColor: '#D4AF37', marginRight: 4 },
  arBtnInlineTxt: { color: '#D4AF37', fontSize: 11, fontWeight: '900', fontFamily: 'monospace' },
  centerTabsWrapperFrame: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  headerTabTouch: { flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' },
  tabIn: { color: 'rgba(255, 255, 255, 0.35)', fontSize: 13, fontWeight: '600' },
  tabAct: { color: '#D4AF37', fontSize: 13, fontWeight: '800', borderBottomWidth: 2, borderBottomColor: '#D4AF37', paddingBottom: 2 },
  leftActionsRail: { position: 'absolute', bottom: 90, left: 12, alignItems: 'center', zIndex: 40 },
  actBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(10, 17, 40, 0.85)', borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)', alignItems: 'center', justifyContent: 'center', marginVertical: 6 },
  metaDataDeck: { position: 'absolute', bottom: 80, left: 64, right: 12, zIndex: 40, backgroundColor: 'rgba(6, 11, 26, 0.8)', padding: 10, borderRadius: 10 },
  handleTxt: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  bodyTxt: { color: '#E2E8F0', fontSize: 11 },
  bottomNavTray: { height: 60, backgroundColor: '#0A1128', borderTopWidth: 1, borderColor: 'rgba(212, 175, 55, 0.15)', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', zIndex: 200 },
  navBtnNode: { alignItems: 'center', justifyContent: 'center', width: 65, height: '100%' },
  navCenterPlusNodeActionBtn: { width: 50, height: '100%', justifyContent: 'center', alignItems: 'center' },
  centerPlusCircleCore: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center' },
  lblAct: { fontSize: 9, color: '#D4AF37', fontWeight: '700', marginTop: 3 },
  lblIn: { fontSize: 9, color: '#7E8FA7', fontWeight: '500', marginTop: 3 },
  iconSvgFix: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  arOverlayImmersiveContainerDeck: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: '#060B1A', zIndex: 400, padding: 16, paddingTop: 32 },
  witnessHudOverlay: { position: 'absolute', top: '40%', left: '10%', right: '10%', backgroundColor: 'rgba(6, 11, 26, 0.95)', borderWidth: 1, borderColor: '#D4AF37', borderRadius: 8, padding: 10, zIndex: 250 },
  hudTitle: { color: '#D4AF37', fontSize: 10, fontWeight: '900', textAlign: 'center' },
  marketSubToggleRow: { flexDirection: 'row', backgroundColor: '#0A1128', padding: 4, borderRadius: 8, marginBottom: 10 },
  marketSubToggleBtn: { flex: 1, height: 28, justifyContent: 'center', alignItems: 'center', borderRadius: 6 },
  marketSubToggleBtnActive: { backgroundColor: '#D4AF37' },
  marketSubToggleBtnTxt: { color: '#7E8FA7', fontSize: 10, fontWeight: '900', fontFamily: 'monospace' },
  botTelemetryCard: { backgroundColor: '#0A1128', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#D4AF37', marginBottom: 8 },
  clickToOpenMerchantTextNode: { color: '#D4AF37', fontSize: 9, fontWeight: '800', marginTop: 8, textTransform: 'uppercase' },
  shopBuilderContainerDeck: { flex: 1, backgroundColor: '#0A1128', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.15)' },
  builderLabelText: { color: '#7E8FA7', fontSize: 9, fontWeight: '700', marginBottom: 2, textTransform: 'uppercase', marginTop: 4 },
  builderInputNode: { height: 30, backgroundColor: '#060B1A', borderRadius: 6, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.12)', color: '#FFFFFF', fontSize: 11, paddingHorizontal: 10, marginBottom: 8 },
  launchShopBtnNode: { height: 34, backgroundColor: '#D4AF37', borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  launchShopBtnText: { color: '#060B1A', fontSize: 10, fontWeight: '900' },
  merchantImmersiveHeaderCard: { position: 'absolute', top: 0, left: 0, right: 0, height: 75, padding: 12, backgroundColor: '#0A1128', borderBottomWidth: 1, borderColor: '#D4AF37', zIndex: 130 },
  closeShopImmersiveBtn: { position: 'absolute', right: 12, top: 12, backgroundColor: '#060B1A', borderWidth: 0.5, borderColor: '#D4AF37', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  immersiveMerchantTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  immersiveMerchantStyleLabel: { color: '#7E8FA7', fontSize: 10, fontFamily: 'monospace' },
  catalogSectionHeaderTitle: { color: '#D4AF37', fontSize: 11, fontWeight: '900', marginVertical: 8, letterSpacing: 0.5 },
  productRowEcomCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0A1128', padding: 10, borderRadius: 8, marginBottom: 6, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.03)' },
  ecomProductNameText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  ecomProductPriceText: { color: '#39FF14', fontSize: 11, fontWeight: '800', marginTop: 2, fontFamily: 'monospace' },
  checkoutBtnNode: { backgroundColor: '#D4AF37', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  checkoutBtnTxt: { color: '#060B1A', fontSize: 10, fontWeight: '900' },
  subProductEntryBoxSection: { backgroundColor: '#060B1A', padding: 10, borderRadius: 6, borderLeftWidth: 2, borderLeftColor: '#D4AF37', marginVertical: 8 },
  productSectionHeaderSubText: { color: '#D4AF37', fontSize: 9, fontWeight: '800', marginBottom: 6, fontFamily: 'monospace' },
  
  fallbackTabPanelBody: { flex: 1, backgroundColor: '#060B1A', padding: 16, paddingTop: 64 },
  panelSectionHeader: { color: '#D4AF37', fontSize: 14, fontWeight: '900', marginBottom: 16, fontFamily: 'monospace' },
  solidDataCard: { backgroundColor: '#0A1128', borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 0.5, borderColor: 'rgba(212,175,55,0.2)' },
  dataCardMeta: { color: '#D4AF37', fontSize: 11, fontWeight: '800', fontFamily: 'monospace', marginBottom: 4 },
  dataCardBody: { color: '#E2E8F0', fontSize: 12, lineHeight: 16 },
  arOverlayHeaderBannerBlock: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#D4AF37', paddingBottom: 10, marginBottom: 12 },
  arOverlayHeaderTitle: { color: '#D4AF37', fontSize: 14, fontWeight: '900', fontFamily: 'monospace' },
  arOverlayCloseTextBtn: { backgroundColor: '#D4AF37', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 4 },
  arPointsWalletTickerStrip: { backgroundColor: '#0A1128', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#39FF14', marginBottom: 12 }
});

AppRegistry.registerComponent('main', () => App);
const rootEl = document.getElementById('root');
if (rootEl) { AppRegistry.runApplication('main', { rootTag: rootEl }); }
