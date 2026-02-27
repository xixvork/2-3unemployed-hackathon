# API Contract (Task 1.4)

This document defines and freezes the JSON contract for:
- `GET /orders`
- `POST /orders`
- `POST /orders/import`

## Scope

- Runtime calls to third-party APIs are not allowed.
- Server computes tax from locally stored/imported datasets.
- Delivery point is expected to be within New York State.

## Conventions

- Base path: `/orders`
- Content type: `application/json` for JSON endpoints.
- Money and tax rates are returned as strings to avoid floating-point rounding issues.
- Timestamps use ISO-8601 UTC format (example: `2026-02-27T10:00:00Z`).

## Order Object

```json
{
  "id": 123,
  "latitude": 40.7128,
  "longitude": -74.006,
  "subtotal": "49.99",
  "timestamp": "2026-02-27T10:00:00Z",
  "composite_tax_rate": "0.08875",
  "tax_amount": "4.44",
  "total_amount": "54.43",
  "breakdown": {
    "state_rate": "0.04000",
    "county_rate": "0.00000",
    "city_rate": "0.04500",
    "special_rates": "0.00375"
  },
  "jurisdictions": {
    "country": "US",
    "state": "NY",
    "county": "New York",
    "city": "New York"
  },
  "created_at": "2026-02-27T10:00:01Z"
}
```

## POST /orders

Creates one order, computes tax immediately, persists the result.

### Content Types

- Request: `application/json`
- Response: `application/json`

### Request Body

```json
{
  "latitude": 40.7128,
  "longitude": -74.006,
  "subtotal": "49.99",
  "timestamp": "2026-02-27T10:00:00Z"
}
```

### Success Response

- Status: `201 Created`

```json
{
  "data": {
    "id": 123,
    "latitude": 40.7128,
    "longitude": -74.006,
    "subtotal": "49.99",
    "timestamp": "2026-02-27T10:00:00Z",
    "composite_tax_rate": "0.08875",
    "tax_amount": "4.44",
    "total_amount": "54.43",
    "breakdown": {
      "state_rate": "0.04000",
      "county_rate": "0.00000",
      "city_rate": "0.04500",
      "special_rates": "0.00375"
    },
    "jurisdictions": {
      "country": "US",
      "state": "NY",
      "county": "New York",
      "city": "New York"
    },
    "created_at": "2026-02-27T10:00:01Z"
  }
}
```

### Validation Rules

- `latitude`: number, `-90..90`
- `longitude`: number, `-180..180`
- `subtotal`: decimal string, `> 0`
- `timestamp`: valid ISO-8601 datetime

### Error Statuses (fixed)

- `400 BAD_REQUEST`
  - `error.code`: `BAD_JSON`
  - case: malformed JSON body.
- `415 UNSUPPORTED_MEDIA_TYPE`
  - `error.code`: `UNSUPPORTED_CONTENT_TYPE`
  - case: content type is not `application/json`.
- `422 UNPROCESSABLE_ENTITY`
  - `error.code`: `VALIDATION_ERROR`
  - case: invalid fields or values.
- `422 UNPROCESSABLE_ENTITY`
  - `error.code`: `OUTSIDE_SERVICE_AREA`
  - case: coordinates are outside New York State.
- `500 INTERNAL_SERVER_ERROR`
  - `error.code`: `INTERNAL_ERROR`
  - case: unexpected server failure.

## GET /orders

Returns paginated orders list with filters.

### Content Types

- Request: query params only
- Response: `application/json`

### Query Params

- `page` (optional, default `1`)
- `pageSize` (optional, default `20`, max `100`)
- `dateFrom` (optional, ISO-8601)
- `dateTo` (optional, ISO-8601)
- `minSubtotal` (optional, decimal string)
- `maxSubtotal` (optional, decimal string)
- `country` (optional)
- `state` (optional)
- `county` (optional)
- `city` (optional)

### Success Response

- Status: `200 OK`

```json
{
  "data": [
    {
      "id": 123,
      "latitude": 40.7128,
      "longitude": -74.006,
      "subtotal": "49.99",
      "timestamp": "2026-02-27T10:00:00Z",
      "composite_tax_rate": "0.08875",
      "tax_amount": "4.44",
      "total_amount": "54.43",
      "breakdown": {
        "state_rate": "0.04000",
        "county_rate": "0.00000",
        "city_rate": "0.04500",
        "special_rates": "0.00375"
      },
      "jurisdictions": {
        "country": "US",
        "state": "NY",
        "county": "New York",
        "city": "New York"
      },
      "created_at": "2026-02-27T10:00:01Z"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 153,
    "totalPages": 8
  }
}
```

### Error Statuses (fixed)

- `400 BAD_REQUEST`
  - `error.code`: `INVALID_QUERY`
  - case: malformed query params (`page`, `pageSize`, date range, etc.).
- `422 UNPROCESSABLE_ENTITY`
  - `error.code`: `INVALID_FILTER_RANGE`
  - case: semantic errors in filters (for example `minSubtotal > maxSubtotal`).
- `500 INTERNAL_SERVER_ERROR`
  - `error.code`: `INTERNAL_ERROR`
  - case: unexpected server failure.

## POST /orders/import

Imports orders from CSV and computes taxes for each valid row.

### Request Format

Content types:
- Request: `multipart/form-data`
- Response: `application/json`

Form fields:
- `file`: CSV file (required)

Note: this endpoint does not accept a JSON request body by design, because task requirement is CSV import.

### CSV Input Contract (fixed)

- Encoding: `UTF-8`
- Delimiter: comma (`,`)
- Quote char: double quote (`"`)
- Header row: required
- Allowed headers (exact, in this order):
  - `latitude`
  - `longitude`
  - `subtotal`
  - `timestamp`
- Required columns: all 4
- Empty values: not allowed for any required column
- `latitude`: number, range `-90..90`
- `longitude`: number, range `-180..180`
- `subtotal`: decimal string, `> 0`
- `timestamp`: ISO-8601 datetime (UTC recommended)
- Extra columns: ignored
- Unknown/missing headers: rejected

### Success Response

- Status: `200 OK`

```json
{
  "data": {
    "processed": 100,
    "created": 96,
    "failed": 4,
    "errors": [
      {
        "row": 18,
        "code": "INVALID_LATITUDE",
        "message": "latitude must be between -90 and 90"
      }
    ]
  }
}
```

### Error Statuses (fixed)

- `400 BAD_REQUEST`
  - `error.code`: `MISSING_FILE`
  - case: no `file` provided in form-data.
- `400 BAD_REQUEST`
  - `error.code`: `EMPTY_FILE`
  - case: uploaded file is empty.
- `415 UNSUPPORTED_MEDIA_TYPE`
  - `error.code`: `UNSUPPORTED_CONTENT_TYPE`
  - case: request is not `multipart/form-data`.
- `422 UNPROCESSABLE_ENTITY`
  - `error.code`: `INVALID_CSV_HEADERS`
  - case: missing/unknown CSV headers or wrong header format.
- `422 UNPROCESSABLE_ENTITY`
  - `error.code`: `CSV_ROW_VALIDATION_ERROR`
  - case: at least one row contains invalid value(s).
- `500 INTERNAL_SERVER_ERROR`
  - `error.code`: `INTERNAL_ERROR`
  - case: unexpected server failure.

## Error Contract (all endpoints)

### Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": [
      {
        "field": "subtotal",
        "issue": "must be > 0"
      }
    ]
  }
}
```

### Error Object Rules

- `error.code`: machine-readable, stable string enum from endpoint status rules above.
- `error.message`: short human-readable message.
- `error.details`: optional array for field/row-level problems.

CSV row-level error example:

```json
{
  "error": {
    "code": "CSV_ROW_VALIDATION_ERROR",
    "message": "CSV contains invalid rows",
    "details": [
      {
        "row": 12,
        "field": "timestamp",
        "issue": "must be valid ISO-8601 datetime"
      }
    ]
  }
}
```
