export interface Article {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  category?: number | null | undefined;
  documentId: string;
  createdAt: string;
}