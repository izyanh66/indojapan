import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface CorridorBannerProps {
  onExplore: () => void;
  isCorridorActive?: boolean;
}

export const CorridorBanner: React.FC<CorridorBannerProps> = ({
  onExplore,
  isCorridorActive = false,
}) => {
  return (
    <View style={styles.corridorContainer}>
      <View style={styles.leftRow}>
        <View style={styles.flagBadges}>
          <View style={styles.flagChip}>
            <Text style={styles.flagEmoji}>🇮🇳</Text>
            <Text style={styles.flagCode}>IN</Text>
          </View>
          <Ionicons name="swap-horizontal" size={13} color="#f59e0b" style={{ marginHorizontal: 2 }} />
          <View style={styles.flagChip}>
            <Text style={styles.flagEmoji}>🇯🇵</Text>
            <Text style={styles.flagCode}>JP</Text>
          </View>
        </View>

        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.corridorTitle}>India–Japan Bilateral Corridor</Text>
            <View style={styles.statusDot} />
          </View>
          <Text style={styles.corridorSubtitle} numberOfLines={1}>
            Tap to focus on IN-JP partnerships, 5-axis tooling & trade
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.exploreBtn, isCorridorActive && styles.exploreBtnActive]}
        onPress={onExplore}
        activeOpacity={0.8}
      >
        <Text style={[styles.exploreBtnText, isCorridorActive && styles.exploreBtnTextActive]}>
          {isCorridorActive ? 'ACTIVE' : 'EXPLORE'}
        </Text>
        <Ionicons
          name={isCorridorActive ? 'checkmark' : 'arrow-forward'}
          size={12}
          color={isCorridorActive ? '#ffffff' : '#f59e0b'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  corridorContainer: {
    backgroundColor: '#101a2d',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  flagBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  flagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  flagEmoji: {
    fontSize: 12,
  },
  flagCode: {
    color: '#cbd5e1',
    fontSize: 10,
    fontWeight: '800',
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  corridorTitle: {
    color: '#f8fafc',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
  corridorSubtitle: {
    color: '#94a3b8',
    fontSize: 10.5,
    marginTop: 1,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.5)',
  },
  exploreBtnActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  exploreBtnText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  exploreBtnTextActive: {
    color: '#0f172a',
  },
});
