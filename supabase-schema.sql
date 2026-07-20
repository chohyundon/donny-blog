-- donny.log Supabase Schema

create table public.posts (
  id            uuid default gen_random_uuid() primary key,
  slug          text unique not null,
  title         text not null,
  excerpt       text,
  content       text,
  thumbnail_color  text default '#6366f1',
  thumbnail_accent text default '#4f46e5',
  tag           text,
  published_at  timestamptz default now(),
  likes         int default 0,
  comments_count int default 0,
  read_time     int default 5,
  published     boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 좋아요 원자적 증가 함수
create or replace function increment_likes(post_id uuid)
returns void as $$
  update posts set likes = likes + 1 where id = post_id;
$$ language sql;

-- 샘플 데이터
insert into public.posts (slug, title, excerpt, thumbnail_color, thumbnail_accent, tag, likes, comments_count, read_time) values
  ('react-18-concurrent-features', 'React 18 Concurrent Features 완벽 가이드', 'Suspense, useTransition, useDeferredValue를 실제 프로젝트에서 어떻게 활용하는지 예제와 함께 알아봅니다.', '#1DC4D0', '#0D9AA8', 'React', 142, 18, 8),
  ('typescript-generic-patterns', 'TypeScript 제네릭 패턴 — 실무에서 바로 쓰는 5가지', '복잡한 타입 추론부터 조건부 타입까지, 실무에서 자주 마주치는 제네릭 패턴을 정리했습니다.', '#BF95FA', '#9A6CF0', 'TypeScript', 98, 12, 6),
  ('nextjs-15-app-router-blog', 'Next.js 15 App Router로 블로그 만들기', 'Server Components와 Streaming을 활용해 성능 좋은 기술 블로그를 처음부터 구축하는 과정을 공유합니다.', '#FEC847', '#E5A800', 'Next.js', 215, 31, 12),
  ('tailwind-v4-migration', 'Tailwind CSS v4 마이그레이션 완벽 가이드', 'v3에서 v4로 올리면서 달라진 것들과 주의해야 할 Breaking Changes를 코드로 정리했습니다.', '#28CC8F', '#1AAA74', 'CSS', 76, 9, 7),
  ('core-web-vitals-optimization', 'Core Web Vitals 90점 만들기 — 실전 최적화', 'LCP, FID, CLS를 개선하기 위한 구체적인 기법들과 실제 프로젝트에 적용한 결과를 공유합니다.', '#FA6690', '#E0345C', '성능최적화', 183, 24, 10),
  ('first-open-source-contribution', '오픈소스 기여 처음 해봤습니다 — 후기', '처음으로 오픈소스 PR을 머지시킨 경험과, 기여하기 좋은 프로젝트를 찾는 방법을 공유합니다.', '#3879FA', '#1B5CE0', '개발일지', 64, 7, 5);

-- RLS
alter table public.posts enable row level security;
create policy "Public posts are viewable by everyone" on public.posts
  for select using (published = true);

-- 작성자(이메일)만 글 작성/수정/삭제 가능
create policy "Author can insert posts" on public.posts
  for insert
  with check ((auth.jwt() ->> 'email') = 'gse06044@naver.com');

create policy "Author can update posts" on public.posts
  for update
  using ((auth.jwt() ->> 'email') = 'gse06044@naver.com')
  with check ((auth.jwt() ->> 'email') = 'gse06044@naver.com');

create policy "Author can delete posts" on public.posts
  for delete
  using ((auth.jwt() ->> 'email') = 'gse06044@naver.com');

create policy "Author can view all posts" on public.posts
  for select
  using ((auth.jwt() ->> 'email') = 'gse06044@naver.com');

-- 사이트 통계 (방문자 수 등)
create table public.site_stats (
  key   text primary key,
  value bigint default 0
);

insert into public.site_stats (key, value) values ('visitor_count', 0);

-- 방문자 수 원자적 증가 (총계 갱신 + 일별 로그 동시 처리)
create or replace function increment_visitor_count()
returns bigint as $$
declare
  new_total bigint;
begin
  update public.site_stats
  set value = value + 1
  where key = 'visitor_count'
  returning value into new_total;

  insert into public.visitor_logs (date, count)
  values (current_date, 1)
  on conflict (date) do update
  set count = visitor_logs.count + 1;

  return new_total;
end;
$$ language plpgsql;

-- RLS — 누구나 읽을 수 있고, 함수로만 쓸 수 있음
alter table public.site_stats enable row level security;
create policy "Stats are viewable by everyone" on public.site_stats
  for select using (true);

-- 일별 방문자 로그
create table public.visitor_logs (
  date  date   primary key default current_date,
  count bigint default 0
);

alter table public.visitor_logs enable row level security;
create policy "Visitor logs are viewable by everyone" on public.visitor_logs
  for select using (true);

-- 최근 N일 방문자 이력 조회 (빈 날짜는 0으로 채움)
create or replace function get_visitor_history(days_back int default 7)
returns table(date date, count bigint) as $$
  select
    gs.d::date            as date,
    coalesce(vl.count, 0) as count
  from generate_series(
    current_date - (days_back - 1) * interval '1 day',
    current_date, 
    interval '1 day'
  ) as gs(d)
  left join public.visitor_logs vl on vl.date = gs.d::date
  order by gs.d asc;
$$ language sql;

-- 댓글 (GitHub OAuth 로그인 후 작성)
create table public.comments (
  id             uuid default gen_random_uuid() primary key,
  post_slug      text not null,
  user_id        uuid not null references auth.users(id) on delete cascade,
  content        text not null check (char_length(trim(content)) > 0 and char_length(content) <= 2000),
  author_name    text not null,
  author_avatar  text,
  author_github  text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create index comments_post_slug_idx on public.comments (post_slug, created_at);

alter table public.comments enable row level security;

create policy "Comments are viewable by everyone"
  on public.comments for select
  using (true);

create policy "Authenticated users can insert their own comments"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own comments"
  on public.comments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on public.comments for delete
  using (auth.uid() = user_id);

-- 글 본문 이미지 Storage
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

create policy "Public can read post images"
  on storage.objects for select
  using (bucket_id = 'post-images');

create policy "Author can upload post images"
  on storage.objects for insert
  with check (
    bucket_id = 'post-images'
    and (auth.jwt() ->> 'email') = 'gse06044@naver.com'
  );

create policy "Author can update post images"
  on storage.objects for update
  using (
    bucket_id = 'post-images'
    and (auth.jwt() ->> 'email') = 'gse06044@naver.com'
  );

create policy "Author can delete post images"
  on storage.objects for delete
  using (
    bucket_id = 'post-images'
    and (auth.jwt() ->> 'email') = 'gse06044@naver.com'
  );

-- 카드 썸네일 이미지
alter table public.posts add column if not exists thumbnail_url text;
