-- 1. 카페 기본 정보 테이블
CREATE TABLE IF NOT EXISTS public.cafes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  kakao_place_url text,
  address text,
  has_parking boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. 업무 환경 지표 테이블
CREATE TABLE IF NOT EXISTS public.work_environments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cafe_id uuid REFERENCES public.cafes(id) ON DELETE CASCADE,
  plug_score double precision,
  wifi_score double precision,
  noise_level double precision,
  time_limit text,
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. 사용자 텍스트 리뷰 및 속성 테이블
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cafe_id uuid REFERENCES public.cafes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- 4. 실시간 채팅 메시지 기록 테이블
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cafe_id uuid REFERENCES public.cafes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- RLS(Row Level Security) 활성화
ALTER TABLE public.cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 카페 및 환경 정보: 누구나 읽기 가능, 인증된 사용자만 추가 가능
CREATE POLICY "Allow public read access to cafes" ON public.cafes FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert to cafes" ON public.cafes FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to work_environments" ON public.work_environments FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert to work_environments" ON public.work_environments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 리뷰와 채팅: 누구나 읽기 가능, 인증된 사용자만 작성 가능 (간단한 규칙 적용)
CREATE POLICY "Allow public read access to reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert to reviews" ON public.reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to chat_messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert to chat_messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- [중요] chat_messages 테이블을 Supabase Realtime으로 수신하기 위해 PUBLICATION 설정
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.chat_messages;
COMMIT;
