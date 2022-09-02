
export interface Stations {
    [key: string]: Station;
}

export interface Station {
    type: Type;
    id: string;
    name: string;
    location: Location;
    weight: number;
    stops: Stop[];
}
export interface Stop {
    type: Type;
    id: string;
    name: string;
    station: string;
    location: Location;
}

export interface Location {
    type: Type;
    latitude: number;
    longitude: number;
}

enum Type {
    Station = "station",
    Stop = "stop",
    Location = "location"
}