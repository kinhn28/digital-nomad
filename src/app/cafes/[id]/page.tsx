'use client';

import { useEffect, useState, useRef, use } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const FEATURE_TAGS = ['🔌 콘센트 넉넉함', '📶 기가 와이파이', '🤫 조용한 분위기', '🪑 좌석 편함', '☕ 커피 맛집'];

export default function CafeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [cafe, setCafe] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(1);
  const [isSending, setIsSending] = useState(false);
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewContent, setReviewContent] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fetchCafe = async () => {
      const { data, error } = await supabase.from('cafes').select('*').eq('id', id).maybeSingle();
      if (error) {
        console.error('카페 로딩 에러 세부:', error.message, error.details);
      } else if (data) {
        setCafe(data);
      } else {
        setCafe({ notFound: true });
      }
    };

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('cafe_id', id)
        .order('created_at', { ascending: true })
        .limit(50);
      if (!error && data) setMessages(data);
    };

    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('cafe_id', id)
        .order('created_at', { ascending: false });
      if (!error && data) setReviews(data);
    };

    fetchCafe();
    fetchMessages();
    fetchReviews();

    const channel = supabase.channel(`cafe_room_${id}`);

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const count = Object.keys(state).length;
        setOnlineUsers(Math.max(1, count));
      })
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `cafe_id=eq.${id}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, supabase]);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || isSending) return;
    
    setIsSending(true);
    const { error } = await supabase.from('chat_messages').insert({
      cafe_id: id,
      sender_name: '익명의 노마드',
      message: newMessage,
    });
    if (!error) setNewMessage('');
    setIsSending(false);
  };

  const toggleFeature = (tag: string) => {
    setSelectedFeatures(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim() || isSubmittingReview) return;
    
    setIsSubmittingReview(true);
    const { error } = await supabase.from('reviews').insert({
      cafe_id: id,
      content: reviewContent,
      features: selectedFeatures,
      user_id: null, // 익명 허용 시 nullable
    });
    
    if (!error) {
      setReviewContent('');
      setSelectedFeatures([]);
      setIsReviewModalOpen(false);
      // 낙관적 업데이트 생략하고 다시 패치
      const { data } = await supabase.from('reviews').select('*').eq('cafe_id', id).order('created_at', { ascending: false });
      if (data) setReviews(data);
    } else {
      alert('리뷰 작성에 실패했습니다: ' + error.message);
    }
    setIsSubmittingReview(false);
  };

  if (!cafe) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-200 rounded-full mb-4"></div>
          <div className="text-slate-500 font-bold">카페 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (cafe.notFound) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">해당 카페 정보를 찾을 수 없습니다 😢</h2>
          <p className="text-slate-500 mt-2">
            Supabase DB에 더미 데이터가 아직 없거나, <br/>
            RLS(읽기 권한)가 차단되었을 확률이 매우 높습니다.
          </p>
          <Link href="/" className="mt-6 inline-block px-5 py-2.5 bg-blue-500 hover:bg-blue-600 font-bold text-white rounded-xl transition-colors">
            지도 화면으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      {/* 1. Main Content Area (정보 & 리뷰) */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-700 hover:underline text-sm font-bold mb-6 inline-flex items-center gap-1 transition-colors">
          <span>←</span> 지도로 돌아가기
        </Link>
        
        <header className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-50"></div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">{cafe.name}</h1>
          <p className="text-slate-500 mt-2 font-medium">{cafe.address}</p>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="flex flex-col items-center justify-center bg-blue-50/80 px-6 py-5 rounded-2xl w-[140px] border border-blue-100/50">
              <span className="text-3xl mb-2 drop-shadow-sm">🔌</span>
              <span className="text-xs text-blue-600 font-bold mb-1">콘센트 접근성</span>
              <span className="text-2xl font-black text-blue-900">4.8<span className="text-sm font-medium text-blue-400">/5</span></span>
            </div>
            <div className="flex flex-col items-center justify-center bg-emerald-50/80 px-6 py-5 rounded-2xl w-[140px] border border-emerald-100/50">
              <span className="text-3xl mb-2 drop-shadow-sm">📶</span>
              <span className="text-xs text-emerald-600 font-bold mb-1">와이파이 강도</span>
              <span className="text-2xl font-black text-emerald-900">4.5<span className="text-sm font-medium text-emerald-400">/5</span></span>
            </div>
            <div className="flex flex-col items-center justify-center bg-purple-50/80 px-6 py-5 rounded-2xl w-[140px] border border-purple-100/50">
              <span className="text-3xl mb-2 drop-shadow-sm">🤫</span>
              <span className="text-xs text-purple-600 font-bold mb-1">소음도 평가</span>
              <span className="text-2xl font-black text-purple-900">2.0<span className="text-sm font-medium text-purple-400">/5</span></span>
            </div>
          </div>
        </header>

        {/* Reviews Section */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">유저 리뷰 <span className="text-blue-500 text-lg ml-1">{reviews.length}</span></h2>
            <button 
              onClick={() => setIsReviewModalOpen(true)}
              className="text-xs font-bold px-4 py-2.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors shadow-sm"
            >
              리뷰 작성하기 ✏️
            </button>
          </div>
          
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center p-8 text-slate-400 font-medium border border-dashed rounded-xl border-slate-200">
                아직 작성된 리뷰가 없습니다. 첫 리뷰를 작성해 보세요!
              </div>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="p-5 bg-slate-50/80 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                  {review.features && review.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {review.features.map((feature: string) => (
                        <span key={feature} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg shadow-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-[15px] text-slate-700 font-medium leading-relaxed">"{review.content}"</p>
                  <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 font-semibold">
                    <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">👤</div>
                    <span>익명의 노마드</span>
                    <span>·</span>
                    <span>{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* 2. Realtime Chat Sidebar */}
      <aside className="w-full md:w-[400px] bg-white border-l border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.05)] flex flex-col h-[50vh] md:h-screen z-10 shrink-0">
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="text-2xl drop-shadow-sm">💬</span> 실시간 채팅
            </h2>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-indigo-100 text-indigo-600 text-[11px] font-black rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              {onlineUsers}명 접속 중
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">현재 이 카페에 모인 분들과 자유롭게 대화해보세요.</p>
        </div>
        
        <div className="flex-1 p-5 overflow-y-auto bg-[#F8FAFC] space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-slate-400 text-xs mt-10 font-medium">채팅 내역이 없습니다. 인사를 건네보세요!</div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={msg.id || idx} className="flex flex-col items-start group">
              <div className="flex items-center gap-2 mb-1.5 ml-1">
                <span className="text-[11px] font-bold text-slate-600">{msg.sender_name}</span>
                <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl rounded-tl-sm text-[13px] text-slate-700 shadow-sm max-w-[90%] font-medium break-words">
                {msg.message}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="메시지를 입력하세요..." 
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all font-medium bg-slate-50 focus:bg-white"
            />
            <button 
              type="submit" 
              disabled={isSending || !newMessage.trim()}
              className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
            >
              전송
            </button>
          </form>
        </div>
      </aside>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-800">이 카페는 어떠셨나요? ✍️</h2>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl font-light">&times;</button>
            </div>
            
            <form onSubmit={submitReview} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-3">어떤 점이 좋았나요? (다중 선택)</label>
                <div className="flex flex-wrap gap-2">
                  {FEATURE_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleFeature(tag)}
                      className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors border ${
                        selectedFeatures.includes(tag)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-3">상세한 리뷰를 남겨주세요</label>
                <textarea 
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="디지털 노마드들에게 유용한 정보(콘센트 위치, 눈치 보임 정도 등)를 공유해 주세요!"
                  className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium resize-none bg-slate-50 focus:bg-white"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmittingReview || !reviewContent.trim()}
                className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white rounded-xl text-base font-black transition-colors shadow-sm"
              >
                {isSubmittingReview ? '등록 중...' : '리뷰 등록하기'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
