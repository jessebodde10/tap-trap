"use server";

import fs from "fs";
import path from "path";

export interface NewLocationInput {
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

export async function addLocation(data: NewLocationInput) {
  const filePath = path.join(process.cwd(), "data", "locations.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const locations = JSON.parse(raw);

  const newLocation = {
    id: String(Date.now()),
    ...data,
  };

  locations.push(newLocation);
  fs.writeFileSync(filePath, JSON.stringify(locations, null, 2), "utf-8");

  return { success: true, location: newLocation };
}
