export interface Table {
  readonly id: string;
  readonly number: number;
  readonly qrToken: string;
}

export interface Restaurant {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly tagline?: string;
  readonly currency: string;
  readonly tables: readonly Table[];
}
