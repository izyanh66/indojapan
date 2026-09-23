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
import { Post, PostCategory, Author } from '../types';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitPost: (newPost: Partial<Post>) => void;
  currentAuthor: Author;
}

const CATEGORIES: { key: PostCategory; label: string; icon: any }[] = [
  { key: 'INNOVATIONS', label: 'Innovation', icon: 'bulb-outline' },
  { key: 'REQUIREMENTS', label: 'Requirement', icon: 'clipboard-outline' },
  { key: 'MACHINERY', label: 'Spare Capacity', icon: 'cog-outline' },
  { key: 'SUSTAINABLE', label: 'Sustainable Alert', icon: 'leaf-outline' },
  { key: 'ALERTS', label: 'Supply Alert', icon: 'warning-outline' },
];

const SAMPLE_MEDIA = [
  {
    title: '5-Axis Turn-Mill Live Machining Demo',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    type: 'video' as const,
    duration: '0:52',
  },
  {
    title: 'High-Precision Zeiss CMM Automated Metrology',
    thumbnail: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    type: 'video' as const,
    duration: '1:14',
  },
  {
    title: 'Solar Extruded Al-6061 Billets Batch',
    thumbnail: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
    type: 'photo' as const,
  },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  visible,
  onClose,
  onSubmitPost,
  currentAuthor,
}) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('INNOVATIONS');
  const [isCorridorTagged, setIsCorridorTagged] = useState(true);
  const [enableMeeting, setEnableMeeting] = useState(true);
  const [metricLabel, setMetricLabel] = useState('Cycle Time Reduction');
  const [metricValue, setMetricValue] = useState('-22% Optimization');
  const [hashtags, setHashtags] = useState('#5AxisCNC #IndoJapanManufacturing #PrecisionEngineering');
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(0);

  const handleSubmit = () => {
    if (!content.trim()) {
      Alert.alert('Required Content', 'Please provide manufacturing update details or requirement specs.');
      return;
    }

    const selectedMedia = selectedMediaIndex !== null ? SAMPLE_MEDIA[selectedMediaIndex] : null;

    const newPost: Partial<Post> = {
      author: currentAuthor,
      category,
      categoryLabel: CATEGORIES.find((c) => c.key === category)?.label.toUpperCase() || 'UPDATE',
      corridorBadge: isCorridorTagged ? 'IN JP India–Japan Bilateral Manufacturing Initiative' : undefined,
      content: content.trim(),
      timestamp: 'Just now',
      media: selectedMedia
        ? {
            type: selectedMedia.type,
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnailUrl: selectedMedia.thumbnail,
            title: selectedMedia.title,
            duration: selectedMedia.duration || '0:45',
            resolution: '1080p HD',
            viewCount: '1 view',
          }
        : undefined,
      metrics: metricLabel.trim() && metricValue.trim()
        ? {
            label: metricLabel.trim(),
            value: metricValue.trim(),
            isPositive: true,
          }
        : undefined,
      hashtags: hashtags
        .split(' ')
        .filter((h) => h.startsWith('#')),
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: true,
      hasMeetingOption: enableMeeting,
      meetingAvailability: enableMeeting ? 'Bilateral Consultation Slots Open' : undefined,
    };

    onSubmitPost(newPost);
    setContent('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.penIconCircle}>
                <Ionicons name="create" size={16} color="#38bdf8" />
              </View>
              <Text style={styles.headerTitle}>Share Industry Update / Post</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Category Selector */}
            <Text style={styles.fieldLabel}>Post Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CATEGORIES.map((c) => (
                <TouchableOpacity
                  key={c.key}
                  style={[styles.catChip, category === c.key && styles.catChipActive]}
                  onPress={() => setCategory(c.key)}
                >
                  <Ionicons
                    name={c.icon}
                    size={13}
                    color={category === c.key ? '#ffffff' : '#94a3b8'}
                  />
                  <Text style={[styles.catChipText, category === c.key && styles.catChipTextActive]}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Content Input */}
            <Text style={styles.fieldLabel}>Technical Update / Requirement Details</Text>
            <TextInput
              style={styles.contentInput}
              value={content}
              onChangeText={setContent}
              multiline
              placeholder="Describe machinery commissioning, spare machine-hours, materials needed, tolerance specs, or technology collaboration..."
              placeholderTextColor="#64748b"
            />

            {/* Media Attachment Selector */}
            <Text style={styles.fieldLabel}>Attach Photos & Videos</Text>
            <View style={styles.photoVideoActionRow}>
              <TouchableOpacity
                style={styles.attachMediaBtn}
                onPress={() => {
                  setSelectedMediaIndex(0);
                  Alert.alert('Video Attached 📹', 'Attached 1080p HD live factory spindle machining demo video.');
                }}
              >
                <Ionicons name="videocam" size={15} color="#38bdf8" />
                <Text style={styles.attachMediaBtnText}>Add Factory Video</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.attachMediaBtn}
                onPress={() => {
                  setSelectedMediaIndex(2);
                  Alert.alert('Photo Attached 📷', 'Attached high-res factory floor inspection photo.');
                }}
              >
                <Ionicons name="camera" size={15} color="#10b981" />
                <Text style={styles.attachMediaBtnText}>Add Plant Photo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.mediaPickerRow}>
              {SAMPLE_MEDIA.map((m, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.mediaOptionItem,
                    selectedMediaIndex === idx && styles.mediaOptionActive,
                  ]}
                  onPress={() => setSelectedMediaIndex(selectedMediaIndex === idx ? null : idx)}
                >
                  <View style={styles.mediaItemContent}>
                    <Ionicons
                      name={m.type === 'video' ? 'videocam' : 'image'}
                      size={14}
                      color={selectedMediaIndex === idx ? '#38bdf8' : '#94a3b8'}
                    />
                    <Text
                      style={[
                        styles.mediaOptionTitle,
                        selectedMediaIndex === idx && styles.mediaTitleActive,
                      ]}
                      numberOfLines={1}
                    >
                      {m.title} {m.type === 'video' ? '(Video • ' + m.duration + ')' : '(Photo)'}
                    </Text>
                  </View>
                  {selectedMediaIndex === idx && (
                    <Ionicons name="checkmark-circle" size={14} color="#38bdf8" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Metric Highlight Fields */}
            <Text style={styles.fieldLabel}>Key Performance Metric (Optional)</Text>
            <View style={styles.metricInputRow}>
              <TextInput
                style={[styles.smallInput, { flex: 1.4 }]}
                value={metricLabel}
                onChangeText={setMetricLabel}
                placeholder="Metric (e.g. Cycle Time)"
                placeholderTextColor="#64748b"
              />
              <TextInput
                style={[styles.smallInput, { flex: 1 }]}
                value={metricValue}
                onChangeText={setMetricValue}
                placeholder="Value (e.g. -22%)"
                placeholderTextColor="#64748b"
              />
            </View>

            {/* Hashtags */}
            <Text style={styles.fieldLabel}>Industry Hashtags</Text>
            <TextInput
              style={styles.textInput}
              value={hashtags}
              onChangeText={setHashtags}
              placeholder="#5AxisCNC #Aerospace #IndiaJapan"
              placeholderTextColor="#64748b"
            />

            {/* Toggles */}
            <View style={styles.toggleItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>🇮🇳🇯🇵 India–Japan Bilateral Tag</Text>
                <Text style={styles.toggleDesc}>Highlight post to Japanese & Indian trade partners</Text>
              </View>
              <Switch
                value={isCorridorTagged}
                onValueChange={setIsCorridorTagged}
                trackColor={{ false: '#334155', true: '#f59e0b' }}
                thumbColor={isCorridorTagged ? '#ffffff' : '#94a3b8'}
              />
            </View>

            <View style={styles.toggleItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>📅 Enable B2B Meeting Scheduling</Text>
                <Text style={styles.toggleDesc}>Allows verified partners to schedule meetings directly</Text>
              </View>
              <Switch
                value={enableMeeting}
                onValueChange={setEnableMeeting}
                trackColor={{ false: '#334155', true: '#2563eb' }}
                thumbColor={enableMeeting ? '#38bdf8' : '#94a3b8'}
              />
            </View>
          </ScrollView>

          {/* Footer Submit */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Discard</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Ionicons name="send" size={16} color="#ffffff" />
              <Text style={styles.submitBtnText}>Post Update</Text>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  penIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
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
    marginTop: 10,
    marginBottom: 6,
  },
  categoryScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    marginRight: 8,
  },
  catChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#38bdf8',
  },
  catChipText: {
    color: '#94a3b8',
    fontSize: 11.5,
    fontWeight: '600',
  },
  catChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  contentInput: {
    backgroundColor: '#131e33',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#ffffff',
    padding: 12,
    fontSize: 13.5,
    minHeight: 90,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  photoVideoActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  attachMediaBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#162238',
    borderWidth: 1,
    borderColor: '#26354f',
    paddingVertical: 8,
    borderRadius: 8,
  },
  attachMediaBtnText: {
    color: '#e2e8f0',
    fontSize: 11.5,
    fontWeight: '600',
  },
  mediaPickerRow: {
    gap: 6,
    marginBottom: 12,
  },
  mediaOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#131e33',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 10,
  },
  mediaOptionActive: {
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  mediaItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  mediaOptionTitle: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  mediaTitleActive: {
    color: '#ffffff',
  },
  metricInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  smallInput: {
    backgroundColor: '#131e33',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
  },
  textInput: {
    backgroundColor: '#131e33',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 12.5,
    marginBottom: 12,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131e33',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 10,
  },
  toggleTitle: {
    color: '#f8fafc',
    fontSize: 12.5,
    fontWeight: '700',
  },
  toggleDesc: {
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
