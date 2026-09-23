import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { UserRole } from '../types';
import { REFERENCE_IMAGE_URL } from '../data/mockData';

interface ProfileScreenProps {
  activeRole: UserRole;
  onRoleSwitch: (role: UserRole) => void;
  onScheduleMeeting: () => void;
  onPostRFQ: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  activeRole,
  onRoleSwitch,
  onScheduleMeeting,
  onPostRFQ,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MACHINERY' | 'CERTS' | 'CORRIDOR'>('OVERVIEW');

  const getProfileData = () => {
    switch (activeRole) {
      case 'MANUFACTURER':
        return {
          name: 'Rajesh Sharma',
          roleTitle: 'Managing Director & Precision Head',
          company: 'Bharat Precision Mechatronics Pvt. Ltd.',
          country: 'IN',
          countryName: 'India',
          city: 'Chakan Industrial Area, Pune',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
          cover: REFERENCE_IMAGE_URL,
          trustScore: 98,
          isVerified: true,
          corridorRole: 'IN-JP Bilateral Manufacturing Initiative Lead',
          spareHours: '450 hrs/month (DMG MORI 5-Axis)',
          about:
            'Leading AS9100D certified precision manufacturer in Pune with German and Japanese turn-mill centers. Specializing in high-temperature Inconel 718 turbine impellers, titanium orthopedic joints, and humanoid robotics subassemblies.',
          certifications: ['AS9100D', 'ISO 9001:2015', 'IATF 16949', 'Silver EcoVadis'],
          capabilities: [
            '5-Axis Simultaneous Turn-Mill (DMG MORI NTX 2000)',
            'Inconel 718 & Titanium Machining',
            'Zeiss CMM Inspection (0.5µm accuracy)',
            'Laser Tool Probing & Optical Presetter',
            'Electro-Chemical Deburring',
          ],
        };
      case 'BRAND_BUYER':
        return {
          name: 'Kenji Takahashi',
          roleTitle: 'Vice President of Global Sourcing',
          company: 'Nagoya Precision Robotics Corporation',
          country: 'JP',
          countryName: 'Japan',
          city: 'Nagoya, Aichi Prefecture',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
          cover: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
          trustScore: 99,
          isVerified: true,
          corridorRole: 'JETRO Robotics Supply Chain Anchor',
          spareHours: '180 hrs/month (Mazak Multi-Tasking)',
          about:
            'Nagoya-based robotics OEM producing precision harmonic drive speed reducers and humanoid robotic actuators. Sourcing Tier-1 high-precision machining partners in Indian industrial clusters.',
          certifications: ['JIS Q 9100', 'ISO 14001', 'CE / UL Compliant'],
          capabilities: ['Harmonic Drives', 'Spline Broaching', 'Cleanroom Assembly', 'Torque Ripple Testing'],
        };
      case 'SUPPLIER':
        return {
          name: 'Priya Nambiar',
          roleTitle: 'Chief Sustainability Officer & Plant Head',
          company: 'EcoAlloy Circular Metal Systems India Pvt Ltd',
          country: 'IN',
          countryName: 'India',
          city: 'Peenya Industrial Estate, Bengaluru',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
          cover: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
          trustScore: 96,
          isVerified: true,
          corridorRole: 'Indo-Japan Clean Mobility Aluminum Supplier',
          spareHours: '520 hrs/month (Extrusion Press)',
          about:
            'Producer of certified 100% solar-melted Recycled Aluminum 6061-T6 extrusion billets and EV battery tray profiles. Achieving 74% reduction in embodied carbon compared to virgin smelting.',
          certifications: ['ASI Stewardship', 'ISO 14064 GHG', 'ISO 9001'],
          capabilities: ['Solar-Powered Extrusions', 'Friction Stir Welding (FSW)', 'LCA Carbon Auditing'],
        };
      case 'JOB_SEEKER':
        return {
          name: 'Aarav Mehta',
          roleTitle: 'Senior Precision Metrologist & GD&T Specialist',
          company: 'Independent Engineering Consultant',
          country: 'IN',
          countryName: 'India',
          city: 'Pune / Open to Nagoya Relocation',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          cover: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
          trustScore: 94,
          isVerified: true,
          corridorRole: 'Indo-Japan Technical Talent Pool',
          spareHours: 'Open for Full-Time / Advisory Roles',
          about:
            '8+ years aerospace inspection experience with Zeiss Calypso, Mitutoyo CMM, and optical 3D scanners. Proficient in JIS Q 9100 and AS9100 first-article inspection reports (FAIR).',
          certifications: ['Zeiss Calypso Level 3', 'ASQ Certified Quality Inspector', 'Six Sigma Black Belt'],
          capabilities: ['Zeiss Calypso CMM', 'GD&T ASME Y14.5M', 'JIS Metrology', 'Gauge R&R Studies'],
        };
      case 'TECH_PARTNER':
        return {
          name: 'Dr. Hiroshi Tanaka',
          roleTitle: 'Director of AI & Smart Factory Technologies',
          company: 'Osaka Industrial AI Consortium',
          country: 'JP',
          countryName: 'Japan',
          city: 'Osaka, Japan',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
          cover: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
          trustScore: 97,
          isVerified: true,
          corridorRole: 'Kaizen 4.0 Bilateral Director',
          spareHours: '12 Plant Onboarding Slots Open',
          about:
            'Deploying computer-vision edge AI models on high-speed stamping and CNC machines to detect sub-surface cracks and tool wear in real time across Indian manufacturing clusters.',
          certifications: ['Japan AI Association', 'ISO 50001', 'Kaizen Institute Fellow'],
          capabilities: ['Edge AI Computer Vision', 'Tool Wear Predictive Analytics', 'OEE Optimization'],
        };
    }
  };

  const p = getProfileData();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Cover Image & Avatar */}
      <View style={styles.headerCoverWrapper}>
        <Image source={{ uri: p.cover }} style={styles.coverImage} contentFit="cover" />
        <View style={styles.coverOverlay} />

        <View style={styles.countryPillTop}>
          <Text style={styles.countryFlagEmoji}>{p.country === 'IN' ? '🇮🇳' : '🇯🇵'}</Text>
          <Text style={styles.countryTopText}>{p.city}</Text>
        </View>
      </View>

      {/* Profile Bio Card */}
      <View style={styles.profileBioCard}>
        <View style={styles.avatarRow}>
          <Image source={{ uri: p.avatar }} style={styles.avatarLarge} />
          <View style={styles.trustBadgeLarge}>
            <Ionicons name="shield-checkmark" size={13} color="#10b981" />
            <Text style={styles.trustBadgeLargeText}>{p.trustScore}% Trust Score</Text>
          </View>
        </View>

        <View style={styles.nameSection}>
          <View style={styles.nameRow}>
            <Text style={styles.fullName}>{p.name}</Text>
            {p.isVerified && (
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            )}
          </View>
          <Text style={styles.roleTitle}>{p.roleTitle}</Text>
          <Text style={styles.companyNameText}>{p.company}</Text>
        </View>

        {/* Corridor Pill */}
        <View style={styles.corridorProfileTag}>
          <Ionicons name="flag" size={13} color="#f59e0b" />
          <Text style={styles.corridorProfileText}>{p.corridorRole}</Text>
        </View>

        {/* Action Buttons Row */}
        <View style={styles.profileActionRow}>
          <TouchableOpacity style={styles.bookMeetingBtn} onPress={onScheduleMeeting}>
            <Ionicons name="calendar" size={15} color="#0f172a" />
            <Text style={styles.bookMeetingBtnText}>Schedule Meeting</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.postRfqBtn} onPress={onPostRFQ}>
            <Ionicons name="megaphone-outline" size={15} color="#38bdf8" />
            <Text style={styles.postRfqBtnText}>Post RFQ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Role Switcher Selector Bar */}
      <View style={styles.roleSwitchSection}>
        <Text style={styles.roleSwitchTitle}>Switch Persona / Test Roles:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {[
            { role: 'MANUFACTURER' as const, label: '5-Axis Manufacturer (Pune) 🇮🇳' },
            { role: 'BRAND_BUYER' as const, label: 'Robotics OEM (Nagoya) 🇯🇵' },
            { role: 'SUPPLIER' as const, label: 'Green Alloys (Bengaluru) 🇮🇳' },
            { role: 'JOB_SEEKER' as const, label: 'Metrology Specialist 🇮🇳' },
            { role: 'TECH_PARTNER' as const, label: 'Kaizen 4.0 AI Partner 🇯🇵' },
          ].map((item) => (
            <TouchableOpacity
              key={item.role}
              style={[styles.roleSwitchChip, activeRole === item.role && styles.roleSwitchChipActive]}
              onPress={() => onRoleSwitch(item.role)}
            >
              <Text
                style={[
                  styles.roleSwitchChipText,
                  activeRole === item.role && styles.roleSwitchChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sub-Tabs: Overview, Machinery, Certs, Corridor */}
      <View style={styles.subTabsRow}>
        {(['OVERVIEW', 'MACHINERY', 'CERTS', 'CORRIDOR'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.subTabBtn, activeTab === tab && styles.subTabBtnActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.subTabBtnText, activeTab === tab && styles.subTabBtnTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      {activeTab === 'OVERVIEW' && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Business & Engineering Profile</Text>
          <Text style={styles.bodyParagraph}>{p.about}</Text>

          <Text style={[styles.sectionHeading, { marginTop: 14 }]}>Core Capabilities</Text>
          <View style={styles.tagsContainer}>
            {p.capabilities.map((c, idx) => (
              <View key={idx} style={styles.capabilityBadge}>
                <Ionicons name="checkmark-done" size={13} color="#38bdf8" />
                <Text style={styles.capabilityBadgeText}>{c}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {activeTab === 'MACHINERY' && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Operating Lines & Spare Capacity</Text>
          <View style={styles.spareHoursCallout}>
            <Ionicons name="time" size={17} color="#10b981" />
            <View>
              <Text style={styles.spareHoursTitle}>Live Machine Capacity:</Text>
              <Text style={styles.spareHoursVal}>{p.spareHours}</Text>
            </View>
          </View>

          <View style={{ gap: 10 }}>
            <View style={styles.machineItemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mName}>DMG MORI NTX 2000 (2nd Gen) 5-Axis</Text>
                <Text style={styles.mSpecs}>12,000 RPM • CELOS CNC • Inconel 718 Dedicated</Text>
              </View>
              <View style={styles.mStatusOpen}>
                <Text style={styles.mStatusText}>Open Slots</Text>
              </View>
            </View>

            <View style={styles.machineItemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mName}>Makino D500 Vertical Machining Center</Text>
                <Text style={styles.mSpecs}>20,000 RPM HSK-A63 • Full 5-axis continuous</Text>
              </View>
              <View style={styles.mStatusActive}>
                <Text style={styles.mStatusActiveText}>Active Batch</Text>
              </View>
            </View>

            <View style={styles.machineItemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mName}>Zeiss PRISMO Ultra Coordinate Measuring Machine</Text>
                <Text style={styles.mSpecs}>0.5 µm accuracy • First-Article Automated Reports</Text>
              </View>
              <View style={styles.mStatusActive}>
                <Text style={styles.mStatusActiveText}>Operating</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {activeTab === 'CERTS' && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Audited Certifications & Standards</Text>
          <View style={{ gap: 8, marginTop: 8 }}>
            {p.certifications.map((cert, idx) => (
              <View key={idx} style={styles.certAuditRow}>
                <Ionicons name="shield-checkmark" size={18} color="#10b981" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.certAuditName}>{cert}</Text>
                  <Text style={styles.certAuditStatus}>Audited & Validated on Indusync Blockchain</Text>
                </View>
                <Ionicons name="checkmark" size={16} color="#10b981" />
              </View>
            ))}
          </View>
        </View>
      )}

      {activeTab === 'CORRIDOR' && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>🇮🇳🇯🇵 India–Japan Bilateral Partnership</Text>
          <Text style={styles.bodyParagraph}>
            Certified under the Japan-India Digital & Manufacturing Partnership (JIDP). Enjoys expedited customs clearance, dual IST/JST contract notarization, and JETRO business matching prioritization.
          </Text>

          <TouchableOpacity
            style={styles.corridorConnectBtn}
            onPress={() => {
              Alert.alert(
                'JETRO Bilateral Desk 🤝',
                'Connecting to the Japan External Trade Organization (JETRO) Indo-Japan Manufacturing Facilitator.'
              );
            }}
          >
            <Ionicons name="business" size={15} color="#0f172a" />
            <Text style={styles.corridorConnectBtnText}>Contact Bilateral Trade Desk</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a101d',
  },
  content: {
    paddingBottom: 90,
  },
  headerCoverWrapper: {
    height: 150,
    width: '100%',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 16, 29, 0.4)',
  },
  countryPillTop: {
    position: 'absolute',
    top: 12,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  countryFlagEmoji: {
    fontSize: 14,
  },
  countryTopText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  profileBioCard: {
    backgroundColor: '#101a2e',
    marginHorizontal: 16,
    marginTop: -40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e2d4a',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  avatarLarge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: '#2563eb',
    backgroundColor: '#1e293b',
  },
  trustBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  trustBadgeLargeText: {
    color: '#10b981',
    fontSize: 11.5,
    fontWeight: '800',
  },
  nameSection: {
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fullName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  roleTitle: {
    color: '#38bdf8',
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 2,
  },
  companyNameText: {
    color: '#cbd5e1',
    fontSize: 12,
    marginTop: 2,
  },
  corridorProfileTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
  },
  corridorProfileText: {
    color: '#f59e0b',
    fontSize: 11.5,
    fontWeight: '600',
  },
  profileActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  bookMeetingBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f59e0b',
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookMeetingBtnText: {
    color: '#0f172a',
    fontSize: 12.5,
    fontWeight: '800',
  },
  postRfqBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#182740',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#263b5e',
  },
  postRfqBtnText: {
    color: '#38bdf8',
    fontSize: 12.5,
    fontWeight: '700',
  },
  roleSwitchSection: {
    marginHorizontal: 16,
    marginTop: 14,
  },
  roleSwitchTitle: {
    color: '#94a3b8',
    fontSize: 11.5,
    fontWeight: '700',
    marginBottom: 6,
  },
  roleSwitchChip: {
    backgroundColor: '#121f36',
    borderWidth: 1,
    borderColor: '#1e2d4a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 6,
  },
  roleSwitchChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#38bdf8',
  },
  roleSwitchChipText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  roleSwitchChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  subTabsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#101a2e',
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: '#1e2d4a',
  },
  subTabBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 6,
  },
  subTabBtnActive: {
    backgroundColor: '#2563eb',
  },
  subTabBtnText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  subTabBtnTextActive: {
    color: '#ffffff',
  },
  sectionCard: {
    backgroundColor: '#101a2e',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e2d4a',
    padding: 16,
  },
  sectionHeading: {
    color: '#f8fafc',
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 6,
  },
  bodyParagraph: {
    color: '#cbd5e1',
    fontSize: 12.5,
    lineHeight: 18,
  },
  tagsContainer: {
    gap: 6,
    marginTop: 6,
  },
  capabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#131e33',
    padding: 8,
    borderRadius: 6,
  },
  capabilityBadgeText: {
    color: '#e2e8f0',
    fontSize: 12,
  },
  spareHoursCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  spareHoursTitle: {
    color: '#94a3b8',
    fontSize: 10.5,
  },
  spareHoursVal: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '800',
  },
  machineItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131e33',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  mName: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
  mSpecs: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  mStatusOpen: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  mStatusText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '800',
  },
  mStatusActive: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  mStatusActiveText: {
    color: '#94a3b8',
    fontSize: 10,
  },
  certAuditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#131e33',
    padding: 10,
    borderRadius: 8,
  },
  certAuditName: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
  certAuditStatus: {
    color: '#94a3b8',
    fontSize: 10.5,
  },
  corridorConnectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f59e0b',
    paddingVertical: 11,
    borderRadius: 8,
    marginTop: 14,
  },
  corridorConnectBtnText: {
    color: '#0f172a',
    fontSize: 12.5,
    fontWeight: '800',
  },
});
