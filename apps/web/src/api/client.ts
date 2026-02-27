import type {
  CreateOrderInput,
  CreateOrderResponse,
  ImportOrdersResponse,
  OrdersListQuery,
  OrdersListResponse
} from "@hackathon/shared";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type RequestInitWithJson = Omit<RequestInit, "body"> & {
  body?: unknown;
};

const request = async <T>(path: string, init?: RequestInitWithJson): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers ?? {})
    },
    body: init?.body ? JSON.stringify(init.body) : undefined
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(payload || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

const buildOrdersQuery = (params: OrdersListQuery) => {
  const query = new URLSearchParams();

  query.set("page", String(params.page));
  query.set("limit", String(params.limit));

  if (params.search) query.set("search", params.search);
  if (params.dateFrom) query.set("dateFrom", params.dateFrom);
  if (params.dateTo) query.set("dateTo", params.dateTo);

  return query.toString();
};

export const apiClient = {
  listOrders: (params: OrdersListQuery) => {
    return request<OrdersListResponse>(`/orders?${buildOrdersQuery(params)}`);
  },

  createOrder: (payload: CreateOrderInput) => {
    return request<CreateOrderResponse>("/orders", {
      method: "POST",
      body: payload
    });
  },

  importOrders: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/orders/import`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const payload = await response.text();
      throw new Error(payload || `Request failed: ${response.status}`);
    }

    return (await response.json()) as ImportOrdersResponse;
  }
};
