export type Gender = "male" | "female";
export type CalendarType = "solar" | "lunar";
export type TimeAccuracy = "exact" | "shichen" | "period" | "unknown";
export type Shichen = "zi" | "chou" | "yin" | "mao" | "chen" | "si" | "wu" | "wei" | "shen" | "you" | "xu" | "hai";
export type BirthPeriod = "lateNight" | "earlyMorning" | "morning" | "noon" | "afternoon" | "evening";

export interface BirthInfo {
  gender: Gender | "";
  calendarType: CalendarType;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  isLeapMonth: boolean;
  timeAccuracy: TimeAccuracy;
  birthHour?: number;
  birthMinute?: number;
  birthShichen?: Shichen;
  birthPeriod?: BirthPeriod;
  birthCountry: string;
  birthProvince: string;
  birthCity: string;
  birthDistrict?: string;
  timezone: string;
  longitude?: number;
  latitude?: number;
  useTrueSolarTime: boolean;
  focusAreas: string[];
  disclaimerAccepted: boolean;
}

