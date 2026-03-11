-- ============================================================
-- Demo Seed Data — Brew Loyalty
--
-- Creates a sample brewery loyalty program with realistic
-- tiers, perks, and rewards for development and testing.
--
-- Safe to run multiple times (uses INSERT ... ON CONFLICT DO NOTHING)
-- ============================================================

-- ============================================================
-- ORGANIZATION: Ironwood Brewing Co.
-- ============================================================
insert into public.organizations (id, name, slug, primary_color)
values (
  '00000000-0000-0000-0000-000000000001',
  'Ironwood Brewing Co.',
  'ironwood-brewing',
  '#4A2C1A'   -- deep brown
) on conflict (id) do nothing;

-- ============================================================
-- LOYALTY PROGRAM
-- ============================================================
insert into public.loyalty_programs (id, org_id, name, description)
values (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  'Ironwood Rewards',
  'Earn points every time you visit and enjoy exclusive perks as a club member.'
) on conflict (id) do nothing;

-- ============================================================
-- POINT RULES
-- ============================================================
insert into public.point_rules (id, program_id, rule_type, points_value, dollar_threshold, description)
values
  -- 1 point per dollar spent
  (
    '00000000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000010',
    'per_dollar', 1, 0,
    'Earn 1 point for every $1 spent'
  ),
  -- 50-point signup bonus
  (
    '00000000-0000-0000-0000-000000000021',
    '00000000-0000-0000-0000-000000000010',
    'signup_bonus', 50, 0,
    'Welcome bonus: 50 points when you join'
  ),
  -- Birthday month bonus
  (
    '00000000-0000-0000-0000-000000000022',
    '00000000-0000-0000-0000-000000000010',
    'birthday_bonus', 100, 0,
    'Happy Birthday! 100 bonus points during your birthday month'
  )
on conflict (id) do nothing;

-- ============================================================
-- PROGRAM TIERS
-- ============================================================
insert into public.program_tiers
  (id, program_id, name, description, tier_type, monthly_cost, point_threshold, sort_order, color, icon)
values
  -- Base tier (free, auto-assigned)
  (
    '00000000-0000-0000-0000-000000000030',
    '00000000-0000-0000-0000-000000000010',
    'Regular',
    'Everyone starts here. Earn points on every visit.',
    'free', null, null, 0, '#888888', '🍺'
  ),
  -- Paid: Hop Club
  (
    '00000000-0000-0000-0000-000000000031',
    '00000000-0000-0000-0000-000000000010',
    'Hop Club',
    'Monthly membership with a free pint credit and faster points.',
    'paid_subscription', 9.99, null, 1, '#C8873A', '🌾'
  ),
  -- Paid: Brew Master
  (
    '00000000-0000-0000-0000-000000000032',
    '00000000-0000-0000-0000-000000000010',
    'Brew Master',
    'Our premium club — double points, monthly growler fill, and event priority.',
    'paid_subscription', 19.99, null, 2, '#4A7C9E', '🏆'
  ),
  -- Earned: Legend (threshold)
  (
    '00000000-0000-0000-0000-000000000033',
    '00000000-0000-0000-0000-000000000010',
    'Legend',
    'Earned status for our most loyal regulars. Unlock when you reach 2,000 lifetime points.',
    'threshold', null, 2000, 3, '#C0A020', '⭐'
  )
on conflict (id) do nothing;

-- ============================================================
-- TIER PERKS
-- ============================================================
insert into public.tier_perks (id, tier_id, perk_type, multiplier, free_item_desc, discount_pct, description)
values
  -- Regular perks
  (
    '00000000-0000-0000-0000-000000000040',
    '00000000-0000-0000-0000-000000000030',
    'point_multiplier', 1.0, null, null,
    '1x points on every purchase'
  ),

  -- Hop Club perks
  (
    '00000000-0000-0000-0000-000000000041',
    '00000000-0000-0000-0000-000000000031',
    'point_multiplier', 1.5, null, null,
    '1.5x points on every purchase'
  ),
  (
    '00000000-0000-0000-0000-000000000042',
    '00000000-0000-0000-0000-000000000031',
    'free_item', null, 'One free pint per month', null,
    'One free pint credited to your account each month'
  ),

  -- Brew Master perks
  (
    '00000000-0000-0000-0000-000000000043',
    '00000000-0000-0000-0000-000000000032',
    'point_multiplier', 2.0, null, null,
    '2x points on every purchase'
  ),
  (
    '00000000-0000-0000-0000-000000000044',
    '00000000-0000-0000-0000-000000000032',
    'free_item', null, 'One free pint + one growler fill per month', null,
    'Monthly pint credit + growler fill (64oz, house beer)'
  ),
  (
    '00000000-0000-0000-0000-000000000045',
    '00000000-0000-0000-0000-000000000032',
    'event_access', null, null, null,
    'Priority access and early invites to member-only events'
  ),

  -- Legend perks
  (
    '00000000-0000-0000-0000-000000000046',
    '00000000-0000-0000-0000-000000000033',
    'point_multiplier', 2.5, null, null,
    '2.5x points on every purchase'
  ),
  (
    '00000000-0000-0000-0000-000000000047',
    '00000000-0000-0000-0000-000000000033',
    'free_item', null, 'Free birthday flight', null,
    'Complimentary tasting flight during your birthday month'
  ),
  (
    '00000000-0000-0000-0000-000000000048',
    '00000000-0000-0000-0000-000000000033',
    'event_access', null, null, null,
    'VIP event access + permanent name on the Legend Wall'
  )
on conflict (id) do nothing;

-- ============================================================
-- REWARD CATALOG
-- ============================================================
insert into public.reward_catalog (id, program_id, name, description, point_cost, is_active)
values
  (
    '00000000-0000-0000-0000-000000000050',
    '00000000-0000-0000-0000-000000000010',
    'Free Pint',
    'Redeem for any 16oz draft pour.',
    150, true
  ),
  (
    '00000000-0000-0000-0000-000000000051',
    '00000000-0000-0000-0000-000000000010',
    'Tasting Flight',
    'Choose any 5 beers from our current tap list.',
    250, true
  ),
  (
    '00000000-0000-0000-0000-000000000052',
    '00000000-0000-0000-0000-000000000010',
    'Growler Fill',
    '64oz growler fill — any house beer on tap.',
    400, true
  ),
  (
    '00000000-0000-0000-0000-000000000053',
    '00000000-0000-0000-0000-000000000010',
    'Ironwood Pint Glass',
    'Take home a branded Ironwood pint glass.',
    300, true
  ),
  (
    '00000000-0000-0000-0000-000000000054',
    '00000000-0000-0000-0000-000000000010',
    '$10 Tab Credit',
    '$10 off your next tab — no minimum spend.',
    500, true
  )
on conflict (id) do nothing;
