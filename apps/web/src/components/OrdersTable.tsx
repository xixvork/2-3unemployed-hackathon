import type { Order } from "@hackathon/shared";

type OrdersTableProps = {
  orders: Order[];
  page: number;
  total: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (nextPage: number) => void;
};

const formatMoney = (value: number) => `$${value.toFixed(2)}`;

export const OrdersTable = ({ orders, page, total, limit, isLoading, onPageChange }: OrdersTableProps) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <section className="panel stack">
      <h2 className="panel-title">Orders List</h2>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Timestamp</th>
              <th>Coordinates</th>
              <th>Subtotal</th>
              <th>Tax Rate</th>
              <th>Tax Amount</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7}>Loading orders...</td>
              </tr>
            ) : null}

            {!isLoading && orders.length === 0 ? (
              <tr>
                <td className="table-empty" colSpan={7}>
                  No orders found for current filters.
                </td>
              </tr>
            ) : null}

            {!isLoading
              ? orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{new Date(order.timestamp).toLocaleString()}</td>
                    <td>
                      {order.latitude}, {order.longitude}
                    </td>
                    <td>{formatMoney(order.subtotal)}</td>
                    <td>{(order.composite_tax_rate * 100).toFixed(3)}%</td>
                    <td>{formatMoney(order.tax_amount)}</td>
                    <td>{formatMoney(order.total_amount)}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>

      <div className="pager">
        <div className="pager-group">
          <button className="btn-ghost" onClick={() => onPageChange(1)} disabled={page <= 1}>
            First
          </button>
          <button className="btn-ghost" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
            Prev
          </button>
        </div>

        <div>
          Page {page} / {totalPages} · Total records: {total}
        </div>

        <div className="pager-group">
          <button className="btn-ghost" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
            Next
          </button>
          <button className="btn-ghost" onClick={() => onPageChange(totalPages)} disabled={page >= totalPages}>
            Last
          </button>
        </div>
      </div>
    </section>
  );
};
