-- The partial unique index from 20260601152258_add_central_class_id.sql
-- (`WHERE central_class_id IS NOT NULL`) does not satisfy PostgREST's
-- `upsert(..., { onConflict: 'central_class_id' })`, which generates a plain
-- `ON CONFLICT (central_class_id)` clause with no predicate. Postgres requires
-- an exact match, so every class sync upsert has been failing with 42P10
-- ("no unique or exclusion constraint matching the ON CONFLICT specification")
-- since this column was added. A plain UNIQUE constraint already permits
-- multiple NULLs, so it preserves the original intent without the mismatch.
ALTER TABLE classes ADD CONSTRAINT classes_central_class_id_key UNIQUE (central_class_id);
