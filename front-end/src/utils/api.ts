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

const API_URL = process.env.API_BASE_URL || "http://localhost:5000";

const headers = new Headers({
  "Content-Type": "application/json",
});

async function fetchJson<T>(
  url: string,
  options: RequestInit,
  onCancel?: T,
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null as T;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }

    return payload.data;
  } catch (error: any) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    // If the request was aborted, return the designated fallback value
    return onCancel ?? (Promise.resolve() as any);
  }
}
