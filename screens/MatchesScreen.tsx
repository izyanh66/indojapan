import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { OpportunityItem, MeetingBooking } from '../types';

interface MatchesScreenProps {
  opportunities: OpportunityItem[];
  scheduledMeetings: MeetingBooking[];
  onOpenMeetingDetails: (mtg: MeetingBooking) => void;
  onExploreCorridor: () => void;
}

export const MatchesScreen: React.FC<MatchesScreenProps> = ({
  opportunities,
  scheduledMeetings,
  onOpenMeetingDetails,
  onExploreCorridor,
}) => {
  const [activeTab, setActiveTab] = useState<'MATCHES' | 'MEETINGS'>('MATCHES');

  const handleAction = (item: OpportunityItem) => {
    Alert.alert(
      item.actionLabel,
      `Connecting you to ${item.company} for "${item.title}".\nAI Match Score: ${item.matchScore}% affinity.`
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Toggle */}
      <View style={styles.tabsBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'MATCHES' && styles.tabItemActive]}
          onPress={() => setActiveTab('MATCHES')}
        >
          <Ionicons
            name="flash-outline"
            size={15}
            color={activeTab === 'MATCHES' ? '#38bdf8' : '#94a3b8'}
          />
          <Text style={[styles.tabText, activeTab === 'MATCHES' && styles.tabTextActive]}>
            AI Opportunities ({opportunities.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'MEETINGS' && styles.tabItemActive]}
          onPress={() => setActiveTab('MEETINGS')}
        >
          <Ionicons
            name="calendar"
            size={15}
            color={activeTab === 'MEETINGS' ? '#f59e0b' : '#94a3b8'}
          />
          <Text style={[styles.tabText, activeTab === 'MEETINGS' && styles.tabTextActive]}>
            Scheduled Meetings ({scheduledMeetings.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {activeTab === 'MATCHES' ? (
        <FlatList
          data={opportunities}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.corridorCallout}>
              <View style={styles.corridorCalloutLeft}>
                <Text style={styles.corridorFlagRow}>🇮🇳 🇯🇵</Text>
                <View>
                  <Text style={styles.corridorCalloutTitle}>Bilateral Match Engine Active</Text>
                  <Text style={styles.corridorCalloutSub}>
                    Matching Pune/Bengaluru manufacturers with Tokyo/Nagoya OEMs
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.corridorExploreBtn} onPress={onExploreCorridor}>
                <Text style={styles.corridorExploreBtnText}>Explore</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.oppCard}>
              <View style={styles.oppTop}>
                <View style={styles.oppTypeBadge}>
                  <Text style={styles.oppTypeBadgeText}>
                    {item.type.replace('_', ' ')}
                  </Text>
                </View>
                <View style={styles.matchScoreBadge}>
                  <Ionicons name="sparkles" size={11} color="#f59e0b" />
                  <Text style={styles.matchScoreText}>{item.matchScore}% Match</Text>
                </View>
              </View>

              <Text style={styles.oppTitle}>{item.title}</Text>
              <Text style={styles.oppCompany}>
                {item.company} ({item.country === 'IN' ? 'India 🇮🇳' : 'Japan 🇯🇵'}) • {item.timeAgo}
              </Text>
              <Text style={styles.oppDesc}>{item.description}</Text>

              <View style={styles.tagsFlex}>
                {item.tags.map((tag, idx) => (
                  <View key={idx} style={styles.tagChip}>
                    <Text style={styles.tagChipText}>#{tag}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleAction(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.actionBtnText}>{item.actionLabel}</Text>
                <Ionicons name="arrow-forward" size={14} color="#ffffff" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={scheduledMeetings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyMeetings}>
              <Ionicons name="calendar-outline" size={48} color="#475569" />
              <Text style={styles.emptyTitle}>No Meetings Scheduled Yet</Text>
              <Text style={styles.emptySub}>
                Tap &ldquo;Schedule Meeting&rdquo; on any feed post or supplier profile to arrange a virtual factory tour.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.meetingCard}
              activeOpacity={0.85}
              onPress={() => onOpenMeetingDetails(item)}
            >
              <View style={styles.meetingTop}>
                <View style={styles.meetingTypePill}>
                  <Text style={styles.meetingTypePillText}>{item.meetingType.replace(/_/g, ' ')}</Text>
                </View>
                <View style={styles.meetingConfirmedBadge}>
                  <Ionicons name="checkmark-circle" size={13} color="#10b981" />
                  <Text style={styles.meetingConfirmedText}>{item.status}</Text>
                </View>
              </View>

              <Text style={styles.meetingTopicTitle}>{item.topic}</Text>

              {/* Dual Timezones Box */}
              <View style={styles.dualTzCard}>
                <View style={styles.tzSide}>
                  <Text style={styles.tzCountry}>🇮🇳 India (IST)</Text>
                  <Text style={styles.tzClock}>{item.timeIST}</Text>
                </View>
                <Ionicons name="arrow-forward" size={15} color="#f59e0b" />
                <View style={styles.tzSide}>
                  <Text style={styles.tzCountry}>🇯🇵 Japan (JST)</Text>
                  <Text style={styles.tzClock}>{item.timeJST}</Text>
                </View>
              </View>

              <Text style={styles.meetingHost}>
                Host: <Text style={{ color: '#ffffff', fontWeight: '700' }}>{item.hostName}</Text> ({item.hostCompany})
              </Text>
              <Text style={styles.meetingGuest}>
                Guest: {item.guestName} ({item.guestCompany})
              </Text>

              {item.ndaRequired && (
                <View style={styles.ndaShield}>
                  <Ionicons name="shield-checkmark" size={12} color="#10b981" />
                  <Text style={styles.ndaShieldText}>Mutual Bilateral NDA Auto-Secured</Text>
                </View>
              )}

              <View style={styles.meetingActionsRow}>
                <TouchableOpacity
                  style={styles.joinVideoBtn}
                  onPress={() =>
                    Alert.alert(
                      'Joining Encrypted B2B Video 📹',
                      `Connecting to Indusync Secure Video Room for ${item.topic}.\nHost: ${item.hostName}`
                    )
                  }
                >
                  <Ionicons name="videocam" size={14} color="#ffffff" />
                  <Text style={styles.joinVideoBtnText}>Join Video Room</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a101d',
  },
  tabsBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#121f36',
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e2d4a',
  },
  tabItemActive: {
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 90,
    gap: 12,
  },
  corridorCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#131e33',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: 4,
  },
  corridorCalloutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  corridorFlagRow: {
    fontSize: 20,
  },
  corridorCalloutTitle: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
  corridorCalloutSub: {
    color: '#94a3b8',
    fontSize: 10.5,
    marginTop: 1,
  },
  corridorExploreBtn: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  corridorExploreBtnText: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '800',
  },
  oppCard: {
    backgroundColor: '#101a2e',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e2d4a',
    padding: 14,
  },
  oppTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  oppTypeBadge: {
    backgroundColor: '#182740',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  oppTypeBadgeText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '800',
  },
  matchScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  matchScoreText: {
    color: '#f59e0b',
    fontSize: 10.5,
    fontWeight: '800',
  },
  oppTitle: {
    color: '#ffffff',
    fontSize: 14.5,
    fontWeight: '700',
    marginBottom: 3,
  },
  oppCompany: {
    color: '#94a3b8',
    fontSize: 11.5,
    marginBottom: 8,
  },
  oppDesc: {
    color: '#cbd5e1',
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 10,
  },
  tagsFlex: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 12,
  },
  tagChip: {
    backgroundColor: '#131e33',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tagChipText: {
    color: '#38bdf8',
    fontSize: 11,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
  meetingCard: {
    backgroundColor: '#101a2e',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e2d4a',
    padding: 14,
  },
  meetingTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  meetingTypePill: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  meetingTypePillText: {
    color: '#f59e0b',
    fontSize: 10,
    fontWeight: '800',
  },
  meetingConfirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  meetingConfirmedText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '700',
  },
  meetingTopicTitle: {
    color: '#ffffff',
    fontSize: 14.5,
    fontWeight: '700',
    marginBottom: 10,
  },
  dualTzCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0c1524',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 10,
  },
  tzSide: {
    flex: 1,
  },
  tzCountry: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  tzClock: {
    color: '#38bdf8',
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 2,
  },
  meetingHost: {
    color: '#cbd5e1',
    fontSize: 12,
    marginBottom: 3,
  },
  meetingGuest: {
    color: '#94a3b8',
    fontSize: 11.5,
    marginBottom: 8,
  },
  ndaShield: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  ndaShieldText: {
    color: '#10b981',
    fontSize: 10.5,
    fontWeight: '600',
  },
  meetingActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  joinVideoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    borderRadius: 8,
  },
  joinVideoBtnText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
  emptyMeetings: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySub: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 17,
  },
});
