import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfMonth } from 'date-fns';

interface RevenueMetrics {
  mrr: number;
  arr: number;
  activeSubscribers: number;
  churnedThisMonth: number;
  churnRate: number;
  newSubscribersThisMonth: number;
  conversionRate: number;
  averageRevenuePerUser: number;
}

interface CohortData {
  cohortDate: string;
  totalUsers: number;
  stillActive: number;
  retentionRate: number;
}

interface OnboardingFunnel {
  step: string;
  count: number;
  dropoff: number;
}

// Price IDs to MRR mapping (cents)
const PRICE_TO_MRR: Record<string, number> = {
  'price_1Qb3SxCibB3mHN3rlv6wGBqD': 9.97, // Essential monthly
  'price_1Qb3TNCibB3mHN3rBhbB0xRk': 99.97, // Essential yearly (8.33/mo)
  'price_1Qb3TpCibB3mHN3rElL1v7b6': 14.97, // Premium monthly
  'price_1Qb3UNCibB3mHN3r3BYEZvbH': 149.97, // Premium yearly (12.50/mo)
};

export function useRevenueAnalytics() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [cohorts, setCohorts] = useState<CohortData[]>([]);
  const [onboardingFunnel, setOnboardingFunnel] = useState<OnboardingFunnel[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<{ month: string; mrr: number; subscribers: number }[]>([]);

  useEffect(() => {
    fetchAllMetrics();
  }, []);

  const fetchAllMetrics = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchRevenueMetrics(),
        fetchCohortData(),
        fetchOnboardingFunnel(),
        fetchMonthlyTrend(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueMetrics = async () => {
    const now = new Date();
    const monthStart = startOfMonth(now);

    // Get all subscriptions
    const { data: subs } = await supabase
      .from('user_subscriptions')
      .select('subscription_status, subscription_tier, created_at, has_lifetime_access');

    const activeSubs = subs?.filter(s => s.subscription_status === 'active') || [];
    const trialSubs = subs?.filter(s => s.subscription_status === 'trial') || [];
    
    // Calculate MRR from active subscriptions based on tier
    let mrr = 0;
    activeSubs.forEach(sub => {
      if (sub.subscription_tier === 'premium') {
        mrr += 14.97;
      } else if (sub.subscription_tier === 'essential') {
        mrr += 9.97;
      }
    });

    // Get cancelled subscriptions from profiles (subscription_cancelled_at)
    const { data: cancelledProfiles } = await supabase
      .from('profiles')
      .select('id, subscription_cancelled_at')
      .not('subscription_cancelled_at', 'is', null);

    const churnedThisMonth = cancelledProfiles?.filter(p => 
      p.subscription_cancelled_at && 
      new Date(p.subscription_cancelled_at) >= monthStart
    ).length || 0;

    // New subscribers this month
    const newThisMonth = activeSubs.filter(s => 
      s.created_at && new Date(s.created_at) >= monthStart
    ).length;

    // Trial conversion (trials that became active)
    const totalTrials = trialSubs.length + activeSubs.length;
    const conversionRate = totalTrials > 0 ? (activeSubs.length / totalTrials) * 100 : 0;

    // Churn rate
    const startOfMonthActive = activeSubs.length + churnedThisMonth;
    const churnRate = startOfMonthActive > 0 ? (churnedThisMonth / startOfMonthActive) * 100 : 0;

    setMetrics({
      mrr: Math.round(mrr * 100) / 100,
      arr: Math.round(mrr * 12 * 100) / 100,
      activeSubscribers: activeSubs.length,
      churnedThisMonth,
      churnRate: Math.round(churnRate * 10) / 10,
      newSubscribersThisMonth: newThisMonth,
      conversionRate: Math.round(conversionRate * 10) / 10,
      averageRevenuePerUser: activeSubs.length > 0 ? Math.round((mrr / activeSubs.length) * 100) / 100 : 0,
    });
  };

  const fetchCohortData = async () => {
    // Get profiles grouped by cohort (signup month)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, created_at, cohort_date')
      .order('created_at', { ascending: true });

    // Get active subscriptions
    const { data: activeSubs } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .eq('subscription_status', 'active');

    const activeUserIds = new Set(activeSubs?.map(s => s.user_id) || []);

    // Group by month
    const cohortMap = new Map<string, { total: number; active: number }>();

    profiles?.forEach(profile => {
      const cohortMonth = profile.cohort_date 
        ? format(new Date(profile.cohort_date), 'yyyy-MM')
        : format(new Date(profile.created_at), 'yyyy-MM');
      
      const existing = cohortMap.get(cohortMonth) || { total: 0, active: 0 };
      existing.total++;
      if (activeUserIds.has(profile.id)) {
        existing.active++;
      }
      cohortMap.set(cohortMonth, existing);
    });

    // Convert to array and sort
    const cohortArray: CohortData[] = Array.from(cohortMap.entries())
      .map(([date, data]) => ({
        cohortDate: date,
        totalUsers: data.total,
        stillActive: data.active,
        retentionRate: Math.round((data.active / data.total) * 100),
      }))
      .sort((a, b) => b.cohortDate.localeCompare(a.cohortDate))
      .slice(0, 6); // Last 6 months

    setCohorts(cohortArray);
  };

  const fetchOnboardingFunnel = async () => {
    // Get onboarding events
    const { data: events } = await supabase
      .from('user_events')
      .select('event_type, event_data')
      .in('event_type', [
        'onboarding_started',
        'onboarding_step',
        '24fps_tour_started',
        '24fps_tour_completed',
        '24fps_tour_skipped',
      ]);

    const counts: Record<string, number> = {
      'Started Onboarding': 0,
      'Selected Role': 0,
      'Started 24FPS Tour': 0,
      'Completed 24FPS Tour': 0,
      'Skipped Tour': 0,
    };

    events?.forEach(e => {
      if (e.event_type === 'onboarding_started') counts['Started Onboarding']++;
      if (e.event_type === 'onboarding_step' && (e.event_data as any)?.step_name === 'role') counts['Selected Role']++;
      if (e.event_type === '24fps_tour_started') counts['Started 24FPS Tour']++;
      if (e.event_type === '24fps_tour_completed') counts['Completed 24FPS Tour']++;
      if (e.event_type === '24fps_tour_skipped') counts['Skipped Tour']++;
    });

    const funnel: OnboardingFunnel[] = Object.entries(counts).map(([step, count], i, arr) => ({
      step,
      count,
      dropoff: i > 0 && arr[i-1][1] > 0 ? Math.round((1 - count / arr[i-1][1]) * 100) : 0,
    }));

    setOnboardingFunnel(funnel);
  };

  const fetchMonthlyTrend = async () => {
    // Last 6 months
    const months: { month: string; mrr: number; subscribers: number }[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = subDays(new Date(), i * 30);
      const monthKey = format(monthDate, 'MMM yyyy');
      
      // This is a simplified calculation - in production you'd want historical snapshots
      months.push({
        month: monthKey,
        mrr: 0, // Would need historical data
        subscribers: 0,
      });
    }

    // Get current month's data
    const { data: currentSubs } = await supabase
      .from('user_subscriptions')
      .select('subscription_status, subscription_tier, created_at')
      .eq('subscription_status', 'active');

    if (months.length > 0 && currentSubs) {
      months[months.length - 1].subscribers = currentSubs.length;
      months[months.length - 1].mrr = currentSubs.reduce((sum, s) => {
        return sum + (s.subscription_tier === 'premium' ? 14.97 : 9.97);
      }, 0);
    }

    setMonthlyTrend(months);
  };

  return {
    loading,
    metrics,
    cohorts,
    onboardingFunnel,
    monthlyTrend,
    refetch: fetchAllMetrics,
  };
}
