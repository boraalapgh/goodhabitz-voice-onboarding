-- Enable pgvector once per database
create extension if not exists "vector";

--------------------------------------------------------
-- 1.  Canonical skills & aliases
--------------------------------------------------------
create table skills (
  id          uuid primary key default gen_random_uuid(),
  name        text unique not null
);

create table skill_aliases (
  alias       text primary key,
  skill_id    uuid not null references skills(id) on delete cascade
);

--------------------------------------------------------
-- 2.  Content tables (courses, lessons, activities)
--------------------------------------------------------
create type content_kind as enum ('course', 'lesson', 'activity');

create table contents (
  id          uuid primary key default gen_random_uuid(),
  kind        content_kind not null,
  title       text not null,
  description text,
  duration    int,                    -- minutes
  -- embed title+description+skills for semantic search
  embedding   vector(1536)
);

--------------------------------------------------------
-- 3.  Many-to-many linking table
--------------------------------------------------------
create table content_skills (
  content_id  uuid references contents(id) on delete cascade,
  skill_id    uuid references skills(id)   on delete cascade,
  primary key (content_id, skill_id)
);

--------------------------------------------------------
-- 4.  Vector index (optional but speeds fallback search)
--------------------------------------------------------
create index contents_embedding_ivfflat
  on contents using ivfflat (embedding)
  with (lists = 100);       -- tune for dataset size 