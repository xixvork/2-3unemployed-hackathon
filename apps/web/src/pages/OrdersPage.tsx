import { useEffect, useMemo, useState } from "react";
import type { CreateOrderInput, Order } from "@hackathon/shared";
import { apiClient } from "../api/client";
import { CsvImport } from "../components/CsvImport";
import { OrderCreateForm } from "../components/OrderCreateForm";
import { OrdersTable } from "../components/OrdersTable";

const DEFAULT_LIMIT = 10;

export const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const query = useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined
    }),
    [page, limit, search, dateFrom, dateTo]
  );

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiClient.listOrders(query);
      setOrders(data.items);
      setTotal(data.total);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Failed to load orders.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, [query]);

  const handleCreate = async (payload: CreateOrderInput) => {
    await apiClient.createOrder(payload);
    await loadOrders();
  };

  const handleImport = async (file: File) => {
    await apiClient.importOrders(file);
    await loadOrders();
  };

  return (
    <>
      <header className="hero">
        <div>
          <span className="badge">WEB Dev. Test Task</span>
          <h1 className="hero-title">Orders Admin</h1>
          <p className="hero-subtitle">
            CSV import, manual creation and paginated list with filters for NY tax calculation flow.
          </p>
        </div>
      </header>

      <section className="panel stack" style={{ marginBottom: "18px" }}>
        <h2 className="panel-title">Filters</h2>
        <div className="inline-grid">
          <div className="field">
            <label htmlFor="filter-search">Search</label>
            <input
              id="filter-search"
              placeholder="By order id or timestamp"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="filter-limit">Rows per page</label>
            <select
              id="filter-limit"
              value={String(limit)}
              onChange={(event) => {
                setPage(1);
                setLimit(Number(event.target.value));
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        <div className="inline-grid">
          <div className="field">
            <label htmlFor="filter-date-from">Date from</label>
            <input
              id="filter-date-from"
              type="datetime-local"
              value={dateFrom}
              onChange={(event) => {
                setPage(1);
                setDateFrom(event.target.value);
              }}
            />
          </div>

          <div className="field">
            <label htmlFor="filter-date-to">Date to</label>
            <input
              id="filter-date-to"
              type="datetime-local"
              value={dateTo}
              onChange={(event) => {
                setPage(1);
                setDateTo(event.target.value);
              }}
            />
          </div>
        </div>
      </section>

      <div className="layout">
        <aside className="stack">
          <CsvImport onImport={handleImport} />
          <OrderCreateForm onSubmit={handleCreate} />

          <section className="panel stack">
            <h2 className="panel-title">Checklist</h2>
            <ul className="meta-list">
              <li>Frontend scaffold: React + TypeScript + Vite.</li>
              <li>CSV import entrypoint wired to backend.</li>
              <li>Manual order form with validation.</li>
              <li>Orders list with filters and pagination.</li>
            </ul>
          </section>
        </aside>

        <section className="stack">
          {error ? <div className="alert error">{error}</div> : null}
          <OrdersTable
            orders={orders}
            page={page}
            total={total}
            limit={limit}
            isLoading={isLoading}
            onPageChange={setPage}
          />
        </section>
      </div>
    </>
  );
};
