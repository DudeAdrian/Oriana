import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';

export default function MarketScreen({ triggerNotification, executeSaleWithFee, marketplaceServices, setMarketplaceServices }) {
  const [marketTabContext, setMarketTabContext] = useState('EXPLORE');
  const [selectedMerchantShop, setSelectedMerchantShop] = useState(null);
  
  const [shopFormName, setShopFormName] = useState('');
  const [shopFormDetails, setShopFormDetails] = useState('');
  const [shopFormLogoUrl, setShopFormLogoUrl] = useState('');
  
  const [prodFormName, setProdFormName] = useState('');
  const [prodFormPriceAud, setProdFormPriceAud] = useState('');
  const [prodFormImgUrl, setProdFormImgUrl] = useState('');

  return (
    <View style={st.container}>
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
            <TouchableOpacity style={st.closeShopImmersiveBtn} onPress={() => setSelectedMerchantShop(null)}><Text style={{ color: '#D4AF37', fontWeight: '900', fontSize: 11 }}>? EXIT SHOP</Text></TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <img className="merchant-brand-logo-frame" src={selectedMerchantShop.logoUrl} alt="brand-logo" />
              <View>
                <Text style={st.immersiveMerchantTitle}>{selectedMerchantShop.shopName}</Text>
                <Text style={{ color: '#7E8FA7', fontSize: 10 }}>Owner: {selectedMerchantShop.provider}</Text>
              </View>
            </View>
          </View>
          <ScrollView style={{ paddingHorizontal: 2, marginTop: 85 }}>
            <Text style={st.catalogSectionHeaderTitle}>?? AVAILABLE INVENTORY ($AUD)</Text>
            {selectedMerchantShop.products?.map((p, pIdx) => (
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
                <View>
                  <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '800' }}>{srv.shopName}</Text>
                  <Text style={{ color: '#D4AF37', fontSize: 11, fontFamily: 'monospace' }}>{srv.provider}</Text>
                </View>
              </View>
              <Text style={{ color: '#7E8FA7', fontSize: 11, marginTop: 6 }}>{srv.details}</Text>
              <Text style={st.clickToOpenMerchantTextNode}>?? TAP TO VIEW PRODUCTS</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <ScrollView style={st.shopBuilderContainerDeck}>
          <Text style={st.builderLabelText}>Store Brand Name</Text>
          <TextInput style={st.builderInputNode} placeholder="e.g. Adrian's Mycological Hub" placeholderTextColor="rgba(255,255,255,0.2)" value={shopFormName} onChangeText={setShopFormName} />
          <Text style={st.builderLabelText}>Brand Logo URL Link</Text>
          <TextInput style={st.builderInputNode} placeholder="https://site.com/logo.png" placeholderTextColor="rgba(255,255,255,0.2)" value={shopFormLogoUrl} onChangeText={setShopFormLogoUrl} />
          <Text style={st.builderLabelText}>Store Focus Description</Text>
          <TextInput style={[st.builderInputNode, { height: 40 }]} multiline value={shopFormDetails} onChangeText={setShopFormDetails} />
          
          <View style={st.subProductEntryBoxSection}>
            <Text style={st.productSectionHeaderSubText}>?? INITIAL INVENTORY ITEM ($AUD)</Text>
            <TextInput style={st.builderInputNode} placeholder="Item Name" placeholderTextColor="rgba(255,255,255,0.2)" value={prodFormName} onChangeText={setProdFormName} />
            <TextInput style={st.builderInputNode} placeholder="Price" placeholderTextColor="rgba(255,255,255,0.2)" value={prodFormPriceAud} onChangeText={setProdFormPriceAud} keyboardType="numeric" />
            <TextInput style={st.builderInputNode} placeholder="Product Image link" placeholderTextColor="rgba(255,255,255,0.2)" value={prodFormImgUrl} onChangeText={setProdFormImgUrl} />
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
            triggerNotification("?? AUD STORE DISPATCHED TO LEDGER");
          }}>
            <Text style={st.launchShopBtnText}>LAUNCH E-COMMERCE HUB</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060B1A' },
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
  catalogSectionHeaderTitle: { color: '#D4AF37', fontSize: 11, fontWeight: '900', marginVertical: 8, letterSpacing: 0.5 },
  productRowEcomCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0A1128', padding: 10, borderRadius: 8, marginBottom: 6, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.03)' },
  ecomProductNameText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  ecomProductPriceText: { color: '#39FF14', fontSize: 11, fontWeight: '800', marginTop: 2, fontFamily: 'monospace' },
  checkoutBtnNode: { backgroundColor: '#D4AF37', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  checkoutBtnTxt: { color: '#060B1A', fontSize: 10, fontWeight: '900' },
  subProductEntryBoxSection: { backgroundColor: '#060B1A', padding: 10, borderRadius: 6, borderLeftWidth: 2, borderLeftColor: '#D4AF37', marginVertical: 8 },
  productSectionHeaderSubText: { color: '#D4AF37', fontSize: 9, fontWeight: '800', marginBottom: 6, fontFamily: 'monospace' }
});
