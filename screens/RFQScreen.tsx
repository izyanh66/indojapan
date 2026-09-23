import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RFQItem, UserRole } from '../types';

interface RFQScreenProps {
  rfqs: RFQItem[];
  onOpenPostRFQ: () => void;
  activeRole: UserRole;
  onPlaceBid?: (rfqId: string) => void;
}

export const RFQScreen: React.FC<RFQScreenProps> = ({
  rfqs,
  onOpenPostRFQ,
  activeRole,
}) => {
  const [filterMode, setFilterMode] = useState<'ALL' | 'CORRIDOR' | 'SUSTAINABLE'>('ALL');
  const [selectedRFQ, setSelectedRFQ] = useState<RFQItem | null>(null);
  const [bidPrice, setBidPrice] = useState('₹38,500 / unit');
  const [bidLeadTime, setBidLeadTime] = useState('28 days');
  const [bidNote, setBidNote] = useState('Fully audited AS9100D facility with DMG MORI 5-axis. CMM report included.');

  const filteredRfqs = rfqs.filter((r) => {
    if (filterMode === 'CORRIDOR') return r.isBilateralCorridor;
    if (filterMode === 'SUSTAINABLE') return r.isSustainableRequest;
    return true;
  });

  const handleSendQuote = () => {
    if (!selectedRFQ) return;
    Alert.alert(
      'Quote Submitted! 💼',
      `Your formal bid for "${selectedRFQ.title}" has been transmitted to ${selectedRFQ.buyerCompany}.\n\nBid Price: ${bidPrice}\nLead Time: ${bidLeadTime}`
    );
    setSelectedRFQ(null);
  };

  return (
    <View style={styles.container}>
      {/* Top Banner with Post Button */}
      <View style={styles.topHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.screenTitle}>B2B Requirements & RFQs</Text>
          <Text style={styles.screenSubtitle}>
            Direct tender sourcing with 3D CAD specs & supplier bidding
          </Text>
        </View>
        <TouchableOpacity style={styles.postRfqTopBtn} onPress={onOpenPostRFQ}>
          <Ionicons name="add" size={16} color="#ffffff" />
          <Text style={styles.postRfqTopBtnText}>Post RFQ</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, filterMode === 'ALL' && styles.tabBtnActive]}
          onPress={() => setFilterMode('ALL')}
        >
          <Text style={[styles.tabBtnText, filterMode === 'ALL' && styles.tabBtnTextActive]}>
            All Open Tenders ({rfqs.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, filterMode === 'CORRIDOR' && styles.tabBtnActive]}
          onPress={() => setFilterMode('CORRIDOR')}
        >
          <Text style={[styles.tabBtnText, filterMode === 'CORRIDOR' && styles.tabBtnTextActive]}>
            🇮🇳🇯🇵 Bilateral Corridor
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, filterMode === 'SUSTAINABLE' && styles.tabBtnActive]}
          onPress={() => setFilterMode('SUSTAINABLE')}
        >
          <Text style={[styles.tabBtnText, filterMode === 'SUSTAINABLE' && styles.tabBtnTextActive]}>
            🌱 Low-Carbon
          </Text>
        </TouchableOpacity>
      </View>

      {/* RFQ List */}
      <FlatList
        data={filteredRfqs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.rfqCard}>
            {/* Top Badges */}
            <View style={styles.rfqTopRow}>
              <View style={styles.buyerInfoRow}>
                <Text style={styles.buyerFlag}>{item.buyerCountry === 'IN' ? '🇮🇳' : '🇯🇵'}</Text>
                <Text style={styles.buyerCompany}>{item.buyerCompany}</Text>
                {item.buyerVerified && (
                  <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                )}
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>{item.status}</Text>
              </View>
            </View>

            {/* Title */}
            <Text style={styles.rfqTitle}>{item.title}</Text>

            {/* Specs Grid */}
            <View style={styles.specsGrid}>
              <View style={styles.specItem}>
                <Ionicons name="cube-outline" size={13} color="#94a3b8" />
                <Text style={styles.specLabel}>Material:</Text>
                <Text style={styles.specVal}>{item.material}</Text>
              </View>

              <View style={styles.specItem}>
                <Ionicons name="layers-outline" size={13} color="#94a3b8" />
                <Text style={styles.specLabel}>Quantity:</Text>
                <Text style={styles.specVal}>{item.quantity}</Text>
              </View>

              <View style={styles.specItem}>
                <Ionicons name="locate-outline" size={13} color="#94a3b8" />
                <Text style={styles.specLabel}>Tolerance:</Text>
                <Text style={styles.specVal}>{item.tolerance}</Text>
              </View>

              <View style={styles.specItem}>
                <Ionicons name="wallet-outline" size={13} color="#94a3b8" />
                <Text style={styles.specLabel}>Target Budget:</Text>
                <Text style={[styles.specVal, { color: '#38bdf8' }]}>{item.targetBudget}</Text>
              </View>
            </View>

            {/* CAD File Attached Banner */}
            {item.cadFileAttached && (
              <View style={styles.cadAttachmentBar}>
                <Ionicons name="document-attach" size={14} color="#38bdf8" />
                <Text style={styles.cadAttachedText} numberOfLines={1}>
                  {item.cadFileName || '3D_CAD_Model.stp'}
                </Text>
                <Text style={styles.cadDownloadText}>Preview CAD</Text>
              </View>
            )}

            {/* Description */}
            <Text style={styles.descriptionText} numberOfLines={2}>
              {item.description}
            </Text>

            {/* Card Footer Actions */}
            <View style={styles.cardFooter}>
              <View style={styles.bidsCountBox}>
                <Ionicons name="people-outline" size={13} color="#94a3b8" />
                <Text style={styles.bidsCountText}>{item.bidsCount} Quotes Placed</Text>
              </View>

              <TouchableOpacity
                style={styles.quoteBtn}
                onPress={() => setSelectedRFQ(item)}
              >
                <Ionicons name="paper-plane" size={13} color="#ffffff" />
                <Text style={styles.quoteBtnText}>Submit Quote</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Quote Submission Modal */}
      <Modal
        visible={!!selectedRFQ}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedRFQ(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sheetContainer}>
            {selectedRFQ && (
              <>
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.modalTitle}>Submit Supplier Bid</Text>
                    <Text style={styles.modalSubtitle} numberOfLines={1}>
                      {selectedRFQ.title}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedRFQ(null)}>
                    <Ionicons name="close" size={22} color="#94a3b8" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.buyerSummaryBox}>
                    <Text style={styles.buyerSummText}>
                      Buyer: {selectedRFQ.buyerCompany} ({selectedRFQ.buyerCountry === 'IN' ? 'India 🇮🇳' : 'Japan 🇯🇵'})
                    </Text>
                    <Text style={styles.buyerSummSub}>
                      Target: {selectedRFQ.targetBudget} • Volume: {selectedRFQ.quantity}
                    </Text>
                  </View>

                  <Text style={styles.inputTitle}>Your Proposed Unit Price *</Text>
                  <TextInput
                    style={styles.inputBox}
                    value={bidPrice}
                    onChangeText={setBidPrice}
                    placeholder="e.g. ₹38,500 / unit"
                    placeholderTextColor="#64748b"
                  />

                  <Text style={styles.inputTitle}>Lead Time to First Article *</Text>
                  <TextInput
                    style={styles.inputBox}
                    value={bidLeadTime}
                    onChangeText={setBidLeadTime}
                    placeholder="e.g. 28 days"
                    placeholderTextColor="#64748b"
                  />

                  <Text style={styles.inputTitle}>Technical Capabilities & Machine Allocation</Text>
                  <TextInput
                    style={[styles.inputBox, { height: 75, textAlignVertical: 'top' }]}
                    value={bidNote}
                    onChangeText={setBidNote}
                    multiline
                    placeholderTextColor="#64748b"
                  />
                </ScrollView>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.modalCancelBtn}
                    onPress={() => setSelectedRFQ(null)}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleSendQuote}>
                    <Ionicons name="checkmark-circle" size={17} color="#ffffff" />
                    <Text style={styles.modalSubmitText}>Transmit Formal Quote</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a101d',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  screenTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  screenSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  postRfqTopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  postRfqTopBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  filterTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 10,
    marginTop: 4,
  },
  tabBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#131e33',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  tabBtnActive: {
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
  },
  tabBtnText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: '#38bdf8',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
    gap: 12,
  },
  rfqCard: {
    backgroundColor: '#101a2e',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e2d4a',
    padding: 14,
  },
  rfqTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  buyerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  buyerFlag: {
    fontSize: 13,
  },
  buyerCompany: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '800',
  },
  rfqTitle: {
    color: '#ffffff',
    fontSize: 14.5,
    fontWeight: '700',
    marginBottom: 10,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#0c1524',
    borderRadius: 8,
    padding: 8,
    gap: 8,
    marginBottom: 10,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: '48%',
  },
  specLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },
  specVal: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    flexShrink: 1,
  },
  cadAttachmentBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#131e33',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 10,
  },
  cadAttachedText: {
    color: '#cbd5e1',
    fontSize: 11,
    flex: 1,
  },
  cadDownloadText: {
    color: '#38bdf8',
    fontSize: 10.5,
    fontWeight: '700',
  },
  descriptionText: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 10,
  },
  bidsCountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bidsCountText: {
    color: '#94a3b8',
    fontSize: 11.5,
  },
  quoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
  },
  quoteBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#0c1524',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalSubtitle: {
    color: '#38bdf8',
    fontSize: 11.5,
    marginTop: 2,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  buyerSummaryBox: {
    backgroundColor: '#131e33',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 14,
  },
  buyerSummText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700',
  },
  buyerSummSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  inputTitle: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 5,
    marginTop: 8,
  },
  inputBox: {
    backgroundColor: '#131e33',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  modalCancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1e293b',
  },
  modalCancelText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  modalSubmitBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalSubmitText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
