import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { CreateOrderInput } from "@hackathon/shared";

type OrderCreateFormProps = {
  onSubmit: (payload: CreateOrderInput) => Promise<void>;
};

type FormState = {
  latitude: string;
  longitude: string;
  subtotal: string;
  timestamp: string;
};

const INITIAL_STATE: FormState = {
  latitude: "",
  longitude: "",
  subtotal: "",
  timestamp: ""
};

const isWithinNyRoughBounds = (lat: number, lon: number) => lat >= 40 && lat <= 46 && lon >= -80 && lon <= -71;

export const OrderCreateForm = ({ onSubmit }: OrderCreateFormProps) => {
  const [form, setForm] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsed = useMemo(() => {
    return {
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      subtotal: Number(form.subtotal)
    };
  }, [form.latitude, form.longitude, form.subtotal]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (Number.isNaN(parsed.latitude) || Number.isNaN(parsed.longitude) || Number.isNaN(parsed.subtotal)) {
      setError("Latitude, longitude and subtotal must be valid numbers.");
      return;
    }

    if (parsed.subtotal < 0) {
      setError("Subtotal must be non-negative.");
      return;
    }

    if (!isWithinNyRoughBounds(parsed.latitude, parsed.longitude)) {
      setError("Coordinates look outside New York State bounds.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        latitude: parsed.latitude,
        longitude: parsed.longitude,
        subtotal: parsed.subtotal,
        timestamp: form.timestamp
      });

      setForm(INITIAL_STATE);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to create order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="panel stack">
      <h2 className="panel-title">Manual Create</h2>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="inline-grid">
          <div className="field">
            <label htmlFor="manual-latitude">Latitude</label>
            <input
              id="manual-latitude"
              type="number"
              step="any"
              value={form.latitude}
              onChange={(event) => setForm((prev) => ({ ...prev, latitude: event.target.value }))}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="manual-longitude">Longitude</label>
            <input
              id="manual-longitude"
              type="number"
              step="any"
              value={form.longitude}
              onChange={(event) => setForm((prev) => ({ ...prev, longitude: event.target.value }))}
              required
            />
          </div>
        </div>

        <div className="inline-grid">
          <div className="field">
            <label htmlFor="manual-subtotal">Subtotal</label>
            <input
              id="manual-subtotal"
              type="number"
              step="0.01"
              min="0"
              value={form.subtotal}
              onChange={(event) => setForm((prev) => ({ ...prev, subtotal: event.target.value }))}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="manual-timestamp">Timestamp</label>
            <input
              id="manual-timestamp"
              type="datetime-local"
              value={form.timestamp}
              onChange={(event) => setForm((prev) => ({ ...prev, timestamp: event.target.value }))}
              required
            />
          </div>
        </div>

        <button className="btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Order"}
        </button>
      </form>

      {error ? <div className="alert error">{error}</div> : null}
    </section>
  );
};
