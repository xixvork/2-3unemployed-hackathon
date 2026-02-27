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

## GET /orders

Returns paginated orders list with filters.

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

## POST /orders/import

Imports orders from CSV and computes taxes for each valid row.

### Request Format

`multipart/form-data` with field:
- `file`: CSV file (required)

Note: this endpoint does not accept a JSON request body by design, because task requirement is CSV import.

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

### Recommended Status Codes

- `400 Bad Request`: malformed query/body
- `404 Not Found`: resource missing (if applicable)
- `409 Conflict`: duplicates/import conflicts (if applicable)
- `422 Unprocessable Entity`: semantic validation errors
- `500 Internal Server Error`: unexpected failures
