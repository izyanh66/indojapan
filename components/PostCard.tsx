import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Share,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onScheduleMeeting: (post: Post) => void;
  onLikeToggle: (postId: string) => void;
  onOpenVideoModal?: (post: Post) => void;
  onInquireSupplier?: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onScheduleMeeting,
  onLikeToggle,
  onOpenVideoModal,
  onInquireSupplier,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState([
    {
      id: 'c-1',
      author: 'Akira Morita (DMG MORI Japan)',
      time: '28m ago',
      text: 'Congratulations Rajesh-san! The NTX 2000 precision on Inconel will definitely benefit aerospace tier-1 programs in Nagoya.',
    },
    {
      id: 'c-2',
      author: 'Vikram Joshi (HAL Bangalore)',
      time: '15m ago',
      text: 'Sending RFQ for 240 turbine shroud impellers. Please check your Indusync B2B inbox.',
    },
  ]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${post.author.name} (${post.author.companyName}) on Indusync AI: ${post.content.slice(0, 140)}...`,
        title: post.author.companyName,
      });
    } catch {
      // Ignored
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setCommentsList([
      ...commentsList,
      {
        id: `c-${Date.now()}`,
        author: 'You (Industrial Partner)',
        time: 'Just now',
        text: commentText.trim(),
      },
    ]);
    setCommentText('');
  };

  return (
    <View style={styles.cardContainer}>
      {/* Author Header */}
      <View style={styles.authorRow}>
        <View style={styles.authorLeft}>
          <Image source={{ uri: post.author.avatar }} style={styles.avatarImage} />
          <View style={styles.authorMeta}>
            <View style={styles.nameLine}>
              <Text style={styles.authorName}>{post.author.name}</Text>
              <View style={styles.countryTag}>
                <Text style={styles.countryTagText}>{post.author.country}</Text>
              </View>
              {post.author.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={15} color="#10b981" />
                </View>
              )}
            </View>
            <Text style={styles.companyName}>
              {post.author.companyName} • <Text style={styles.timestamp}>{post.timestamp}</Text>
            </Text>
          </View>
        </View>

        {/* Category Pill Badge (e.g. INNOVATION in image) */}
        <View style={styles.categoryPill}>
          <Text style={styles.categoryPillText}>{post.categoryLabel}</Text>
        </View>
      </View>

      {/* Corridor Banner sub-tag */}
      {post.corridorBadge && (
        <View style={styles.corridorTagContainer}>
          <View style={styles.corridorCodeBox}>
            <Text style={styles.corridorCodeText}>IN JP</Text>
          </View>
          <Text style={styles.corridorBadgeText} numberOfLines={1}>
            {post.corridorBadge}
          </Text>
        </View>
      )}

      {/* Post Text Body */}
      <Text style={styles.contentBody}>{post.content}</Text>

      {/* Media Player Container (Video / Photo) */}
      {post.media && (
        <TouchableOpacity
          style={styles.mediaContainer}
          activeOpacity={0.9}
          onPress={() => onOpenVideoModal && onOpenVideoModal(post)}
        >
          <Image
            source={{ uri: post.media.thumbnailUrl }}
            style={styles.mediaThumbnail}
            contentFit="cover"
          />

          {/* Top Resolution Badge (1080p HD) */}
          {post.media.resolution && (
            <View style={styles.resolutionBadge}>
              <Text style={styles.resolutionBadgeText}>{post.media.resolution}</Text>
            </View>
          )}

          {/* Video Play Button Overlay */}
          {post.media.type === 'video' && (
            <View style={styles.playOverlay}>
              <View style={styles.playCircle}>
                <Ionicons name="play" size={26} color="#ffffff" style={{ marginLeft: 3 }} />
              </View>
            </View>
          )}

          {/* Duration Badge Bottom Right */}
          {post.media.duration && (
            <View style={styles.durationBadge}>
              <Ionicons name="time-outline" size={11} color="#ffffff" />
              <Text style={styles.durationText}>{post.media.duration}</Text>
            </View>
          )}

          {/* Bottom Video Meta Bar */}
          <View style={styles.mediaBottomBar}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.mediaTitle} numberOfLines={1}>
                {post.media.title}
              </Text>
              <Text style={styles.mediaViews}>{post.media.viewCount}</Text>
            </View>
            <View style={styles.playVideoLink}>
              <Ionicons name="play" size={13} color="#38bdf8" />
              <Text style={styles.playVideoLinkText}>playVideo</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Key Metric Highlight Row (e.g. -28.4% Efficiency Boost) */}
      {post.metrics && (
        <View style={styles.metricRowContainer}>
          <View style={styles.metricLeft}>
            <Ionicons name="trending-down-outline" size={16} color="#38bdf8" />
            <Text style={styles.metricLabel}>{post.metrics.label}</Text>
          </View>
          <Text
            style={[
              styles.metricValue,
              { color: post.metrics.isPositive ? '#10b981' : '#ef4444' },
            ]}
          >
            {post.metrics.value}
          </Text>
        </View>
      )}

      {/* Hashtags */}
      {post.hashtags.length > 0 && (
        <View style={styles.hashtagsRow}>
          {post.hashtags.map((tag, idx) => (
            <Text key={idx} style={styles.hashtagText}>
              {tag}{' '}
            </Text>
          ))}
        </View>
      )}

      {/* Interaction Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onLikeToggle(post.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={post.isLiked ? 'thumbs-up' : 'thumbs-up-outline'}
            size={18}
            color={post.isLiked ? '#3b82f6' : '#94a3b8'}
          />
          <Text style={[styles.actionBtnCount, post.isLiked && styles.activeActionText]}>
            {post.likesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setShowComments(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="chatbubble-outline" size={17} color="#94a3b8" />
          <Text style={styles.actionBtnCount}>{commentsList.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={handleShare} activeOpacity={0.7}>
          <Ionicons name="share-social-outline" size={18} color="#94a3b8" />
          <Text style={styles.actionBtnCount}>{post.sharesCount}</Text>
        </TouchableOpacity>

        {/* Schedule Meeting Button (Direct CTA requested) */}
        {post.hasMeetingOption && (
          <TouchableOpacity
            style={styles.scheduleMeetingBtn}
            onPress={() => onScheduleMeeting(post)}
            activeOpacity={0.8}
          >
            <Ionicons name="calendar-outline" size={14} color="#f59e0b" />
            <Text style={styles.scheduleMeetingBtnText}>Schedule Meeting</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Comments Bottom Sheet / Modal */}
      <Modal
        visible={showComments}
        transparent
        animationType="slide"
        onRequestClose={() => setShowComments(false)}
      >
        <TouchableOpacity
          style={styles.commentsOverlay}
          activeOpacity={1}
          onPress={() => setShowComments(false)}
        >
          <View style={styles.commentsSheet} onStartShouldSetResponder={() => true}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Technical Discussion ({commentsList.length})</Text>
              <TouchableOpacity onPress={() => setShowComments(false)}>
                <Ionicons name="close" size={22} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <View style={styles.commentsList}>
              {commentsList.map((c) => (
                <View key={c.id} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>{c.author}</Text>
                    <Text style={styles.commentTime}>{c.time}</Text>
                  </View>
                  <Text style={styles.commentBody}>{c.text}</Text>
                </View>
              ))}
            </View>

            <View style={styles.commentInputRow}>
              <TouchableOpacity style={styles.scheduleInCommentBtn} onPress={() => {
                setShowComments(false);
                onScheduleMeeting(post);
              }}>
                <Ionicons name="calendar" size={15} color="#f59e0b" />
                <Text style={styles.scheduleInCommentText}>Schedule Meeting with {post.author.name.split(' ')[0]}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#101a2e',
    borderWidth: 1,
    borderColor: '#1e2d4a',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  authorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#2563eb',
    backgroundColor: '#1e293b',
  },
  authorMeta: {
    flex: 1,
  },
  nameLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    color: '#ffffff',
    fontSize: 14.5,
    fontWeight: '700',
  },
  countryTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  countryTagText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '800',
  },
  verifiedBadge: {
    marginLeft: 2,
  },
  companyName: {
    color: '#38bdf8',
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 2,
  },
  timestamp: {
    color: '#94a3b8',
    fontWeight: '400',
  },
  categoryPill: {
    backgroundColor: 'rgba(2, 132, 199, 0.15)',
    borderWidth: 1,
    borderColor: '#0284c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  categoryPillText: {
    color: '#38bdf8',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  corridorTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
  },
  corridorCodeBox: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  corridorCodeText: {
    color: '#0f172a',
    fontSize: 9.5,
    fontWeight: '900',
  },
  corridorBadgeText: {
    color: '#f59e0b',
    fontSize: 11.5,
    fontWeight: '600',
    flex: 1,
  },
  contentBody: {
    color: '#f1f5f9',
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: 12,
  },
  mediaContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#090f1d',
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 12,
    position: 'relative',
  },
  mediaThumbnail: {
    width: '100%',
    height: 190,
  },
  resolutionBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  resolutionBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    bottom: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 50,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  durationText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  mediaBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0c1629',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  mediaTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  mediaViews: {
    color: '#94a3b8',
    fontSize: 10.5,
    marginTop: 1,
  },
  playVideoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  playVideoLinkText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
  },
  metricRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0c1629',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 10,
  },
  metricLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  hashtagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 14,
  },
  hashtagText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '600',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  actionBtnCount: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  activeActionText: {
    color: '#3b82f6',
  },
  scheduleMeetingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scheduleMeetingBtnText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '700',
  },
  commentsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  commentsSheet: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 18,
    maxHeight: '75%',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#475569',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sheetTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  commentsList: {
    gap: 12,
    marginBottom: 16,
  },
  commentItem: {
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
  },
  commentTime: {
    color: '#64748b',
    fontSize: 10.5,
  },
  commentBody: {
    color: '#e2e8f0',
    fontSize: 12.5,
    lineHeight: 18,
  },
  commentInputRow: {
    gap: 10,
  },
  scheduleInCommentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: '#f59e0b',
    paddingVertical: 10,
    borderRadius: 8,
  },
  scheduleInCommentText: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '700',
  },
});
