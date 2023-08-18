import { Sizes, Categoria } from '@interfaces';

export interface Product {
  id: number;
  attributes: ProductAttributes;
}

interface Format {
  id: number;
  attributes: {
    name: string;
    hash: string;
    ext: string;
    mime: string;
    path: string | null;
    width: number;
    height: number;
    size: number;
    url: string;
    provider_metadata: {
      public_id: string;
      resource_type: string;
    };
    createdAt: string;
    updatedAt: string;
  };
}

interface ThumbnailData {
  data: Format & {
    alternativeText: string | null;
    caption: string | null;
    previewUrl: string | null;
    provider: string;
  };
}

interface CategoryData {
  data: Categoria;
}

type GaleryData = ThumbnailData;

interface ProductAttributes {
  title: string;
  description: string;
  price: number;
  highlight: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  thumbnail: ThumbnailData;
  gallery: GaleryData;
  categoria: CategoryData;
  sizes: Sizes[];
}
