import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../entities/user/model/AuthProvider';
import { getMyPosts } from '../../../entities/post/api/postApi';
import { PostSummary } from '../../../entities/post/model/types';
import { formatDate } from '../../../shared/lib/dateUtils';
import { Button } from '../../../shared/ui/Button';
import { Eye } from 'lucide-react';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'likes' | 'comments'>('posts');
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getMyPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    }).catch(() => {
      setPosts([]);
      setLoading(false);
    });
  }, [user]);

  if (!user) {
    return (
      <EmptyState>
        <h2>로그인이 필요합니다.</h2>
        <Link to="/" style={{ color: 'var(--color-accent-primary)', marginTop: '16px', display: 'inline-block' }}>홈으로 가기</Link>
      </EmptyState>
    );
  }

  const myPosts = posts;
  const likedPosts: PostSummary[] = [];
  const commentedPosts: PostSummary[] = [];

  const getActivePosts = (): PostSummary[] => {
    if (activeTab === 'posts') return myPosts;
    if (activeTab === 'likes') return likedPosts;
    if (activeTab === 'comments') return commentedPosts;
    return [];
  };

  const activePosts = getActivePosts();

  const tabs = [
    { id: 'posts' as const, label: '작성한 글' },
    { id: 'likes' as const, label: '좋아요 한 글' },
    { id: 'comments' as const, label: '댓글 단 글' },
  ];

  return (
    <Container>
      <ProfileHeader>
        <ProfileInfo>
          <h1>내 프로필</h1>
          <ProfileSubtext>{user.nickname}</ProfileSubtext>
        </ProfileInfo>
        <Button variant="secondary" onClick={logout}>로그아웃</Button>
      </ProfileHeader>

      <StatsGrid>
        <StatCard>
          <StatNumber>{myPosts.length}</StatNumber>
          <StatLabel>작성한 글</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{likedPosts.length}</StatNumber>
          <StatLabel>좋아요 한 글</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{commentedPosts.length}</StatNumber>
          <StatLabel>댓글 단 글</StatLabel>
        </StatCard>
      </StatsGrid>

      <TabBar>
        {tabs.map((tab) => (
          <Tab key={tab.id} $active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </Tab>
        ))}
      </TabBar>

      <PostList>
        {loading && <EmptyText>로딩 중...</EmptyText>}
        {!loading && activePosts.length === 0 && <EmptyText>해당하는 게시물이 없습니다.</EmptyText>}
        {!loading && activePosts.map((post) => (
          <PostCard key={post.postId} to={`/post/${post.postId}`}>
            <PostCardBody>
              <PostCardTitle>{post.title}</PostCardTitle>
              <PostCardMeta>
                <span>{post.authorNickname}</span>
                <span>·</span>
                <span>{formatDate(post.createdAt)}</span>
              </PostCardMeta>
            </PostCardBody>
            <PostCardStats>
              <span><Eye size={14} /> {post.views}</span>
            </PostCardStats>
          </PostCard>
        ))}
      </PostList>
    </Container>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
`;

const ProfileInfo = styled.div`
  h1 {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    margin: 0 0 var(--space-2) 0;
  }
`;

const ProfileSubtext = styled.p`
  color: var(--color-text-secondary);
  margin: 0;
`;

const StatsGrid = styled.div`
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
`;

const StatCard = styled.div`
  flex: 1;
  padding: var(--space-6);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 32px;
  font-weight: var(--font-weight-bold);
  color: var(--color-accent-primary);
`;

const StatLabel = styled.div`
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-top: var(--space-2);
`;

const TabBar = styled.div`
  display: flex;
  gap: var(--space-6);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-6);
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: var(--space-3) 0;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid ${(p) => (p.$active ? 'var(--color-accent-primary)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)')};
  font-weight: ${(p) => (p.$active ? 'var(--font-weight-semibold)' : 'normal')};
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);

  &:hover {
    color: var(--color-text-primary);
  }
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const PostCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all var(--transition-fast);

  &:hover {
    transform: translateY(-2px);
    border-color: var(--color-border-hover);
    box-shadow: var(--shadow-sm);
  }
`;

const PostCardBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const PostCardTitle = styled.div`
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PostCardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
`;

const PostCardStats = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);

  span {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 0;

  h2 { color: var(--color-text-primary); }
`;

const EmptyText = styled.div`
  text-align: center;
  padding: var(--space-8);
  color: var(--color-text-tertiary);
`;
