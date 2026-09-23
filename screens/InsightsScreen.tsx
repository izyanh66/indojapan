import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MarketInsight } from '../types';

interface InsightsScreenProps {
  insights: MarketInsight[];
  onOpenRFQ: () => void;
  onExploreCorridor: () => void;
}

export const InsightsScreen: React.FC<InsightsScreenProps> = ({
  insights,
  onOpenRFQ,
  onExploreCorridor,
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.aiSparkleBox}>
          <Ionicons name="analytics" size={20} color="#38bdf8" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>AI Industry & Demand Insights</Text>
          <Text style={styles.headerSub}>
            Live raw material indices, CNC capacity benchmarks & bilateral trade metrics
          </Text>
        </View>
      </View>

      {/* Corridor Bilateral Index Summary */}
      <View style={styles.corridorStatCard}>
        <View style={styles.corridorStatTop}>
          <Text style={styles.corridorFlags}>🇮🇳 🇯🇵</Text>
          <View style={styles.liveTag}>
            <Text style={styles.liveTagText}>SEPTEMBER 2026 INDEX</Text>
          </View>
        </View>
        <Text style={styles.corridorStatTitle}>India–Japan Manufacturing Exchange Index</Text>
        <View style={styles.corridorMetricsRow}>
          <View style={styles.cMetric}>
            <Text style={styles.cMetricVal}>+34.2%</Text>
            <Text style={styles.cMetricLabel}>YoY Machining Orders</Text>
          </View>
          <View style={styles.cMetric}>
            <Text style={styles.cMetricVal}>14 MoUs</Text>
            <Text style={styles.cMetricLabel}>Active JETRO Partnerships</Text>
          </View>
          <View style={styles.cMetric}>
            <Text style={styles.cMetricVal}>-26%</Text>
            <Text style={styles.cMetricLabel}>Avg Tooling Cost Diff</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.corridorAction} onPress={onExploreCorridor}>
          <Text style={styles.corridorActionText}>Explore Bilateral Trade Corridor</Text>
          <Ionicons name="arrow-forward" size={13} color="#f59e0b" />
        </TouchableOpacity>
      </View>

      {/* Sustainable Sourcing Radar */}
      <View style={styles.sustainableCard}>
        <View style={styles.sustainableHeader}>
          <Ionicons name="leaf" size={17} color="#10b981" />
          <Text style={styles.sustainableTitle}>Sustainable & Local Sourcing Recommendations</Text>
        </View>
        <Text style={styles.sustainableDesc}>
          AI algorithm detected that sourcing low-carbon recycled Al-6061 billets locally in Bengaluru instead of virgin imports cuts Scope 3 emissions by 74% and avoids 18 days of port maritime delays.
        </Text>
        <TouchableOpacity
          style={styles.greenRfqBtn}
          onPress={() => {
            Alert.alert(
              'Green Sourcing Filter Applied 🌱',
              'Displaying verified low-carbon aluminum and titanium recyclers with ISO 14064 certification.'
            );
          }}
        >
          <Text style={styles.greenRfqBtnText}>Filter Sustainable Suppliers</Text>
        </TouchableOpacity>
      </View>

      {/* Raw Material Price Indices */}
      <Text style={styles.sectionTitle}>Raw Material Price Index (Live B2B Benchmarks)</Text>

      <View style={{ gap: 12 }}>
        {insights.map((item) => (
          <View key={item.id} style={styles.insightCard}>
            <View style={styles.insightTop}>
              <Text style={styles.materialName}>{item.material}</Text>
              <View
                style={[
                  styles.priceChangePill,
                  item.isUp ? styles.priceUp : styles.priceDown,
                ]}
              >
                <Ionicons
                  name={item.isUp ? 'arrow-up' : 'arrow-down'}
                  size={12}
                  color={item.isUp ? '#ef4444' : '#10b981'}
                />
                <Text
                  style={[
                    styles.priceChangeText,
                    { color: item.isUp ? '#ef4444' : '#10b981' },
                  ]}
                >
                  {item.change24h}
                </Text>
              </View>
            </View>

            <Text style={styles.pricePerKg}>{item.pricePerKg}</Text>
            <Text style={styles.trendSummary}>{item.trendSummary}</Text>

            {/* AI Forecast */}
            <View style={styles.forecastBox}>
              <Ionicons name="sparkles" size={13} color="#f59e0b" />
              <Text style={styles.forecastText}>
                <Text style={{ fontWeight: '700', color: '#f59e0b' }}>AI Demand Forecast: </Text>
                {item.aiDemandForecast}
              </Text>
            </View>

            {/* Sustainable Alternative */}
            <View style={styles.greenBox}>
              <Ionicons name="leaf-outline" size={13} color="#10b981" />
              <Text style={styles.greenText}>
                <Text style={{ fontWeight: '700', color: '#10b981' }}>Eco-Alternative: </Text>
                {item.sustainableAlternative}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Post RFQ Banner */}
      <View style={styles.bottomRfqBanner}>
        <Text style={styles.bottomRfqTitle}>Need Custom Spec Pricing?</Text>
        <Text style={styles.bottomRfqSub}>
          Broadcast your 3D CAD to get instant AI-matched supplier bids.
        </Text>
        <TouchableOpacity style={styles.broadcastBtn} onPress={onOpenRFQ}>
          <Ionicons name="flash" size={15} color="#ffffff" />
          <Text style={styles.broadcastBtnText}>Post Requirement Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a101d',
  },
  content: {
    padding: 16,
    paddingBottom: 90,
  },
  headerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#101a2e',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e2d4a',
    marginBottom: 14,
  },
  aiSparkleBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  headerSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  corridorStatCard: {
    backgroundColor: '#101a2d',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    padding: 14,
    marginBottom: 14,
  },
  corridorStatTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  corridorFlags: {
    fontSize: 18,
  },
  liveTag: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveTagText: {
    color: '#f59e0b',
    fontSize: 9.5,
    fontWeight: '800',
  },
  corridorStatTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  corridorMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0a101d',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  cMetric: {
    alignItems: 'center',
  },
  cMetricVal: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '800',
  },
  cMetricLabel: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  corridorAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 4,
  },
  corridorActionText: {
    color: '#f59e0b',
    fontSize: 11.5,
    fontWeight: '700',
  },
  sustainableCard: {
    backgroundColor: '#0c1a24',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  sustainableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  sustainableTitle: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '700',
  },
  sustainableDesc: {
    color: '#cbd5e1',
    fontSize: 11.5,
    lineHeight: 16,
    marginBottom: 10,
  },
  greenRfqBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10b981',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  greenRfqBtnText: {
    color: '#10b981',
    fontSize: 11.5,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 10,
  },
  insightCard: {
    backgroundColor: '#101a2e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e2d4a',
    padding: 14,
  },
  insightTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  materialName: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  priceChangePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priceUp: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  priceDown: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  priceChangeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  pricePerKg: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  trendSummary: {
    color: '#94a3b8',
    fontSize: 11.5,
    marginBottom: 10,
  },
  forecastBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  forecastText: {
    color: '#e2e8f0',
    fontSize: 11,
    lineHeight: 15,
    flex: 1,
  },
  greenBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    padding: 8,
    borderRadius: 6,
  },
  greenText: {
    color: '#e2e8f0',
    fontSize: 11,
    lineHeight: 15,
    flex: 1,
  },
  bottomRfqBanner: {
    backgroundColor: '#12233f',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  bottomRfqTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  bottomRfqSub: {
    color: '#94a3b8',
    fontSize: 11.5,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  broadcastBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  broadcastBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
