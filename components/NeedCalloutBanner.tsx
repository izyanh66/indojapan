import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface NeedCalloutBannerProps {
  onPostRFQ: () => void;
}

export const NeedCalloutBanner: React.FC<NeedCalloutBannerProps> = ({ onPostRFQ }) => {
  return (
    <View style={styles.bannerContainer}>
      <View style={styles.leftGroup}>
        <View style={styles.iconCircle}>
          <Ionicons name="megaphone" size={18} color="#ffffff" />
        </View>
        <View style={styles.textColumn}>
          <Text style={styles.headline}>Have a Manufacturing Need?</Text>
          <Text style={styles.subheadline}>
            Post RFQ with 3D CAD to get instant AI-matched supplier bids
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.postBtn} onPress={onPostRFQ} activeOpacity={0.8}>
        <Ionicons name="add" size={16} color="#ffffff" />
        <Text style={styles.postBtnText}>Post RFQ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#12233f',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
  },
  headline: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '700',
  },
  subheadline: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  postBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
