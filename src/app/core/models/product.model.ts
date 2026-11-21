export interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface ProductBrand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface ProductSubcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

export interface Product {
  _id: string;
  id?: string;
  sold: number;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  imageCover: string;
  images: string[];
  subcategory?: ProductSubcategory[];
  category: ProductCategory;
  brand: ProductBrand;
  ratingsAverage: number;
  ratingsQuantity: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  priceAfterDiscount?: number;
  availableColors?: string[];
}

export interface ProductsMetadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
  prevPage?: number;
}

export interface ProductsResponse {
  results: number;
  metadata: ProductsMetadata;
  data: Product[];
}

export interface ProductResponse {
  data: Product;
}
