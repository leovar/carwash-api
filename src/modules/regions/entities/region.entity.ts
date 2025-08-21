export interface Municipality {
  name: string;
}

export interface Region {
  id?: string;
  country: string;
  municipalities: Municipality[];
  name: string;
}
