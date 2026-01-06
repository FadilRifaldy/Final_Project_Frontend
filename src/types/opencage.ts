export interface OpenCageGeometry {
  lat: number;
  lng: number;
}

export interface OpenCageComponents {
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  postcode?: string;
}

export interface IOpenCageSuggestion {
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  };
  components: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
  };
};
