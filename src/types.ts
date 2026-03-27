export interface LayoutProps {
  title?: string;
  description?: string;
  templateClass?: string;
  header?: string;
}

export interface PostLink {
  permalink: string;
  title?: string;
}

export interface BlogrollItem {
  name: string;
  url: string;
}
