export interface Category {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly sortOrder: number;
}

export interface Product {
  readonly id: string;
  readonly categoryId: string;
  readonly name: string;
  readonly description?: string;
  readonly price: number;
  readonly available: boolean;
  readonly emoji?: string;
}
