export interface Reservation {
  reservation_id?: number;
  first_name: string;
  last_name: string;
  mobile_number: string;
  reservation_date: string; // YYYY-MM-DD
  reservation_time: string; // HH:MM
  party_size: number;
  status?: "booked" | "seated" | "finished" | "cancelled";
}

export interface Table {
  table_id?: number;
  table_name: string;
  capacity: number;
  reservation_id?: number | null;
}
