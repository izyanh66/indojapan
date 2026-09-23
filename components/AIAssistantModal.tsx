import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface AIAssistantModalProps {
  visible: boolean;
  onClose: () => void;
  onNavigateToCorridor?: () => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  visible,
  onClose,
  onNavigateToCorridor,
}) => {
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string; action?: string }[]>([
    {
      sender: 'ai',
      text: 'Konnichiwa & Namaste! I am your Indusync AI Manufacturing Copilot. I analyze CAD models, find verified suppliers across India & Japan, benchmark CNC cycle times, and recommend sustainable materials.',
    },
  ]);

  const handleSend = () => {
    if (!query.trim()) return;
    const userMsg = query.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setQuery('');
    setIsThinking(true);

    setTimeout(() => {
      let reply = '';
      if (userMsg.toLowerCase().includes('inconel') || userMsg.toLowerCase().includes('5-axis') || userMsg.toLowerCase().includes('cnc')) {
        reply = 'Found 2 Tier-1 Aerospace suppliers with 5-axis DMG MORI and Makino capacity: 1) Bharat Precision Mechatronics (Pune, 450 spare hrs/mo, AS9100D certified). 2) Kobe Advanced Micro-Alloys (Japan, certified feedstock). Recommended action: Schedule a Meeting (Virtual Factory Tour).';
      } else if (userMsg.toLowerCase().includes('japan') || userMsg.toLowerCase().includes('corridor') || userMsg.toLowerCase().includes('jetro')) {
        reply = 'The India-Japan Bilateral Corridor currently has 14 JETRO-backed MoUs and 40,000 units/year in active robotics tenders. Would you like to filter your feed by the Bilateral Corridor?';
      } else if (userMsg.toLowerCase().includes('sustainable') || userMsg.toLowerCase().includes('carbon') || userMsg.toLowerCase().includes('green')) {
        reply = 'Sustainable Sourcing Recommendation: Switching to solar-melted Al-6061 billets from EcoAlloy Circular Solutions reduces Scope 3 carbon footprint by 74% with zero tensile strength degradation.';
      } else {
        reply = `Analyzed your query "${userMsg}". Matching across 180+ verified manufacturers in Pune, Bengaluru, Nagoya, and Osaka. Estimated unit turnaround: 28 days with full CMM inspection reports.`;
      }
      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
      setIsThinking(false);
    }, 900);
  };

  const handleQuickPrompt = (promptText: string) => {
    setQuery(promptText);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.headerRow}>
            <View style={styles.titleGroup}>
              <View style={styles.aiSparkleBox}>
                <Ionicons name="sparkles" size={17} color="#f59e0b" />
              </View>
              <View>
                <Text style={styles.title}>Indusync AI Copilot</Text>
                <Text style={styles.subtitle}>B2B Spec Analysis & Supplier Intelligence</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Quick Prompts */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promptScroll}>
            <TouchableOpacity
              style={styles.promptChip}
              onPress={() => handleQuickPrompt('Find 5-axis CNC suppliers with spare capacity for Inconel 718')}
            >
              <Text style={styles.promptChipText}>⚡ 5-Axis Inconel Capacity</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.promptChip}
              onPress={() => handleQuickPrompt('Show India-Japan Bilateral Corridor active tenders')}
            >
              <Text style={styles.promptChipText}>🇮🇳🇯🇵 Japan Corridor Tenders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.promptChip}
              onPress={() => handleQuickPrompt('Recommend sustainable recycled aluminum suppliers')}
            >
              <Text style={styles.promptChipText}>🌱 Recycled Al-6061 LCA</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Chat Messages */}
          <ScrollView style={styles.chatScroll} contentContainerStyle={{ gap: 12 }}>
            {messages.map((m, idx) => (
              <View
                key={idx}
                style={[
                  styles.msgBubble,
                  m.sender === 'user' ? styles.userBubble : styles.aiBubble,
                ]}
              >
                {m.sender === 'ai' && (
                  <View style={styles.aiBadgeSmall}>
                    <Ionicons name="sparkles" size={11} color="#f59e0b" />
                    <Text style={styles.aiBadgeText}>AI Intelligence</Text>
                  </View>
                )}
                <Text style={styles.msgText}>{m.text}</Text>
              </View>
            ))}

            {isThinking && (
              <View style={[styles.msgBubble, styles.aiBubble, { flexDirection: 'row', alignItems: 'center', gap: 8 }]}>
                <ActivityIndicator size="small" color="#38bdf8" />
                <Text style={styles.msgText}>Synthesizing machine capacities & supplier databases...</Text>
              </View>
            )}
          </ScrollView>

          {/* Input Bar */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.inputField}
              value={query}
              onChangeText={setQuery}
              placeholder="Ask about materials, CNC rates, suppliers, or Kaizen..."
              placeholderTextColor="#64748b"
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !query.trim() && { opacity: 0.5 }]}
              onPress={handleSend}
              disabled={!query.trim()}
            >
              <Ionicons name="arrow-up" size={18} color="#ffffff" />
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
    height: '80%',
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiSparkleBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 11,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#1e293b',
    borderRadius: 14,
  },
  promptScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    maxHeight: 52,
  },
  promptChip: {
    backgroundColor: '#131e33',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 8,
  },
  promptChipText: {
    color: '#e2e8f0',
    fontSize: 11.5,
    fontWeight: '600',
  },
  chatScroll: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  msgBubble: {
    padding: 12,
    borderRadius: 12,
    maxWidth: '88%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563eb',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#131e33',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  aiBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  aiBadgeText: {
    color: '#f59e0b',
    fontSize: 9.5,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  msgText: {
    color: '#f1f5f9',
    fontSize: 13,
    lineHeight: 18,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  inputField: {
    flex: 1,
    backgroundColor: '#131e33',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 13,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
