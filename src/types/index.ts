export interface OriginData {
  id: string;
  name: string;
  country: string;
  region: string;
  lat: number;
  lng: number;
  altitude: string;
  process: string;
  varietal: string;
  harvest: string;
  flavorNotes: string[];
  acidity: number; // 1-10
  body: number; // 1-10
  sweetness: number; // 1-10
  description: string;
  color: string;
}

export interface RoastStage {
  id: string;
  name: string;
  turkishName: string;
  tempC: number;
  durationMin: number;
  beanColor: string;
  beanRoughness: number;
  beanGloss: number;
  description: string;
  flavorProfile: {
    acidity: number;
    body: number;
    sweetness: number;
    aroma: number;
    intensity: number;
    bitterness: number;
  };
  rorCurve: number[]; // Rate of rise points
}

export interface ProductItem {
  id: string;
  name: string;
  tagline: string;
  category: 'espresso' | 'turkish' | 'filter' | 'specialty';
  origin: string;
  roastLevel: 'Light' | 'Medium-Light' | 'Medium' | 'Medium-Dark' | 'Dark';
  tastingNotes: string[];
  intensity: number; // 1-10
  acidity: number; // 1-10
  body: number; // 1-10
  sweetness: number; // 1-10
  prices: {
    '250g': number;
    '500g': number;
    '1000g': number;
  };
  pouchColor: string;
  accentColor: string;
  description: string;
  brewMethods: string[];
  bestFor: string;
  badge?: string;
}

export interface CartItem {
  product: ProductItem;
  size: '250g' | '500g' | '1000g';
  grind: 'Whole Bean' | 'Espresso' | 'Moka Pot' | 'Filter / V60' | 'French Press' | 'Turkish';
  quantity: number;
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  number: string;
}
