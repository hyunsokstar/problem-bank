import { headerMenus } from "@/widgets/header/model/header-menus";
import { MenuItem, BreadcrumbItem } from "./types";

// 메뉴의 첫 번째 서브메뉴 경로 찾기
// const getDefaultSubPath = (path: string) => {
//     const menu = headerMenus.find(item => item.href === path);
//     return menu?.subMenus?.[0]?.href;
// };
const getDeepestSubPath = (menu: MenuItem | null): string | undefined => {
    while (menu?.subMenus?.length) {
        menu = menu.subMenus[0]; // ✅ 가장 첫 번째 서브메뉴로 내려감
    }
    return menu?.href;
};

// 해당 경로의 메뉴 아이템 찾기
const findMenuItem = (path: string): MenuItem | null => {
    for (const menu of headerMenus) {
        if (menu.href === path) return menu;
        const subMenu = menu.subMenus?.find(sub => sub.href === path);
        if (subMenu) return subMenu;
    }
    return null;
};

// Breadcrumbs 리스트 생성
export const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {

    //   if (pathname === "/") return [];

    const paths = pathname.split("/").filter(Boolean);  // http://127.0.0.1:3000/exams/locations 일 경우 => ["exams", "locations"]
    let currentPath = "";
    let breadcrumbs: BreadcrumbItem[] = [];

    for (const segment of paths) {
        currentPath += `/${segment}`; // 순회돌면서 /exams, /exams/locations
        const item  = findMenuItem(currentPath);  

        // ✅ 부모 메뉴 추가 (중복 방지)
        // if (parent) { 
        //     breadcrumbs.push({
        //         href: parent.href,
        //         label: parent.label,
        //         defaultPath: getDefaultSubPath(parent.href),
        //         key: parent.href // 🔥 key 값을 href로 고정 (SSR과 CSR 일관성 유지)
        //     });
        // }

        // ✅ 현재 메뉴 추가 (중복 방지)
        if (item && !breadcrumbs.some(b => b.href === item.href)) {
            breadcrumbs.push({
                href: currentPath,
                label: item.label,
                defaultPath: getDeepestSubPath(item),
                key: item.href // 🔥 key 값을 href로 고정 (SSR과 CSR 일관성 유지)
            });
        }
    }

    return breadcrumbs;
};
