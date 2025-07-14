-- Step 1: Create the new enum type
create type mix_category_enum_new as enum('Mix', 'Pre-Mix');

-- Step 2: Alter the column to use the new enum type
alter table mixes
alter column category type mix_category_enum_new using category::text::mix_category_enum_new;

-- Step 3: Drop the old enum type
drop type mix_category_enum;

-- Step 4: Rename the new enum type to the old name
alter type mix_category_enum_new
rename to mix_category_enum;