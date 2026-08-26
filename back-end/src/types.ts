import type {
  ColumnType,
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable,
} from "kysely";

export interface Database {
  reservations: ReservationsTable;
  tables: TablesTable;
}

export interface ReservationsTable {
  reservation_id: Generated<number>;
  first_name: string;
  last_name: string;
  mobile_number: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  status: Generated<"booked" | "seated" | "finished" | "cancelled">;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export type Reservation = Selectable<ReservationsTable>;
export type NewReservation = Insertable<ReservationsTable>;
export type UpdatedReservation = Updateable<ReservationsTable>;

export interface TablesTable {
  table_id: Generated<number>;
  table_name: string;
  capacity: number;
  reservation_id: number | null;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export type Table = Selectable<TablesTable>;
export type NewTable = Insertable<TablesTable>;
export type UpdatedTable = Updateable<TablesTable>;
