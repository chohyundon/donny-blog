export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  thumbnail_color: string
  thumbnail_accent: string
  thumbnail_url: string | null
  tag: string
  published_at: string
  likes: number
  comments_count: number
  read_time: number
  published: boolean
  created_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  color: string
}

export interface Comment {
  id: string
  post_slug: string
  user_id: string
  content: string
  author_name: string
  author_avatar: string | null
  author_github: string | null
  created_at: string
  updated_at: string
}

export interface CommentAuthor {
  id: string
  name: string
  avatarUrl: string | null
  github: string | null
}
