import React, { createContext, ReactNode, useContext, useState } from "react";
import initialDates from "../data/dates.json";

export interface IDate {
  id: number;
  tag?: string;
  angle: number;
  from: number;
  to: number;
  years: {
    year: number;
    event: string;
  }[];
}

interface DatesContextType {
  dates: IDate[];
  setDates: React.Dispatch<React.SetStateAction<IDate[]>>;
  activeDate: number;
  setActiveDate: React.Dispatch<React.SetStateAction<number>>;
  startAngle: number;
}

const DatesContext = createContext<DatesContextType | undefined>(undefined);

export const useDatesContext = () => {
  const context = useContext(DatesContext);
  if (!context) {
    throw new Error(
      "useDatesContext должен использоваться внутри DatesProvider"
    );
  }
  return context;
};

export const DatesProvider = ({ children }: { children: ReactNode }) => {
  const baseAngle = 360 / initialDates.length;
  const startAngle = initialDates.length == 2 ? 45 : baseAngle / 2;
  const [dates, setDates] = useState<IDate[]>(
    initialDates.map((d, i) => ({
      ...d,
      angle: startAngle + baseAngle * i,
      from: d.years[0].year,
      to: d.years[d.years.length - 1].year,
    }))
  );
  const [activeDate, setActiveDate] = useState<number>(1);

  return (
    <DatesContext.Provider
      value={{
        dates,
        setDates,
        activeDate,
        setActiveDate,
        startAngle,
      }}
    >
      {children}
    </DatesContext.Provider>
  );
};
