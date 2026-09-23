import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RFQItem, CountryCode } from '../types';

interface PostRFQModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitRFQ: (newRFQ: Partial<RFQItem>) => void;
  userCountry: CountryCode;
}

export const PostRFQModal: React.FC<PostRFQModalProps> = ({
  visible,
  onClose,
  onSubmitRFQ,
  userCountry,
}) => {
  const [title, setTitle] = useState('');
  const [material, setMaterial] = useState('Inconel 718 Superalloy');
  const [quantity, setQuantity] = useState('1,000 units / batch');
  const [tolerance, setTolerance] = useState('±0.005 mm (5 microns)');
  const [budget, setBudget] = useState('$350 USD (₹29,500)');
  const [leadTime, setLeadTime] = useState('30 days');
  const [description, setDescription] = useState('');
  const [isSustainable, setIsSustainable] = useState(false);
  const [isBilateralCorridor, setIsBilateralCorridor] = useState(true);
  const [hasCadFile, setHasCadFile] = useState(true);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Required Field', 'Please enter a title for your manufacturing requirement.');
      return;
    }

    const newRFQ: Partial<RFQItem> = {
      title: title.trim(),
      buyerCompany: 'Your Company',
      buyerCountry: userCountry,
      buyerVerified: true,
      category: 'Precision Manufacturing',
      material: material.trim(),
      quantity: quantity.trim(),
      targetBudget: budget.trim(),
      tolerance: tolerance.trim(),
      leadTime: leadTime.trim(),
      cadFileAttached: hasCadFile,
      cadFileName: hasCadFile ? `${title.replace(/\s+/g, '_').slice(0, 20)}_3D.stp` : undefined,
      description: description.trim() || 'CMM inspection reports and Material Test Certs required.',
      tags: [material.split(' ')[0], 'PrecisionMachining', 'B2BRFQ'],
      bidsCount: 0,
      postedDate: 'Just now',
      status: 'OPEN',
      isSustainableRequest: isSustainable,
      isBilateralCorridor: isBilateralCorridor,
    };

    onSubmitRFQ(newRFQ);
    setTitle('');
    setDescription('');
    onClose();
    Alert.alert('RFQ Broadcasted! 🚀', 'Your requirement is now live on the Indusync AI Network. AI matching suppliers have been notified.');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="megaphone" size={17} color="#38bdf8" />
              </View>
              <Text style={styles.headerTitle}>Post Manufacturing RFQ</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Text style={styles.fieldLabel}>Part / Component Name & Purpose *</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. 5-Axis Turn-Mill Turbine Impellers"
              placeholderTextColor="#64748b"
            />

            {/* Material & Tolerance */}
            <View style={styles.dualRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Material Spec</Text>
                <TextInput
                  style={styles.textInput}
                  value={material}
                  onChangeText={setMaterial}
                  placeholder="e.g. Inconel 718"
                  placeholderTextColor="#64748b"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Required Tolerance</Text>
                <TextInput
                  style={styles.textInput}
                  value={tolerance}
                  onChangeText={setTolerance}
                  placeholder="e.g. ±0.005 mm"
                  placeholderTextColor="#64748b"
                />
              </View>
            </View>

            {/* Quantity & Budget */}
            <View style={styles.dualRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Target Batch Quantity</Text>
                <TextInput
                  style={styles.textInput}
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="e.g. 1,000 pcs"
                  placeholderTextColor="#64748b"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Target Unit Budget</Text>
                <TextInput
                  style={styles.textInput}
                  value={budget}
                  onChangeText={setBudget}
                  placeholder="e.g. $350 USD"
                  placeholderTextColor="#64748b"
                />
              </View>
            </View>

            {/* Lead Time */}
            <Text style={styles.fieldLabel}>Required Delivery Lead Time</Text>
            <TextInput
              style={styles.textInput}
              value={leadTime}
              onChangeText={setLeadTime}
              placeholder="e.g. 30 days first batch"
              placeholderTextColor="#64748b"
            />

            {/* Description */}
            <Text style={styles.fieldLabel}>Detailed Scope / Special Requirements</Text>
            <TextInput
              style={[styles.textInput, { height: 75, textAlignVertical: 'top' }]}
              value={description}
              onChangeText={setDescription}
              multiline
              placeholder="Mention heat treatment, surface passivation, ultrasonic testing, or export packing specs..."
              placeholderTextColor="#64748b"
            />

            {/* CAD Simulation Attachment */}
            <View style={styles.cadAttachmentCard}>
              <View style={styles.cadIconBox}>
                <Ionicons name="cube-outline" size={24} color="#38bdf8" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cadTitle}>Attach 3D CAD (.STEP / .IGES / .SLDPRT)</Text>
                <Text style={styles.cadSubtitle}>Enables instant AI feature & volume extraction</Text>
              </View>
              <Switch
                value={hasCadFile}
                onValueChange={setHasCadFile}
                trackColor={{ false: '#334155', true: '#2563eb' }}
                thumbColor={hasCadFile ? '#38bdf8' : '#94a3b8'}
              />
            </View>

            {/* Bilateral and Sustainable Toggles */}
            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleText}>Priority Match to India–Japan Corridor</Text>
                <Text style={styles.toggleSub}>Invite verified bilateral manufacturers & JETRO partners</Text>
              </View>
              <Switch
                value={isBilateralCorridor}
                onValueChange={setIsBilateralCorridor}
                trackColor={{ false: '#334155', true: '#f59e0b' }}
                thumbColor={isBilateralCorridor ? '#ffffff' : '#94a3b8'}
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleText}>Green / Sustainable Sourcing Priority</Text>
                <Text style={styles.toggleSub}>Prefer suppliers with solar/recycled material LCA audits</Text>
              </View>
              <Switch
                value={isSustainable}
                onValueChange={setIsSustainable}
                trackColor={{ false: '#334155', true: '#10b981' }}
                thumbColor={isSustainable ? '#ffffff' : '#94a3b8'}
              />
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Ionicons name="flash-outline" size={17} color="#ffffff" />
              <Text style={styles.submitBtnText}>Broadcast RFQ</Text>
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
    maxHeight: '92%',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#1e293b',
    borderRadius: 14,
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  fieldLabel: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
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
  dualRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cadAttachmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#131e33',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2563eb',
    marginTop: 12,
    marginBottom: 10,
  },
  cadIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cadTitle: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
  cadSubtitle: {
    color: '#94a3b8',
    fontSize: 10.5,
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131e33',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginTop: 8,
  },
  toggleText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700',
  },
  toggleSub: {
    color: '#94a3b8',
    fontSize: 10.5,
    marginTop: 2,
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
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#1e293b',
  },
  cancelBtnText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  submitBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '700',
  },
});
