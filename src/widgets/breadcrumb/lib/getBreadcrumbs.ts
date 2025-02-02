import { headerMenus } from "@/widgets/header/model/header-menus";
import { MenuItem, BreadcrumbItem } from "./types";

// ✅ 항상 현재 경로를 유지하는 `defaultPath` 설정
const getDefaultPath = (currentPath: string, menu: MenuItem | null): string | undefined => {
    return currentPath; // ✅ 항상 현재 페이지 경로를 반환
};

// ✅ 해당 경로의 메뉴 아이템 찾기 (깊이 제한 없이 탐색)
const findMenuItem = (path: string, menus = headerMenus): MenuItem | null => {
    for (const menu of menus) {
        if (menu.href === path) return menu;
        if (menu.subMenus) {
            const found = findMenuItem(path, menu.subMenus);
            if (found) return found;
        }
    }
    return null;
};

// ✅ Breadcrumbs 리스트 생성
export const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    const paths = pathname.split("/").filter(Boolean); // 예: "/exams/schedule" → ["exams", "schedule"]
    let currentPath = "";
    let breadcrumbs: BreadcrumbItem[] = [];

    for (const segment of paths) {
        currentPath += `/${segment}`;
        const item = findMenuItem(currentPath);  

        if (item && !breadcrumbs.some(b => b.href === item.href)) {
            breadcrumbs.push({
                href: currentPath,
                label: item.label,
                defaultPath: getDefaultPath(pathname, item), // ✅ 항상 현재 페이지를 유지
                key: item.href
            });
        }
    }

    return breadcrumbs;
};
