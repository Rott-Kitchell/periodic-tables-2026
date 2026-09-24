import { Table, Reservation } from "./definitions";

export function asDateString(date: Date | string = new Date()): string {
  const target = typeof date === "string" ? new Date(date) : date;

  return target.toISOString().slice(0, 10);
}

export function formatAsDate(dateString: string | null | undefined): string {
  return dateString ? dateString.slice(0, 10) : today();
}

export function formatAsTime(timeString: string | null | undefined): string {
  return timeString ? timeString.slice(0, 5) : "";
}

export function today(): string {
  return asDateString(new Date());
}

export function previous(currentDate: string): string {
  // Appending 'T00:00:00' prevents unexpected timezone offset shifts
  const date = new Date(`${currentDate}T00:00:00`);
  date.setDate(date.getDate() - 1);
  return asDateString(date);
}

export function next(currentDate: string): string {
  const date = new Date(`${currentDate}T00:00:00`);
  date.setDate(date.getDate() + 1);
  return asDateString(date);
}

export function formatReservation(reservations: Reservation[]): Reservation[];
export function formatReservation(reservations: Reservation): Reservation;

export function formatReservation(reservations: Reservation | Reservation[]) {
  if (Array.isArray(reservations)) {
    return reservations.map((r) => {
      return {
        ...r,
        reservation_date: formatAsDate(r.reservation_date),
        reservation_time: formatAsTime(r.reservation_time),
      };
    });
  }
  return {
    ...reservations,
    reservation_date: formatAsDate(reservations.reservation_date),
    reservation_time: formatAsTime(reservations.reservation_time),
  };
}
