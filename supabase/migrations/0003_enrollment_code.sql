-- Migration 0003: Add enrollment_code to loyalty_programs
--
-- enrollment_code: short, human-readable code members use to join a program
-- (e.g. "IRONWOOD"). Case-insensitive lookup; stored uppercase.
-- Nullable — programs without a code can only be joined via QR (future).

ALTER TABLE loyalty_programs
  ADD COLUMN enrollment_code VARCHAR(20) UNIQUE;

-- Update Ironwood Brewing Co.'s program
UPDATE loyalty_programs
SET enrollment_code = 'IRONWOOD'
WHERE name = 'Ironwood Rewards';

-- Index for fast code lookups
CREATE INDEX idx_loyalty_programs_enrollment_code
  ON loyalty_programs (enrollment_code)
  WHERE enrollment_code IS NOT NULL;
