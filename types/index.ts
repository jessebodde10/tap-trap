export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  screens: number;
  hasTerrace: boolean;
  hasLargeScreen: boolean;
  openHour: number;
  closeHour: number;
}

export interface Filters {
  nuOpen: boolean;
  grootScherm: boolean;
  nachtOpen: boolean;
}

export type FlyToTarget = { coords: [number, number]; zoom: number } | null;
