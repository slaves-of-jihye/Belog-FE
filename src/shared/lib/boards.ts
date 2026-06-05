import { BoardType } from '../../entities/post/model/types';

export interface BoardCategory {
  id: BoardType;
  name: string;
  description: string;
}

export const boardCategories: BoardCategory[] = [
  { id: 'major', name: '전공 게시판', description: '전공 관련 자료 및 정보를 공유합니다.' },
  { id: 'general', name: '일반과목 게시판', description: '교양 및 일반 과목 자료를 공유합니다.' },
  { id: 'free', name: '자유 게시판', description: '자유롭게 의견을 나누는 공간입니다.' },
  { id: 'project', name: '사이드 프로젝트', description: '사이드 프로젝트 팀원 모집 및 정보 공유' },
];

export function getBoardCategory(boardType: BoardType) {
  return boardCategories.find((category) => category.id === boardType) || boardCategories[2];
}
