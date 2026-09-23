import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Post, MeetingBooking } from '../types';

interface ScheduleMeetingModalProps {
  visible: boolean;
  onClose: () => void;
  post: Post | null;
  onConfirmBooking: (booking: MeetingBooking) => void;
}

const TOPICS = [
  {
    key: 'VIRTUAL_FACTORY_TOUR',
    label: '🏭 5-Axis Live Factory & Spindle Tour',
    desc: 'Live video feed inside Pune DMG MORI turn-mill center with QA technician',
  },
  {
    key: 'CAD_REVIEW',
    label: '📐 3D CAD & Micro-Tolerance Review (GD&T)',
    desc: 'Joint review of STEP files, tool paths, and CMM inspection requirements',
  },
  {
    key: 'RFQ_NEGOTIATION',
    label: '📋 Volume RFQ & Bilateral Pricing Negotiation',
    desc: 'Commercial discussions, batch sizes, payment terms & CIF/FOB logistics',
  },
  {
    key: 'TECH_TRANSFER',
    label: '🤝 Indo-Japan Technology Transfer & Kaizen MoU',
    desc: 'Bilateral partnership setup under JETRO & CII bilateral corridor',
  },
] as const;

const SLOTS = [
  { ist: '11:00 AM IST', jst: '02:30 PM JST' },
  { ist: '02:00 PM IST', jst: '05:30 PM JST' },
  { ist: '03:30 PM IST', jst: '07:00 PM JST' },
  { ist: '05:00 PM IST', jst: '08:30 PM JST' },
];

export const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({
  visible,
  onClose,
  post,
  onConfirmBooking,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<MeetingBooking['meetingType']>('VIRTUAL_FACTORY_TOUR');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(1);
  const [selectedDay, setSelectedDay] = useState('Tomorrow');
  const [ndaChecked, setNdaChecked] = useState(true);
  const [name, setName] = useState('Akira Tanaka');
  const [company, setCompany] = useState('Nippon Robotics K.K.');
  const [email, setEmail] = useState('tanaka@nagoya-robotics.co.jp');
  const [agendaNotes, setAgendaNotes] = useState(
    'Interested in 450 machine-hours spare capacity for Inconel 718 turbine impellers and robotic joint actuators.'
  );

  if (!post) return null;

  const handleConfirm = () => {
    const slot = SLOTS[selectedSlotIndex];
    const newBooking: MeetingBooking = {
      id: `mtg-${Date.now()}`,
      postId: post.id,
      hostId: post.author.id,
      hostName: post.author.name,
      hostCompany: post.author.companyName,
      hostCountry: post.author.country,
      guestName: name,
      guestCompany: company,
      guestEmail: email,
      guestCountry: 'JP',
      date: selectedDay === 'Tomorrow' ? 'Sep 24, 2026' : 'Sep 25, 2026',
      timeSlot: slot.ist,
      timeIST: slot.ist,
      timeJST: slot.jst,
      topic: TOPICS.find((t) => t.key === selectedTopic)?.label || 'Bilateral Meeting',
      meetingType: selectedTopic,
      ndaRequired: ndaChecked,
      notes: agendaNotes,
      status: 'CONFIRMED',
    };

    onConfirmBooking(newBooking);
    Alert.alert(
      'Meeting Confirmed! 📅',
      `Your B2B Bilateral Consultation with ${post.author.name} (${post.author.companyName}) is scheduled for ${newBooking.date} at ${newBooking.timeIST} / ${newBooking.timeJST}.\n\nA calendar invite and secure encrypted video link have been generated.`,
      [{ text: 'Great, View in Matches', onPress: onClose }]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.modalTitle}>Schedule B2B Meeting</Text>
              <Text style={styles.modalSubtitle}>
                with {post.author.name} • {post.author.companyName}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Bilateral Timezone Banner */}
            <View style={styles.tzBanner}>
              <View style={styles.tzItem}>
                <Text style={styles.tzFlag}>🇮🇳</Text>
                <View>
                  <Text style={styles.tzLabel}>India (IST)</Text>
                  <Text style={styles.tzSub}>UTC +5:30</Text>
                </View>
              </View>
              <Ionicons name="swap-horizontal" size={16} color="#f59e0b" />
              <View style={styles.tzItem}>
                <Text style={styles.tzFlag}>🇯🇵</Text>
                <View>
                  <Text style={styles.tzLabel}>Japan (JST)</Text>
                  <Text style={styles.tzSub}>UTC +9:00 (+3.5h)</Text>
                </View>
              </View>
            </View>

            {/* Select Day */}
            <Text style={styles.sectionHeading}>Select Date</Text>
            <View style={styles.daySelectorRow}>
              {['Tomorrow', 'Friday, Sep 25', 'Monday, Sep 28'].map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayChip, selectedDay === day && styles.dayChipActive]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text style={[styles.dayChipText, selectedDay === day && styles.dayChipTextActive]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Select Time Slot */}
            <Text style={styles.sectionHeading}>Select Synchronized Time Slot</Text>
            <View style={styles.slotsGrid}>
              {SLOTS.map((slot, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.slotCard, selectedSlotIndex === idx && styles.slotCardActive]}
                  onPress={() => setSelectedSlotIndex(idx)}
                >
                  <View style={styles.slotRow}>
                    <Text style={[styles.slotIST, selectedSlotIndex === idx && styles.slotTextActive]}>
                      {slot.ist}
                    </Text>
                    <Ionicons
                      name={selectedSlotIndex === idx ? 'radio-button-on' : 'radio-button-off'}
                      size={15}
                      color={selectedSlotIndex === idx ? '#38bdf8' : '#64748b'}
                    />
                  </View>
                  <Text style={styles.slotJST}>{slot.jst}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Select Meeting Topic */}
            <Text style={styles.sectionHeading}>Meeting Objective & Agenda</Text>
            <View style={styles.topicsColumn}>
              {TOPICS.map((topic) => (
                <TouchableOpacity
                  key={topic.key}
                  style={[
                    styles.topicCard,
                    selectedTopic === topic.key && styles.topicCardActive,
                  ]}
                  onPress={() => setSelectedTopic(topic.key)}
                >
                  <View style={styles.topicHeader}>
                    <Text style={styles.topicLabel}>{topic.label}</Text>
                    {selectedTopic === topic.key && (
                      <Ionicons name="checkmark-circle" size={17} color="#f59e0b" />
                    )}
                  </View>
                  <Text style={styles.topicDesc}>{topic.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Attendee Details */}
            <Text style={styles.sectionHeading}>Your Contact Information</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Company / Organization</Text>
              <TextInput
                style={styles.textInput}
                value={company}
                onChangeText={setCompany}
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Work Email (Calendar Invite)</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Technical Requirements & Notes</Text>
              <TextInput
                style={[styles.textInput, { height: 70, textAlignVertical: 'top' }]}
                value={agendaNotes}
                onChangeText={setAgendaNotes}
                multiline
                placeholderTextColor="#64748b"
              />
            </View>

            {/* NDA Toggle */}
            <View style={styles.switchRow}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.switchTitle}>Auto-Generate Mutual Bilateral NDA</Text>
                <Text style={styles.switchSubtitle}>
                  Includes Indusync standard IP protection for 3D CAD and machine parameters
                </Text>
              </View>
              <Switch
                value={ndaChecked}
                onValueChange={setNdaChecked}
                trackColor={{ false: '#334155', true: '#2563eb' }}
                thumbColor={ndaChecked ? '#38bdf8' : '#94a3b8'}
              />
            </View>
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Ionicons name="videocam-outline" size={18} color="#ffffff" />
              <Text style={styles.confirmBtnText}>Confirm Meeting</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    maxHeight: '90%',
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
  modalSubtitle: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 14,
    backgroundColor: '#1e293b',
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  tzBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#131e33',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: 16,
  },
  tzItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tzFlag: {
    fontSize: 18,
  },
  tzLabel: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700',
  },
  tzSub: {
    color: '#94a3b8',
    fontSize: 10,
  },
  sectionHeading: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  daySelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  dayChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#38bdf8',
  },
  dayChipText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  dayChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  slotsGrid: {
    gap: 8,
    marginBottom: 16,
  },
  slotCard: {
    backgroundColor: '#131e33',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  slotCardActive: {
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotIST: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
  },
  slotTextActive: {
    color: '#38bdf8',
  },
  slotJST: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  topicsColumn: {
    gap: 8,
    marginBottom: 16,
  },
  topicCard: {
    backgroundColor: '#131e33',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  topicCardActive: {
    borderColor: '#f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  topicLabel: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  topicDesc: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    color: '#cbd5e1',
    fontSize: 11.5,
    fontWeight: '600',
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: '#131e33',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131e33',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  switchTitle: {
    color: '#f8fafc',
    fontSize: 12.5,
    fontWeight: '700',
  },
  switchSubtitle: {
    color: '#94a3b8',
    fontSize: 10.5,
    marginTop: 2,
    lineHeight: 14,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#1e293b',
  },
  cancelBtnText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '700',
  },
});
