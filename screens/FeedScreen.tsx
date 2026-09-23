import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Post, PostCategory, Author } from '../types';
import { CorridorBanner } from '../components/CorridorBanner';
import { NeedCalloutBanner } from '../components/NeedCalloutBanner';
import { PostCard } from '../components/PostCard';

interface FeedScreenProps {
  posts: Post[];
  onScheduleMeeting: (post: Post) => void;
  onPostRFQ: () => void;
  onOpenCreatePost: () => void;
  onLikeToggle: (postId: string) => void;
  currentAuthor: Author;
  corridorFilterActive: boolean;
  onToggleCorridorFilter: () => void;
}

const FILTER_PILLS: { key: PostCategory; label: string }[] = [
  { key: 'ALL', label: 'All Updates' },
  { key: 'INJP', label: 'INJP Corridor' },
  { key: 'REQUIREMENTS', label: 'Requirements' },
  { key: 'INNOVATIONS', label: 'Innovations' },
  { key: 'ALERTS', label: 'Supply Alerts' },
  { key: 'MACHINERY', label: 'Machinery' },
  { key: 'SUSTAINABLE', label: 'Sustainable' },
];

export const FeedScreen: React.FC<FeedScreenProps> = ({
  posts,
  onScheduleMeeting,
  onPostRFQ,
  onOpenCreatePost,
  onLikeToggle,
  corridorFilterActive,
  onToggleCorridorFilter,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('ALL');
  const [activeVideoModal, setActiveVideoModal] = useState<Post | null>(null);

  const filteredPosts = posts.filter((p) => {
    if (corridorFilterActive) {
      if (!p.corridorBadge && p.category !== 'INJP') return false;
    }
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'INJP') return !!p.corridorBadge;
    return p.category === selectedCategory;
  });

  return (
    <View style={styles.screenContainer}>
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* India-Japan Bilateral Corridor Banner */}
            <CorridorBanner
              onExplore={onToggleCorridorFilter}
              isCorridorActive={corridorFilterActive}
            />

            {/* Need Callout Banner */}
            <NeedCalloutBanner onPostRFQ={onPostRFQ} />

            {/* Filter Pills Scroll (Horizontal) */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              {FILTER_PILLS.map((pill) => {
                const isActive = selectedCategory === pill.key;
                return (
                  <TouchableOpacity
                    key={pill.key}
                    style={[styles.filterPill, isActive && styles.filterPillActive]}
                    onPress={() => setSelectedCategory(pill.key)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        isActive && styles.filterPillTextActive,
                      ]}
                    >
                      {pill.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Corridor Status Bar if Active */}
            {corridorFilterActive && (
              <View style={styles.activeFilterNotice}>
                <Ionicons name="filter" size={14} color="#f59e0b" />
                <Text style={styles.activeFilterNoticeText}>
                  Showing 🇮🇳🇯🇵 India-Japan Bilateral Initiative Updates
                </Text>
                <TouchableOpacity onPress={onToggleCorridorFilter}>
                  <Text style={styles.clearFilterText}>Clear</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onScheduleMeeting={onScheduleMeeting}
            onLikeToggle={onLikeToggle}
            onOpenVideoModal={(p) => setActiveVideoModal(p)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={44} color="#475569" />
            <Text style={styles.emptyTitle}>No Updates in this Category</Text>
            <Text style={styles.emptySubtitle}>
              Be the first manufacturer or supplier to share an update!
            </Text>
            <TouchableOpacity style={styles.emptyPostBtn} onPress={onOpenCreatePost}>
              <Text style={styles.emptyPostBtnText}>Share Update</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Floating Action Button (Matches Screenshot: [ ✏️ Share Update ]) */}
      <TouchableOpacity
        style={styles.floatingActionBtn}
        onPress={onOpenCreatePost}
        activeOpacity={0.85}
      >
        <Ionicons name="create" size={18} color="#ffffff" />
        <Text style={styles.fabText}>Share Update</Text>
      </TouchableOpacity>

      {/* Video Simulation Modal */}
      <Modal
        visible={!!activeVideoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveVideoModal(null)}
      >
        <View style={styles.videoModalOverlay}>
          <View style={styles.videoModalCard}>
            <View style={styles.videoModalHeader}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.videoModalTitle} numberOfLines={1}>
                  {activeVideoModal?.media?.title || 'Factory Video'}
                </Text>
                <Text style={styles.videoModalSub}>
                  {activeVideoModal?.author.companyName} • {activeVideoModal?.media?.viewCount}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setActiveVideoModal(null)}
                style={styles.closeVideoBtn}
              >
                <Ionicons name="close" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Video Simulated View */}
            <View style={styles.videoFrameContainer}>
              <Image
                source={{ uri: activeVideoModal?.media?.thumbnailUrl }}
                style={styles.simulatedVideoImg}
                contentFit="cover"
              />
              <View style={styles.videoControlsOverlay}>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveRedDot} />
                  <Text style={styles.liveText}>1080p HD FACTORY FEED</Text>
                </View>
                <View style={styles.centerPauseCircle}>
                  <Ionicons name="pause" size={32} color="#ffffff" />
                </View>
                <View style={styles.scrubberBar}>
                  <View style={styles.scrubberProgress} />
                  <Text style={styles.scrubberTime}>0:24 / {activeVideoModal?.media?.duration || '0:48'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.videoModalFooter}>
              <View style={{ flex: 1 }}>
                <Text style={styles.videoMetricLabel}>Spindle Telemetry:</Text>
                <Text style={styles.videoMetricVal}>12,000 RPM • Inconel 718 Feed 120 mm/min</Text>
              </View>
              <TouchableOpacity
                style={styles.scheduleFromVideoBtn}
                onPress={() => {
                  const p = activeVideoModal;
                  setActiveVideoModal(null);
                  if (p) onScheduleMeeting(p);
                }}
              >
                <Ionicons name="calendar-outline" size={14} color="#0f172a" />
                <Text style={styles.scheduleFromVideoBtnText}>Schedule Meeting (Spindle Tour)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#0a101d',
  },
  listContent: {
    paddingBottom: 90,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    marginBottom: 4,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#162238',
    borderWidth: 1,
    borderColor: '#26354f',
    marginRight: 6,
  },
  filterPillActive: {
    backgroundColor: '#2563eb',
    borderColor: '#38bdf8',
  },
  filterPillText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  activeFilterNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  activeFilterNoticeText: {
    color: '#f59e0b',
    fontSize: 11.5,
    fontWeight: '600',
    flex: 1,
    marginHorizontal: 6,
  },
  clearFilterText: {
    color: '#38bdf8',
    fontSize: 11.5,
    fontWeight: '700',
  },
  floatingActionBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  fabText: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySubtitle: {
    color: '#94a3b8',
    fontSize: 12.5,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  emptyPostBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  emptyPostBtnText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
  videoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  videoModalCard: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#0c1524',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    overflow: 'hidden',
  },
  videoModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  videoModalTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  videoModalSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 1,
  },
  closeVideoBtn: {
    padding: 6,
    backgroundColor: '#1e293b',
    borderRadius: 12,
  },
  videoFrameContainer: {
    width: '100%',
    height: 240,
    backgroundColor: '#000000',
    position: 'relative',
  },
  simulatedVideoImg: {
    width: '100%',
    height: '100%',
  },
  videoControlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
    padding: 12,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveRedDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#ef4444',
  },
  liveText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  centerPauseCircle: {
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(37, 99, 235, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrubberBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  scrubberProgress: {
    height: 4,
    backgroundColor: '#38bdf8',
    borderRadius: 2,
    flex: 1,
    marginRight: 10,
  },
  scrubberTime: {
    color: '#cbd5e1',
    fontSize: 10,
    fontWeight: '700',
  },
  videoModalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#101a2e',
  },
  videoMetricLabel: {
    color: '#94a3b8',
    fontSize: 10.5,
    fontWeight: '600',
  },
  videoMetricVal: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  scheduleFromVideoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scheduleFromVideoBtnText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '800',
  },
});
