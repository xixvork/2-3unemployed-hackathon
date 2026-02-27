import { useState } from "react";
import type { ChangeEvent } from "react";

type CsvImportProps = {
  onImport: (file: File) => Promise<void>;
};

export const CsvImport = ({ onImport }: CsvImportProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatus(null);

    try {
      await onImport(file);
      setStatus(`CSV imported: ${file.name}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "CSV import failed");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <section className="panel stack">
      <h2 className="panel-title">Import CSV</h2>
      <div className="file-input">
        <input type="file" accept=".csv,text/csv" onChange={handleFileChange} disabled={isUploading} />
        <p className="file-hint">Supported: CSV with latitude, longitude, subtotal, timestamp.</p>
      </div>

      {isUploading ? <div className="alert info">Uploading and processing CSV...</div> : null}
      {status ? <div className="alert success">{status}</div> : null}
    </section>
  );
};
