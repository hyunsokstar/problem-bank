import {
  LayoutDashboard,
  Settings,
  Users,
  BookOpen,
  BookMarked,
  FolderPlus,
  GraduationCap,
  LineChart,
  BookText,
  CalendarDays,
  Layers,
  ListTree,
  GaugeCircle,
  ClipboardList,  // 시험장 목록용
  Calendar,       // 시험 일정용
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
  subMenus?: MenuItem[];
  parent?: MenuItem;  // optional parent reference
}

export const headerMenus: MenuItem[] = [
  {
    href: '/dashboard',
    label: '대시보드',
    icon: LayoutDashboard,
  },
  {
    href: '/manage',
    label: '기본 정보 관리',
    icon: Settings,
    subMenus: [
      {
        href: '/manage/subjects',
        label: '과목 관리',
        icon: BookText,
      },
      {
        href: '/manage/grades',
        label: '학년 관리',
        icon: GraduationCap,
      },
      {
        href: '/manage/semesters',
        label: '학기 관리',
        icon: CalendarDays,
      },
      {
        href: '/manage/chapters',
        label: '챕터 관리',
        icon: Layers,
      },
      {
        href: '/manage/subchapters',
        label: '서브챕터 관리',
        icon: ListTree,
      },
      {
        href: '/manage/levels',
        label: '난이도 관리',
        icon: GaugeCircle,
      },
    ],
  },
  {
    href: '/problems',
    label: '문제 관리',
    icon: BookOpen,
    subMenus: [
      {
        href: '/problems/create',
        label: '문제 등록',
        icon: FolderPlus,
      },
      {
        href: '/problems/bank',
        label: '문제 은행',
        icon: BookMarked,
      },
    ],
  },
  {
    href: '/students',
    label: '학생 관리',
    icon: Users,
  },
  {
    href: '/exams',
    label: '시험 참가',
    icon: GraduationCap,
    subMenus: [
      {
        href: '/exams/locations',
        label: '시험장 목록',
        icon: ClipboardList,
      },
      {
        href: '/exams/schedule',
        label: '시험 일정 확인',
        icon: Calendar,
      },
    ],
  },
];