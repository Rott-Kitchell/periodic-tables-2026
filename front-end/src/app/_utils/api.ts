import { formatReservation } from "./date-time";
import { Reservation, Table } from "./definitions";

const API_URL = process.env.API_BASE_URL || "http://localhost:5000";

const headers = new Headers({
  "Content-Type": "application/json",
});

async function fetchJson<T>(
  url: string | URL,
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

    return Promise.resolve(onCancel as T);
  }
}

export async function listReservations(
  params: Record<string, string | number>,
  signal?: AbortSignal,
): Promise<Reservation[]> {
  const url = new URL(`${API_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value.toString());
    }
  });
  return await fetchJson<Reservation[]>(url, { headers, signal }, []).then(
    (data) => formatReservation(data),
  );
}

export async function createReservation(
  data: Omit<Reservation, "reservation_id" | "status">,
  signal?: AbortSignal,
): Promise<Reservation> {
  const url = new URL(`${API_URL}/reservations`);
  const options: RequestInit = {
    method: "POST",
    headers,
    body: JSON.stringify({ data }),
    signal,
  };
  return await fetchJson<Reservation>(url, options);
}

export async function listTables(signal?: AbortSignal): Promise<Table[]> {
  const url = new URL(`${API_URL}/tables`);
  return await fetchJson<Table[]>(url, { headers, signal }, []);
}

export async function seatResAtTable(
  table_id: number,
  reservation_id: number,
): Promise<Table> {
  const url = `${API_URL}/tables/${table_id}/seat`;
  const options: RequestInit = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { reservation_id } }),
  };
  return await fetchJson<Table>(url, options);
}

export async function createTable(
  data: Omit<Table, "table_id" | "reservation_id">,
  signal?: AbortSignal,
): Promise<Table> {
  const url = `${API_URL}/tables`;
  const options: RequestInit = {
    method: "POST",
    headers,
    body: JSON.stringify({ data }),
    signal,
  };
  return await fetchJson<Table>(url, options);
}

export async function readReservation(
  reservationId: number,
  signal?: AbortSignal,
): Promise<Reservation> {
  const url = `${API_URL}/reservations/${reservationId}`;
  return await fetchJson<Reservation>(url, { signal }).then(formatReservation);
}

export async function freeUpTable(
  table_id: number,
  signal?: AbortSignal,
): Promise<Record<string, never>> {
  const url = `${API_URL}/tables/${table_id}/seat`;
  const options: RequestInit = { method: "DELETE", signal };
  return await fetchJson<Record<string, never>>(url, options);
}

export async function changeReservationStatus(
  reservation_id: number,
  status: Reservation["status"],
  signal?: AbortSignal,
): Promise<Reservation> {
  const url = `${API_URL}/reservations/${reservation_id}/status`;
  const options: RequestInit = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status } }),
    signal,
  };
  return await fetchJson<Reservation>(url, options).then(formatReservation);
}

export async function updateReservation(
  data: Reservation,
  signal?: AbortSignal,
): Promise<Reservation> {
  const url = `${API_URL}/reservations/${data.reservation_id}`;
  const options: RequestInit = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data }),
    signal,
  };
  return await fetchJson<Reservation>(url, options).then(formatReservation);
}
