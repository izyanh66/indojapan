import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BusinessEntity, CountryCode } from '../types';

interface DiscoverScreenProps {
  businesses: BusinessEntity[];
  onSelectBusiness: (biz: BusinessEntity) => void;
  onScheduleWithBusiness: (biz: BusinessEntity) => void;
  initialCorridorFilter?: boolean;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  businesses,
  onSelectBusiness,
  onScheduleWithBusiness,
  initialCorridorFilter = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | 'ALL'>(
    initialCorridorFilter ? 'JP' : 'ALL'
  );
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sustainableOnly, setSustainableOnly] = useState(false);
  const [selectedBizModal, setSelectedBizModal] = useState<BusinessEntity | null>(null);

  const filteredBusinesses = businesses.filter((b) => {
    if (selectedCountry !== 'ALL' && b.country !== selectedCountry) return false;
    if (verifiedOnly && !b.isVerified) return false;
    if (sustainableOnly && !b.sustainableRating.includes('A+') && !b.sustainableRating.includes('Platinum') && !b.sustainableRating.includes('Gold')) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.name.toLowerCase().includes(q);
      const matchCat = b.primaryCategory.toLowerCase().includes(q);
      const matchCap = b.capabilities.some((c) => c.toLowerCase().includes(q));
      const matchMat = b.materials.some((m) => m.toLowerCase().includes(q));
      return matchName || matchCat || matchCap || matchMat;
    }
    return true;
  });

  const handleInquire = (biz: BusinessEntity) => {
    Alert.alert(
      'Inquiry Sent! ✉️',
      `Your technical inquiry & capability verification request was sent to ${biz.name}. Expected turnaround: < 2 hours via Indusync B2B messaging.`
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search-outline" size={18} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search 5-axis CNC, Inconel, Harmonic Drives, Pune, Nagoya..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={16} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Row */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {(['ALL', 'IN', 'JP'] as const).map((code) => (
            <TouchableOpacity
              key={code}
              style={[styles.filterChip, selectedCountry === code && styles.filterChipActive]}
              onPress={() => setSelectedCountry(code)}
            >
              <Text style={styles.flagEmoji}>
                {code === 'ALL' ? '🌐' : code === 'IN' ? '🇮🇳' : '🇯🇵'}
              </Text>
              <Text style={[styles.filterChipText, selectedCountry === code && styles.filterChipTextActive]}>
                {code === 'ALL' ? 'All Hubs' : code === 'IN' ? 'India Hubs' : 'Japan Hubs'}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.filterChip, verifiedOnly && styles.filterChipActive]}
            onPress={() => setVerifiedOnly(!verifiedOnly)}
          >
            <Ionicons name="checkmark-circle" size={14} color={verifiedOnly ? '#ffffff' : '#10b981'} />
            <Text style={[styles.filterChipText, verifiedOnly && styles.filterChipTextActive]}>
              Verified Only
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, sustainableOnly && styles.filterChipActive]}
            onPress={() => setSustainableOnly(!sustainableOnly)}
          >
            <Ionicons name="leaf" size={14} color={sustainableOnly ? '#ffffff' : '#10b981'} />
            <Text style={[styles.filterChipText, sustainableOnly && styles.filterChipTextActive]}>
              Green / Low-Carbon
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Directory List */}
      <FlatList
        data={filteredBusinesses}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bizCard}
            activeOpacity={0.85}
            onPress={() => setSelectedBizModal(item)}
          >
            {/* Top Cover / Factory Image */}
            <View style={styles.coverWrapper}>
              <Image source={{ uri: item.coverImage }} style={styles.coverImage} contentFit="cover" />
              <View style={styles.coverGradientOverlay} />

              {/* Country & Status Pill */}
              <View style={styles.countryBadgeTop}>
                <Text style={styles.countryFlagEmoji}>{item.country === 'IN' ? '🇮🇳' : '🇯🇵'}</Text>
                <Text style={styles.countryCity}>{item.city}</Text>
              </View>

              {/* Corridor MOU Badge */}
              {item.corridorPartnerStatus === 'ACTIVE_JETRO_MOU' && (
                <View style={styles.corridorMouBadge}>
                  <Text style={styles.corridorMouText}>IN-JP JETRO MoU</Text>
                </View>
              )}
            </View>

            {/* Business Body */}
            <View style={styles.bizBody}>
              <View style={styles.titleRow}>
                <Text style={styles.bizName}>{item.name}</Text>
                {item.isVerified && (
                  <Ionicons name="checkmark-circle" size={17} color="#10b981" />
                )}
                <View style={styles.trustScorePill}>
                  <Text style={styles.trustScoreText}>{item.trustScore}% Trust</Text>
                </View>
              </View>

              <Text style={styles.primaryCategory}>{item.primaryCategory}</Text>

              {/* Capabilities Chips */}
              <View style={styles.capabilitiesRow}>
                {item.capabilities.slice(0, 3).map((cap, idx) => (
                  <View key={idx} style={styles.capChip}>
                    <Text style={styles.capChipText}>{cap}</Text>
                  </View>
                ))}
                {item.capabilities.length > 3 && (
                  <View style={styles.capChipMore}>
                    <Text style={styles.capChipMoreText}>+{item.capabilities.length - 3}</Text>
                  </View>
                )}
              </View>

              {/* Capacity Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{item.machineryCount}</Text>
                  <Text style={styles.statLabel}>Machinery</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={[styles.statNumber, { color: '#10b981' }]}>{item.spareCapacityHours}h</Text>
                  <Text style={styles.statLabel}>Monthly Spare</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{item.certifications[0] || 'ISO 9001'}</Text>
                  <Text style={styles.statLabel}>Certification</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.bizCardActions}>
                <TouchableOpacity
                  style={styles.inquireBtn}
                  onPress={() => handleInquire(item)}
                >
                  <Ionicons name="mail-outline" size={14} color="#38bdf8" />
                  <Text style={styles.inquireBtnText}>Send Inquiry</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.meetingBtn}
                  onPress={() => onScheduleWithBusiness(item)}
                >
                  <Ionicons name="calendar" size={14} color="#0f172a" />
                  <Text style={styles.meetingBtnText}>Schedule Meeting</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Full Business Details Modal */}
      <Modal
        visible={!!selectedBizModal}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedBizModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sheetContainer}>
            {selectedBizModal && (
              <>
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalHeaderTitle}>{selectedBizModal.name}</Text>
                    <Text style={styles.modalHeaderSub}>
                      {selectedBizModal.legalEntity} • {selectedBizModal.city}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setSelectedBizModal(null)}
                    style={styles.modalCloseBtn}
                  >
                    <Ionicons name="close" size={20} color="#94a3b8" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalScrollBody} showsVerticalScrollIndicator={false}>
                  {/* Verified & Certifications Bar */}
                  <View style={styles.certsRow}>
                    {selectedBizModal.certifications.map((c, idx) => (
                      <View key={idx} style={styles.certPill}>
                        <Ionicons name="shield-checkmark" size={12} color="#10b981" />
                        <Text style={styles.certPillText}>{c}</Text>
                      </View>
                    ))}
                    <View style={styles.greenCertPill}>
                      <Ionicons name="leaf" size={12} color="#10b981" />
                      <Text style={styles.greenCertPillText}>{selectedBizModal.sustainableRating}</Text>
                    </View>
                  </View>

                  <Text style={styles.modalSectionHeading}>About the Manufacturing Plant</Text>
                  <Text style={styles.modalAboutText}>{selectedBizModal.about}</Text>

                  {/* Featured Machinery List */}
                  <Text style={styles.modalSectionHeading}>Audited Machinery & Spare Capacity</Text>
                  <View style={{ gap: 8, marginBottom: 16 }}>
                    {selectedBizModal.featuredMachinery.map((m, idx) => (
                      <View key={idx} style={styles.machineCard}>
                        <View style={styles.machineTop}>
                          <Text style={styles.machineModel}>{m.model}</Text>
                          <View
                            style={[
                              styles.machineStatusPill,
                              m.status === 'SPARE_CAPACITY' && styles.statusSpare,
                            ]}
                          >
                            <Text style={styles.statusText}>
                              {m.status === 'SPARE_CAPACITY' ? 'Spare Hours Open' : 'Operating'}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.machineSpecs}>{m.specs}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Materials Processed */}
                  <Text style={styles.modalSectionHeading}>Materials Processed</Text>
                  <View style={styles.materialsFlex}>
                    {selectedBizModal.materials.map((mat, idx) => (
                      <View key={idx} style={styles.materialChip}>
                        <Text style={styles.materialChipText}>{mat}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>

                {/* Footer CTAs */}
                <View style={styles.modalFooterRow}>
                  <TouchableOpacity
                    style={styles.modalInquireBtn}
                    onPress={() => {
                      const b = selectedBizModal;
                      setSelectedBizModal(null);
                      handleInquire(b);
                    }}
                  >
                    <Ionicons name="chatbubbles-outline" size={16} color="#38bdf8" />
                    <Text style={styles.modalInquireText}>Message</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalBookBtn}
                    onPress={() => {
                      const b = selectedBizModal;
                      setSelectedBizModal(null);
                      onScheduleWithBusiness(b);
                    }}
                  >
                    <Ionicons name="calendar-outline" size={16} color="#0f172a" />
                    <Text style={styles.modalBookText}>Schedule Meeting</Text>
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
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121f36',
    borderWidth: 1,
    borderColor: '#1e2d4a',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 13,
  },
  filterBar: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#162238',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#26354f',
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#38bdf8',
  },
  filterChipText: {
    color: '#94a3b8',
    fontSize: 11.5,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  flagEmoji: {
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
    gap: 12,
  },
  bizCard: {
    backgroundColor: '#101a2e',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e2d4a',
    overflow: 'hidden',
  },
  coverWrapper: {
    height: 120,
    width: '100%',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 16, 29, 0.45)',
  },
  countryBadgeTop: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  countryFlagEmoji: {
    fontSize: 13,
  },
  countryCity: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  corridorMouBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  corridorMouText: {
    color: '#0f172a',
    fontSize: 10,
    fontWeight: '900',
  },
  bizBody: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  bizName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  trustScorePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  trustScoreText: {
    color: '#10b981',
    fontSize: 10.5,
    fontWeight: '800',
  },
  primaryCategory: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
    marginBottom: 10,
  },
  capabilitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  capChip: {
    backgroundColor: '#182740',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  capChipText: {
    color: '#cbd5e1',
    fontSize: 11,
  },
  capChipMore: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
  },
  capChipMoreText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0c1524',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 12,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  bizCardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  inquireBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#182740',
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#263b5e',
  },
  inquireBtnText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
  },
  meetingBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#f59e0b',
    paddingVertical: 9,
    borderRadius: 8,
  },
  meetingBtnText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '800',
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
    maxHeight: '88%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  modalHeaderTitle: {
    color: '#ffffff',
    fontSize: 16.5,
    fontWeight: '800',
  },
  modalHeaderSub: {
    color: '#38bdf8',
    fontSize: 11.5,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
    backgroundColor: '#1e293b',
    borderRadius: 14,
  },
  modalScrollBody: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  certsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  certPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  certPillText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '700',
  },
  greenCertPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  greenCertPillText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '600',
  },
  modalSectionHeading: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalAboutText: {
    color: '#94a3b8',
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 16,
  },
  machineCard: {
    backgroundColor: '#131e33',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  machineTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  machineModel: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  machineStatusPill: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusSpare: {
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
  },
  statusText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '800',
  },
  machineSpecs: {
    color: '#94a3b8',
    fontSize: 11,
  },
  materialsFlex: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  materialChip: {
    backgroundColor: '#182740',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  materialChipText: {
    color: '#38bdf8',
    fontSize: 11.5,
    fontWeight: '600',
  },
  modalFooterRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  modalInquireBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#182740',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#263b5e',
  },
  modalInquireText: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '700',
  },
  modalBookBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f59e0b',
    paddingVertical: 12,
    borderRadius: 10,
  },
  modalBookText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800',
  },
});
