import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  Post,
  RFQItem,
  BusinessEntity,
  MeetingBooking,
  UserRole,
  CountryCode,
  OpportunityItem,
} from './types';
import {
  INITIAL_POSTS,
  INITIAL_RFQS,
  INITIAL_BUSINESSES,
  INITIAL_OPPORTUNITIES,
  INITIAL_MARKET_INSIGHTS,
} from './data/mockData';

import { Header } from './components/Header';
import { ScheduleMeetingModal } from './components/ScheduleMeetingModal';
import { CreatePostModal } from './components/CreatePostModal';
import { PostRFQModal } from './components/PostRFQModal';
import { AIAssistantModal } from './components/AIAssistantModal';

import { FeedScreen } from './screens/FeedScreen';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { RFQScreen } from './screens/RFQScreen';
import { MatchesScreen } from './screens/MatchesScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { ProfileScreen } from './screens/ProfileScreen';

type TabKey = 'FEED' | 'DISCOVER' | 'RFQS' | 'MATCHES' | 'INSIGHTS' | 'PROFILE';

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  // App Navigation State
  const [activeTab, setActiveTab] = useState<TabKey>('FEED');

  // Role and Language
  const [activeRole, setActiveRole] = useState<UserRole>('MANUFACTURER');
  const [currentLanguage, setCurrentLanguage] = useState<'EN' | 'JA' | 'HI'>('EN');

  // Corridors & Filters
  const [corridorFilterActive, setCorridorFilterActive] = useState(false);

  // Core Data
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [rfqs, setRfqs] = useState<RFQItem[]>(INITIAL_RFQS);
  const [businesses, setBusinesses] = useState<BusinessEntity[]>(INITIAL_BUSINESSES);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(INITIAL_OPPORTUNITIES);
  const [scheduledMeetings, setScheduledMeetings] = useState<MeetingBooking[]>([
    {
      id: 'mtg-sample-1',
      hostId: 'usr-1',
      hostName: 'Rajesh Sharma',
      hostCompany: 'Bharat Precision Mechatronics',
      hostCountry: 'IN',
      guestName: 'Kenji Takahashi',
      guestCompany: 'Nagoya Precision Robotics K.K.',
      guestEmail: 'takahashi@nagoya-robotics.co.jp',
      guestCountry: 'JP',
      date: 'Sep 24, 2026',
      timeSlot: '02:00 PM IST',
      timeIST: '02:00 PM IST',
      timeJST: '05:30 PM JST',
      topic: '🏭 5-Axis Live Factory & Spindle Tour (DMG MORI NTX 2000)',
      meetingType: 'VIRTUAL_FACTORY_TOUR',
      ndaRequired: true,
      notes: 'Evaluate Inconel 718 turbine impellers and spare capacity for humanoid robotics harmonic drives.',
      status: 'CONFIRMED',
    },
  ]);

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      title: 'B2B Meeting Scheduled 📅',
      message: 'Kenji Takahashi (Nagoya Robotics, Japan) scheduled a Virtual Factory Tour for Sep 24 at 02:00 PM IST / 05:30 PM JST.',
      time: '15m ago',
      unread: true,
    },
    {
      id: 'n-2',
      title: 'New Bilateral RFQ Match 🚀',
      message: 'New tender for 40,000 units/year Harmonic Drive splines under India-Japan Corridor matching your 5-axis capability.',
      time: '1h ago',
      unread: true,
    },
    {
      id: 'n-3',
      title: 'Green Supply Verification ✅',
      message: 'EcoAlloy Circular Solutions shared a verified ISO 14064 low-carbon recycled Al-6061 billet batch.',
      time: '3h ago',
      unread: false,
    },
  ]);

  // Modals
  const [meetingModalVisible, setMeetingModalVisible] = useState(false);
  const [meetingPostTarget, setMeetingPostTarget] = useState<Post | null>(null);
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
  const [postRfqModalVisible, setPostRfqModalVisible] = useState(false);
  const [aiAssistantVisible, setAiAssistantVisible] = useState(false);
  const [notificationsModalVisible, setNotificationsModalVisible] = useState(false);
  const [selectedMeetingDetail, setSelectedMeetingDetail] = useState<MeetingBooking | null>(null);

  // Load Persisted Data
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.body.style.backgroundColor = '#0a101d';
    }
    loadPersistedData();
  }, []);

  const loadPersistedData = async () => {
    try {
      const savedPosts = await AsyncStorage.getItem('@indusync_posts');
      if (savedPosts) setPosts(JSON.parse(savedPosts));

      const savedRfqs = await AsyncStorage.getItem('@indusync_rfqs');
      if (savedRfqs) setRfqs(JSON.parse(savedRfqs));

      const savedMeetings = await AsyncStorage.getItem('@indusync_meetings');
      if (savedMeetings) setScheduledMeetings(JSON.parse(savedMeetings));
    } catch {
      // Ignored
    }
  };

  const savePosts = async (newPosts: Post[]) => {
    setPosts(newPosts);
    try {
      await AsyncStorage.setItem('@indusync_posts', JSON.stringify(newPosts));
    } catch {
      // Ignored
    }
  };

  const saveRfqs = async (newRfqs: RFQItem[]) => {
    setRfqs(newRfqs);
    try {
      await AsyncStorage.setItem('@indusync_rfqs', JSON.stringify(newRfqs));
    } catch {
      // Ignored
    }
  };

  const saveMeetings = async (newMtgs: MeetingBooking[]) => {
    setScheduledMeetings(newMtgs);
    try {
      await AsyncStorage.setItem('@indusync_meetings', JSON.stringify(newMtgs));
    } catch {
      // Ignored
    }
  };

  // Handlers
  const handleLikeToggle = (postId: string) => {
    const updated = posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          isLiked: !p.isLiked,
          likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
        };
      }
      return p;
    });
    savePosts(updated);
  };

  const handleCreatePost = (newPostPartial: Partial<Post>) => {
    const fullPost: Post = {
      id: `post-${Date.now()}`,
      author: posts[0].author,
      timestamp: 'Just now',
      category: newPostPartial.category || 'INNOVATIONS',
      categoryLabel: newPostPartial.categoryLabel || 'UPDATE',
      corridorBadge: newPostPartial.corridorBadge,
      content: newPostPartial.content || '',
      media: newPostPartial.media,
      metrics: newPostPartial.metrics,
      hashtags: newPostPartial.hashtags || ['#ManufacturingUpdate'],
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: true,
      hasMeetingOption: newPostPartial.hasMeetingOption ?? true,
      meetingAvailability: newPostPartial.meetingAvailability,
    };

    savePosts([fullPost, ...posts]);
  };

  const handleCreateRFQ = (newRFQPartial: Partial<RFQItem>) => {
    const fullRFQ: RFQItem = {
      id: `rfq-${Date.now()}`,
      title: newRFQPartial.title || 'Precision Component Tender',
      buyerCompany: 'Your Company',
      buyerCountry: 'IN',
      buyerVerified: true,
      category: newRFQPartial.category || 'Precision Manufacturing',
      material: newRFQPartial.material || 'Alloy',
      quantity: newRFQPartial.quantity || '1,000 units',
      targetBudget: newRFQPartial.targetBudget || 'Negotiable',
      tolerance: newRFQPartial.tolerance || '±0.01 mm',
      leadTime: newRFQPartial.leadTime || '30 days',
      cadFileAttached: newRFQPartial.cadFileAttached ?? true,
      cadFileName: newRFQPartial.cadFileName,
      description: newRFQPartial.description || '',
      tags: newRFQPartial.tags || ['B2BTender'],
      bidsCount: 0,
      postedDate: 'Just now',
      status: 'OPEN',
      isSustainableRequest: newRFQPartial.isSustainableRequest,
      isBilateralCorridor: newRFQPartial.isBilateralCorridor,
    };

    saveRfqs([fullRFQ, ...rfqs]);
  };

  const handleConfirmMeetingBooking = (booking: MeetingBooking) => {
    const updated = [booking, ...scheduledMeetings];
    saveMeetings(updated);
    setMeetingModalVisible(false);

    // Also push a live notification
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: `Meeting Scheduled: ${booking.timeIST}`,
        message: `Bilateral consultation confirmed with ${booking.hostName} (${booking.hostCompany}). Dual Timezone: ${booking.timeIST} / ${booking.timeJST}`,
        time: 'Just now',
        unread: true,
      },
      ...prev,
    ]);
  };

  const handleScheduleFromBusiness = (biz: BusinessEntity) => {
    const fakePost: Post = {
      id: `biz-mtg-${biz.id}`,
      author: {
        id: biz.id,
        name: biz.name,
        role: 'MANUFACTURER',
        companyName: biz.name,
        country: biz.country,
        countryName: biz.country === 'IN' ? 'India' : 'Japan',
        avatar: biz.logo,
        isVerified: biz.isVerified,
        trustScore: biz.trustScore,
        location: biz.city,
      },
      timestamp: 'Active',
      category: 'MACHINERY',
      categoryLabel: 'CAPACITY',
      content: biz.about,
      hashtags: [],
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      hasMeetingOption: true,
    };
    setMeetingPostTarget(fakePost);
    setMeetingModalVisible(true);
  };

  if (!fontsLoaded) {
    return null;
  }

  const currentAuthor = posts[0]?.author || {
    id: 'usr-1',
    name: 'Rajesh Sharma',
    role: activeRole,
    companyName: 'Bharat Precision Mechatronics',
    country: 'IN' as CountryCode,
    countryName: 'India',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    trustScore: 98,
    location: 'Pune, Maharashtra',
  };

  const unreadNotifsCount = notifications.filter((n) => n.unread).length;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="light" backgroundColor="#0c1524" />

        {/* Global Header (Matching the Reference UI) */}
        <Header
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          onOpenNotifications={() => setNotificationsModalVisible(true)}
          onOpenAIAssistant={() => setAiAssistantVisible(true)}
          notificationCount={unreadNotifsCount}
          activeRole={activeRole}
          onRoleChange={setActiveRole}
        />

        {/* Active Screen View */}
        <View style={styles.screenWrapper}>
          {activeTab === 'FEED' && (
            <FeedScreen
              posts={posts}
              onScheduleMeeting={(post) => {
                setMeetingPostTarget(post);
                setMeetingModalVisible(true);
              }}
              onPostRFQ={() => setPostRfqModalVisible(true)}
              onOpenCreatePost={() => setCreatePostModalVisible(true)}
              onLikeToggle={handleLikeToggle}
              currentAuthor={currentAuthor}
              corridorFilterActive={corridorFilterActive}
              onToggleCorridorFilter={() => setCorridorFilterActive(!corridorFilterActive)}
            />
          )}

          {activeTab === 'DISCOVER' && (
            <DiscoverScreen
              businesses={businesses}
              onSelectBusiness={(biz) => handleScheduleFromBusiness(biz)}
              onScheduleWithBusiness={(biz) => handleScheduleFromBusiness(biz)}
              initialCorridorFilter={corridorFilterActive}
            />
          )}

          {activeTab === 'RFQS' && (
            <RFQScreen
              rfqs={rfqs}
              onOpenPostRFQ={() => setPostRfqModalVisible(true)}
              activeRole={activeRole}
            />
          )}

          {activeTab === 'MATCHES' && (
            <MatchesScreen
              opportunities={opportunities}
              scheduledMeetings={scheduledMeetings}
              onOpenMeetingDetails={(mtg) => setSelectedMeetingDetail(mtg)}
              onExploreCorridor={() => {
                setCorridorFilterActive(true);
                setActiveTab('FEED');
              }}
            />
          )}

          {activeTab === 'INSIGHTS' && (
            <InsightsScreen
              insights={INITIAL_MARKET_INSIGHTS}
              onOpenRFQ={() => setPostRfqModalVisible(true)}
              onExploreCorridor={() => {
                setCorridorFilterActive(true);
                setActiveTab('FEED');
              }}
            />
          )}

          {activeTab === 'PROFILE' && (
            <ProfileScreen
              activeRole={activeRole}
              onRoleSwitch={setActiveRole}
              onScheduleMeeting={() => {
                setMeetingPostTarget(posts[0]);
                setMeetingModalVisible(true);
              }}
              onPostRFQ={() => setPostRfqModalVisible(true)}
            />
          )}
        </View>

        {/* Native Bottom Tab Navigation (Matching Screenshot & Spec) */}
        <View style={styles.bottomTabBar}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('FEED')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'FEED' ? 'newspaper' : 'newspaper-outline'}
              size={21}
              color={activeTab === 'FEED' ? '#38bdf8' : '#64748b'}
            />
            <Text style={[styles.tabLabel, activeTab === 'FEED' && styles.tabLabelActive]}>
              Feed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('DISCOVER')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'DISCOVER' ? 'business' : 'business-outline'}
              size={21}
              color={activeTab === 'DISCOVER' ? '#38bdf8' : '#64748b'}
            />
            <Text style={[styles.tabLabel, activeTab === 'DISCOVER' && styles.tabLabelActive]}>
              Discover
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('RFQS')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'RFQS' ? 'clipboard' : 'clipboard-outline'}
              size={21}
              color={activeTab === 'RFQS' ? '#38bdf8' : '#64748b'}
            />
            <Text style={[styles.tabLabel, activeTab === 'RFQS' && styles.tabLabelActive]}>
              RFQs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('MATCHES')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'MATCHES' ? 'sparkles' : 'sparkles-outline'}
              size={21}
              color={activeTab === 'MATCHES' ? '#38bdf8' : '#64748b'}
            />
            <Text style={[styles.tabLabel, activeTab === 'MATCHES' && styles.tabLabelActive]}>
              Matches
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('INSIGHTS')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'INSIGHTS' ? 'trending-up' : 'trending-up-outline'}
              size={21}
              color={activeTab === 'INSIGHTS' ? '#38bdf8' : '#64748b'}
            />
            <Text style={[styles.tabLabel, activeTab === 'INSIGHTS' && styles.tabLabelActive]}>
              Insights
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('PROFILE')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'PROFILE' ? 'shield-checkmark' : 'shield-checkmark-outline'}
              size={21}
              color={activeTab === 'PROFILE' ? '#38bdf8' : '#64748b'}
            />
            <Text style={[styles.tabLabel, activeTab === 'PROFILE' && styles.tabLabelActive]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Schedule Meeting Modal */}
        <ScheduleMeetingModal
          visible={meetingModalVisible}
          onClose={() => setMeetingModalVisible(false)}
          post={meetingPostTarget}
          onConfirmBooking={handleConfirmMeetingBooking}
        />

        {/* Create Post Modal */}
        <CreatePostModal
          visible={createPostModalVisible}
          onClose={() => setCreatePostModalVisible(false)}
          onSubmitPost={handleCreatePost}
          currentAuthor={currentAuthor}
        />

        {/* Post RFQ Modal */}
        <PostRFQModal
          visible={postRfqModalVisible}
          onClose={() => setPostRfqModalVisible(false)}
          onSubmitRFQ={handleCreateRFQ}
          userCountry={currentAuthor.country}
        />

        {/* AI Assistant Modal */}
        <AIAssistantModal
          visible={aiAssistantVisible}
          onClose={() => setAiAssistantVisible(false)}
          onNavigateToCorridor={() => {
            setAiAssistantVisible(false);
            setCorridorFilterActive(true);
            setActiveTab('FEED');
          }}
        />

        {/* Notifications & Opportunities Sheet */}
        <Modal
          visible={notificationsModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setNotificationsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="notifications" size={18} color="#38bdf8" />
                  <Text style={styles.sheetTitle}>B2B Alerts & Opportunities</Text>
                </View>
                <TouchableOpacity onPress={() => setNotificationsModalVisible(false)}>
                  <Ionicons name="close" size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
                {notifications.map((item) => (
                  <View key={item.id} style={[styles.notifCard, item.unread && styles.notifCardUnread]}>
                    <View style={styles.notifTop}>
                      <Text style={styles.notifTitle}>{item.title}</Text>
                      <Text style={styles.notifTime}>{item.time}</Text>
                    </View>
                    <Text style={styles.notifMessage}>{item.message}</Text>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.sheetFooter}>
                <TouchableOpacity
                  style={styles.markAllReadBtn}
                  onPress={() => {
                    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
                    Alert.alert('Done', 'All notifications marked as read.');
                  }}
                >
                  <Text style={styles.markAllReadText}>Mark All as Read</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Meeting Detail Modal */}
        <Modal
          visible={!!selectedMeetingDetail}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedMeetingDetail(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.sheetContainer, { paddingBottom: 20 }]}>
              {selectedMeetingDetail && (
                <>
                  <View style={styles.sheetHeader}>
                    <Text style={styles.sheetTitle}>Meeting Confirmation</Text>
                    <TouchableOpacity onPress={() => setSelectedMeetingDetail(null)}>
                      <Ionicons name="close" size={20} color="#94a3b8" />
                    </TouchableOpacity>
                  </View>
                  <View style={{ padding: 18, gap: 12 }}>
                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '700' }}>
                      {selectedMeetingDetail.topic}
                    </Text>

                    <View style={styles.detailBox}>
                      <Text style={styles.detailLabel}>Date & Dual Timezone:</Text>
                      <Text style={styles.detailVal}>
                        {selectedMeetingDetail.date} • {selectedMeetingDetail.timeIST} / {selectedMeetingDetail.timeJST}
                      </Text>
                    </View>

                    <View style={styles.detailBox}>
                      <Text style={styles.detailLabel}>Host Company:</Text>
                      <Text style={styles.detailVal}>
                        {selectedMeetingDetail.hostName} ({selectedMeetingDetail.hostCompany})
                      </Text>
                    </View>

                    <View style={styles.detailBox}>
                      <Text style={styles.detailLabel}>Technical Agenda / Notes:</Text>
                      <Text style={styles.detailVal}>{selectedMeetingDetail.notes}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.joinBtnFull}
                      onPress={() => {
                        Alert.alert('Joining Room', 'Connecting to 1080p secure live feed...');
                        setSelectedMeetingDetail(null);
                      }}
                    >
                      <Ionicons name="videocam" size={17} color="#ffffff" />
                      <Text style={styles.joinBtnFullText}>Join Indusync Live Video Room</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0c1524',
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: '#0a101d',
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#0c1524',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingVertical: Platform.OS === 'ios' ? 8 : 10,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    minWidth: 50,
  },
  tabLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#38bdf8',
    fontWeight: '700',
  },
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
    maxHeight: '80%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  sheetTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  sheetFooter: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    alignItems: 'center',
  },
  markAllReadBtn: {
    paddingVertical: 8,
  },
  markAllReadText: {
    color: '#38bdf8',
    fontSize: 12.5,
    fontWeight: '700',
  },
  notifCard: {
    backgroundColor: '#101a2e',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e2d4a',
    marginBottom: 8,
  },
  notifCardUnread: {
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  notifTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  notifTime: {
    color: '#64748b',
    fontSize: 10.5,
  },
  notifMessage: {
    color: '#cbd5e1',
    fontSize: 11.5,
    lineHeight: 16,
  },
  detailBox: {
    backgroundColor: '#131e33',
    padding: 10,
    borderRadius: 8,
  },
  detailLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  detailVal: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 2,
  },
  joinBtnFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 6,
  },
  joinBtnFullText: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '700',
  },
});
