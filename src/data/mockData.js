const today = new Date();
const addDays = (days) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString();
};
const subDays = (days) => {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

export const boardCategories = [
  { id: 'major', name: '전공 게시판', description: '전공 관련 자료 및 정보를 공유합니다.' },
  { id: 'general', name: '일반과목 게시판', description: '교양 및 일반 과목 자료를 공유합니다.' },
  { id: 'free', name: '자유 게시판', description: '자유롭게 의견을 나누는 공간입니다.' },
  { id: 'project', name: '사이드 프로젝트', description: '사이드 프로젝트 팀원 모집 및 정보 공유' },
];

export const mockPosts = [
  {
    id: 'post-1', category: 'major', title: '운영체제 중간고사 핵심 정리', type: 'markdown',
    content: '# 운영체제 중간고사 핵심 정리\n\n## 1. 프로세스와 스레드\n\n프로세스는 실행 중인 프로그램의 인스턴스입니다.\n\n### 프로세스 상태\n- **New**: 프로세스가 생성된 상태\n- **Ready**: CPU 할당을 기다리는 상태\n- **Running**: CPU에서 실행 중인 상태\n- **Waiting**: I/O 완료를 기다리는 상태\n\n## 2. CPU 스케줄링\n\n### Round Robin\n시간 할당량을 기반으로 순환 실행합니다.',
    authorId: 'user-1', authorName: '김민수', createdAt: subDays(2), updatedAt: subDays(2), views: 128, likes: 15,
  },
  {
    id: 'post-2', category: 'major', title: '데이터베이스 설계 실습 자료', type: 'file',
    content: '', fileName: 'DB_설계_실습자료.pdf', fileSize: '2.4MB',
    authorId: 'user-2', authorName: '이지현', createdAt: subDays(5), updatedAt: subDays(5), views: 89, likes: 10,
  },
  {
    id: 'post-3', category: 'major', title: '알고리즘 강의 정리 블로그', type: 'link',
    content: '', linkUrl: 'https://example-blog.tistory.com/algorithm-notes',
    linkTitle: '알고리즘 핵심 개념 정리', linkDescription: '그래프, DP, 그리디 알고리즘 핵심 개념 정리',
    authorId: 'user-3', authorName: '박서준', createdAt: subDays(1), updatedAt: subDays(1), views: 56, likes: 8,
  },
  {
    id: 'post-4', category: 'general', title: '영어회화 기말 스크립트 모음', type: 'markdown',
    content: '# 영어회화 기말 스크립트\n\n## Topic 1: Environmental Issues\n\n**Q: What do you think about climate change?**\n\nClimate change is one of the most pressing issues of our time...',
    authorId: 'user-2', authorName: '이지현', createdAt: subDays(3), updatedAt: subDays(3), views: 67, likes: 12,
  },
  {
    id: 'post-5', category: 'general', title: '통계학 공식 정리 PDF', type: 'file',
    content: '', fileName: '통계학_공식정리.pdf', fileSize: '1.8MB',
    authorId: 'user-1', authorName: '김민수', createdAt: subDays(7), updatedAt: subDays(7), views: 104, likes: 20,
  },
  {
    id: 'post-6', category: 'free', title: '다음 주 스터디 모임 공지', type: 'markdown',
    content: '# 📢 스터디 모임 공지\n\n**일시**: 다음 주 월요일 오후 7시\n**장소**: 중앙도서관 3층 스터디룸 B\n**주제**: 코딩 테스트 대비\n\n참여 희망하시는 분은 댓글 남겨주세요!',
    authorId: 'user-3', authorName: '박서준', createdAt: subDays(1), updatedAt: subDays(1), views: 45, likes: 6,
  },
  {
    id: 'post-7', category: 'free', title: '학식 맛집 추천', type: 'markdown',
    content: '# 이번 주 학식 추천 메뉴 🍽️\n\n## 월요일\n- 돈까스 정식 (강추!)\n\n## 화요일\n- 김치찌개 + 계란말이',
    authorId: 'user-1', authorName: '김민수', createdAt: subDays(4), updatedAt: subDays(4), views: 112, likes: 25,
  },
  {
    id: 'post-8', category: 'project', title: '할일 관리 앱 팀원 모집', type: 'markdown',
    content: '# 🚀 사이드 프로젝트 팀원 모집\n\n## 프로젝트 소개\nReact + Node.js 기반 할일 관리 앱\n\n## 모집 인원\n- 프론트엔드: 2명\n- 백엔드: 1명\n- 디자이너: 1명',
    authorId: 'user-2', authorName: '이지현', createdAt: subDays(2), updatedAt: subDays(2), views: 78, likes: 14,
  },
  {
    id: 'post-9', category: 'project', title: '오픈소스 기여 가이드 모음', type: 'link',
    linkUrl: 'https://opensource.guide/ko/', linkTitle: '오픈소스 가이드',
    linkDescription: '오픈소스 프로젝트에 기여하는 방법 종합 가이드', content: '',
    authorId: 'user-3', authorName: '박서준', createdAt: subDays(6), updatedAt: subDays(6), views: 43, likes: 7,
  },
];

export const mockDeadlines = [
  { id: 'dl-1', title: '운영체제 과제 #3', description: '프로세스 스케줄링 시뮬레이터 구현', subject: '운영체제', dueDate: addDays(1), category: 'major', priority: 'high', completed: false },
  { id: 'dl-2', title: '데이터베이스 설계 보고서', description: 'ER 다이어그램 및 정규화 보고서', subject: '데이터베이스', dueDate: addDays(2), category: 'major', priority: 'high', completed: false },
  { id: 'dl-3', title: '영어 에세이 제출', description: 'Climate change 500자 에세이', subject: '영어회화', dueDate: addDays(3), category: 'general', priority: 'medium', completed: false },
  { id: 'dl-4', title: '알고리즘 퀴즈', description: '그래프 탐색 알고리즘 온라인 퀴즈', subject: '알고리즘', dueDate: addDays(0), category: 'major', priority: 'high', completed: false },
  { id: 'dl-5', title: '통계학 과제', description: '가설 검정 문제풀이', subject: '통계학', dueDate: addDays(5), category: 'general', priority: 'low', completed: false },
  { id: 'dl-6', title: '소프트웨어공학 팀 프로젝트', description: '요구사항 분석 문서 작성', subject: '소프트웨어공학', dueDate: addDays(7), category: 'major', priority: 'medium', completed: false },
  { id: 'dl-7', title: '컴퓨터네트워크 실습', description: '소켓 프로그래밍 실습 보고서', subject: '컴퓨터네트워크', dueDate: addDays(-1), category: 'major', priority: 'high', completed: true },
  { id: 'dl-8', title: '사이드 프로젝트 MVP', description: 'MVP 데모 발표', subject: '사이드 프로젝트', dueDate: addDays(2), category: 'project', priority: 'medium', completed: false },
];
