import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CountryCode, UserRole } from '../types';

interface HeaderProps {
  currentLanguage: 'EN' | 'JA' | 'HI';
  onLanguageChange: (lang: 'EN' | 'JA' | 'HI') => void;
  onOpenNotifications: () => void;
  onOpenAIAssistant: () => void;
  notificationCount: number;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenNotifications,
  onOpenAIAssistant,
  notificationCount,
  activeRole,
  onRoleChange,
}) => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  const getRoleDisplay = () => {
    switch (activeRole) {
      case 'MANUFACTURER':
        return { name: 'Rajesh Sharma', company: 'Bharat Precision', country: 'IN', flag: '🇮🇳' };
      case 'BRAND_BUYER':
        return { name: 'Kenji Takahashi', company: 'Nagoya Robotics', country: 'JP', flag: '🇯🇵' };
      case 'SUPPLIER':
        return { name: 'Priya Nambiar', company: 'EcoAlloy Circular', country: 'IN', flag: '🇮🇳' };
      case 'JOB_SEEKER':
        return { name: 'Aarav Mehta', company: 'Precision Metrologist', country: 'IN', flag: '🇮🇳' };
      case 'TECH_PARTNER':
        return { name: 'Dr. Hiroshi Tanaka', company: 'Osaka AI Kaizen', country: 'JP', flag: '🇯🇵' };
    }
  };

  const current = getRoleDisplay();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.brandRow}>
        {/* Logo and Brand */}
        <View style={styles.brandGroup}>
          <View style={styles.logoBadge}>
            <Ionicons name="hardware-chip-outline" size={20} color="#38bdf8" />
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.brandTitle}>INDUSYNC</Text>
              <View style={styles.aiPill}>
                <Text style={styles.aiPillText}>AI</Text>
              </View>
            </View>
            <Text style={styles.brandSubtitle}>B2B Manufacturing Network</Text>
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.actionsGroup}>
          {/* Language Switcher */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setShowLangModal(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="globe-outline" size={16} color="#94a3b8" />
            <Text style={styles.actionBtnText}>{currentLanguage}</Text>
          </TouchableOpacity>

          {/* AI Copilot Sparkle */}
          <TouchableOpacity
            style={[styles.iconCircle, styles.aiGlowBtn]}
            onPress={onOpenAIAssistant}
            activeOpacity={0.7}
          >
            <Ionicons name="sparkles" size={17} color="#f59e0b" />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={onOpenNotifications}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={18} color="#e2e8f0" />
            {notificationCount > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* User Profile Pill with Flag & Dropdown */}
          <TouchableOpacity
            style={styles.userProfilePill}
            onPress={() => setShowRoleModal(true)}
            activeOpacity={0.8}
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>
                {current.country}
              </Text>
            </View>
            <Text style={styles.userName} numberOfLines={1}>
              {current.name.split(' ')[0]}
            </Text>
            <Ionicons name="chevron-down" size={13} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Role Switcher Modal */}
      <Modal
        visible={showRoleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRoleModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowRoleModal(false)}
        >
          <View style={styles.dropdownCard}>
            <View style={styles.dropdownHeader}>
              <Ionicons name="swap-horizontal" size={18} color="#38bdf8" />
              <Text style={styles.dropdownTitle}>Switch Persona / Role</Text>
            </View>
            <Text style={styles.dropdownHint}>
              Test how Manufacturers, Japanese OEMs, and Suppliers collaborate
            </Text>

            <ScrollView style={{ maxHeight: 300 }}>
              <RoleOption
                name="Rajesh Sharma 🇮🇳"
                roleLabel="Manufacturer (5-Axis Turn-Mill • Pune)"
                company="Bharat Precision Mechatronics"
                role="MANUFACTURER"
                activeRole={activeRole}
                onSelect={(r) => {
                  onRoleChange(r);
                  setShowRoleModal(false);
                }}
              />
              <RoleOption
                name="Kenji Takahashi 🇯🇵"
                roleLabel="Japanese Brand / OEM (Robotics • Nagoya)"
                company="Nagoya Precision Robotics K.K."
                role="BRAND_BUYER"
                activeRole={activeRole}
                onSelect={(r) => {
                  onRoleChange(r);
                  setShowRoleModal(false);
                }}
              />
              <RoleOption
                name="Priya Nambiar 🇮🇳"
                roleLabel="Raw Material Supplier (Recycled Al-6061)"
                company="EcoAlloy Circular Solutions"
                role="SUPPLIER"
                activeRole={activeRole}
                onSelect={(r) => {
                  onRoleChange(r);
                  setShowRoleModal(false);
                }}
              />
              <RoleOption
                name="Dr. Hiroshi Tanaka 🇯🇵"
                roleLabel="Tech Partner (Digital Kaizen • Osaka)"
                company="Osaka Industrial AI Consortium"
                role="TECH_PARTNER"
                activeRole={activeRole}
                onSelect={(r) => {
                  onRoleChange(r);
                  setShowRoleModal(false);
                }}
              />
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Language Modal */}
      <Modal
        visible={showLangModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLangModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLangModal(false)}
        >
          <View style={styles.langDropdownCard}>
            <Text style={styles.dropdownTitle}>Select Interface Language</Text>
            {(['EN', 'JA', 'HI'] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.langOptionRow,
                  currentLanguage === lang && styles.langOptionActive,
                ]}
                onPress={() => {
                  onLanguageChange(lang);
                  setShowLangModal(false);
                }}
              >
                <Text style={styles.langFlag}>
                  {lang === 'EN' ? '🌐' : lang === 'JA' ? '🇯🇵' : '🇮🇳'}
                </Text>
                <Text style={styles.langName}>
                  {lang === 'EN' ? 'English (Global)' : lang === 'JA' ? '日本語 (Japanese)' : 'हिन्दी (Hindi)'}
                </Text>
                {currentLanguage === lang && (
                  <Ionicons name="checkmark-circle" size={18} color="#3b82f6" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

interface RoleOptionProps {
  name: string;
  roleLabel: string;
  company: string;
  role: UserRole;
  activeRole: UserRole;
  onSelect: (r: UserRole) => void;
}

const RoleOption: React.FC<RoleOptionProps> = ({
  name,
  roleLabel,
  company,
  role,
  activeRole,
  onSelect,
}) => {
  const isSelected = role === activeRole;
  return (
    <TouchableOpacity
      style={[styles.roleOptionItem, isSelected && styles.roleOptionSelected]}
      onPress={() => onSelect(role)}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.roleName, isSelected && styles.roleNameSelected]}>
          {name}
        </Text>
        <Text style={styles.roleCompany}>{company}</Text>
        <Text style={styles.roleSubtext}>{roleLabel}</Text>
      </View>
      {isSelected && (
        <Ionicons name="checkmark-circle" size={20} color="#38bdf8" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#0c1524',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  aiPill: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 5,
  },
  aiPillText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionBtnText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  aiGlowBtn: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  userProfilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#1e293b',
    paddingVertical: 4,
    paddingHorizontal: 6,
    paddingRight: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#334155',
    maxWidth: 130,
  },
  avatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  userName: {
    color: '#f1f5f9',
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdownCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    width: '100%',
    maxWidth: 440,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  dropdownTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  dropdownHint: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 14,
  },
  roleOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  roleOptionSelected: {
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
  },
  roleName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  roleNameSelected: {
    color: '#38bdf8',
  },
  roleCompany: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  roleSubtext: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  langDropdownCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    width: '100%',
    maxWidth: 320,
    padding: 16,
  },
  langOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  langOptionActive: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  langFlag: {
    fontSize: 18,
    marginRight: 10,
  },
  langName: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});
