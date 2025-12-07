# Payment Data Security Migration Guide

## Overview
This migration moves all payment and subscription data from the `profiles` table to a new secure `user_subscriptions` table with strict admin-only access.

## Migration Applied
- **File**: `supabase/migrations/20251207123516_secure_payment_data_isolation.sql`
- **New Table**: `user_subscriptions` (admin/service role only access)
- **Security Functions**: `user_has_access()`, `get_user_subscription_tier()`, `get_subscription_summary()`

## Edge Functions Requiring Updates

The following Edge Functions need to be updated to use `user_subscriptions` table instead of `profiles`:

### 1. stripe-webhook (supabase/functions/stripe-webhook/index.ts)

**Lines to update:**
- Line 92-95: Change `from('profiles').update(updateData)` to `from('user_subscriptions').update(updateData).eq('user_id', metadata.user_id)`
- Line 246-250: Change `from('profiles').select('id').eq('stripe_customer_id', customerId)` to `from('user_subscriptions').select('user_id').eq('stripe_customer_id', customerId)`
- Line 263-266: Change `from('profiles').update(updateData)` to `from('user_subscriptions').update(updateData)`
- Line 296-302: Change `from('profiles').update({...})` to `from('user_subscriptions').update({...})`
- Line 323-326: Change `from('profiles').update({...})` to `from('user_subscriptions').update({...})`
- Line 343-349: Change `from('profiles').update({...})` to `from('user_subscriptions').update({...})`

**Note**: Keep profile SELECTs for display_name/email (lines 105-109, 191-195) as those are non-sensitive fields still in profiles.

### 2. sync-stripe-subscriptions (supabase/functions/sync-stripe-subscriptions/index.ts)

Update all instances where payment fields are queried or updated from profiles to use user_subscriptions.

### 3. verify-student (supabase/functions/verify-student/index.ts)

Update student verification status updates to use user_subscriptions table.

### 4. send-renewal-reminders (supabase/functions/send-renewal-reminders/index.ts)

Update queries for subscription_renewal_date to use user_subscriptions table.

### 5. create-church (supabase/functions/create-church/index.ts)

Review for any individual subscription checks that might need updating.

## Frontend Code Updates Completed

✅ **src/hooks/useSubscription.tsx** - Now uses `get_subscription_summary()` function
✅ **src/hooks/useFreeTier.ts** - Now uses `get_subscription_summary()` function

## Remaining Frontend Files to Review

The following files reference subscription fields and may need updates:

1. **src/pages/Pricing.tsx** - Check for direct subscription field access
2. **src/pages/ChurchAdmin.tsx** - Check for direct subscription field access
3. **src/pages/AdminSubscriptions.tsx** - Admin page - may need to query user_subscriptions directly
4. **src/components/UserCountBadge.tsx** - Check for subscription tier display

## Security Benefits

✅ **Principle of Least Privilege** - Users cannot access payment data at all
✅ **Admin-Only Access** - Only admins and service role can view/modify payment data
✅ **Safe Access Functions** - Applications use secure functions that return only necessary info
✅ **Defense in Depth** - Multiple layers: RLS + function-based access + table separation
✅ **Audit Trail** - All payment data access can be logged in secure functions

## Backwards Compatibility

The migration creates a `profiles_with_subscription` VIEW that joins profiles with subscriptions for backwards compatibility during transition. However, applications should migrate to use the secure functions instead.

## Testing Checklist

- [ ] Run migration on development database
- [ ] Test user signup (creates subscription record automatically)
- [ ] Test Stripe webhook for new subscriptions
- [ ] Test Stripe webhook for subscription updates
- [ ] Test Stripe webhook for subscription cancellations
- [ ] Test frontend subscription display
- [ ] Test free tier gating
- [ ] Test admin subscription management
- [ ] Verify RLS policies block user access to user_subscriptions
- [ ] Verify admins can access user_subscriptions

## Rollback Plan

If issues arise:
1. Applications can temporarily query `profiles_with_subscription` view
2. Revert Edge Function changes
3. Keep new security functions for future migration

## Next Steps

1. Update all Edge Functions listed above
2. Test webhooks in development
3. Update remaining frontend files
4. Deploy to staging
5. Run end-to-end tests
6. Deploy to production
7. Monitor for errors
8. (Optional) Remove payment fields from profiles table after 30 days of stable operation
