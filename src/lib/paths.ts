export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export function asset(path: string) { return basePath && (path===basePath||path.startsWith(basePath+'/')) ? path : path.startsWith('/') ? `${basePath}${path}` : path; }
export function absoluteURL(path: string) { return `https://yumizhi.github.io${asset(path)}`; }
