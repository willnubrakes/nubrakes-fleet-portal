# NuBrakes Fleet Portal

A Next.js application for managing fleet vehicles and requesting services.

## Features

### Vehicle Roster Management
- **View Vehicles** (`/vehicles`): Display all vehicles in a table format
- **Add Vehicle** (`/vehicles/new`): Add individual vehicles with form validation
- **Upload CSV** (`/vehicles/upload`): Bulk import vehicles from CSV files

### Service Requests
- **Request Service** (`/service-request`): Multi-step form to:
  - Select multiple vehicles
  - Choose services (with "Other" write-in option)
  - Set preferred date/time window
  - Submit requests to webhook endpoint

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Papa Parse** (CSV parsing)
- **React DatePicker** (date selection)

## Getting Started

### Prerequisites

- Node.js 22 or higher
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
nubrakes-fleet-portal/
├── app/
│   ├── api/
│   │   └── webhook/          # Placeholder webhook endpoint
│   ├── vehicles/
│   │   ├── page.tsx          # Vehicle roster table
│   │   ├── new/
│   │   │   └── page.tsx      # Add vehicle form
│   │   └── upload/
│   │       └── page.tsx      # CSV upload
│   ├── service-request/
│   │   └── page.tsx          # Service request form
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles & branding
├── components/
│   ├── Navigation.tsx        # Header navigation
│   ├── Toast.tsx             # Toast notification component
│   ├── ToastProvider.tsx     # Toast context provider
│   └── SubmitSuccessDialog.tsx # Success modal
└── context/
    └── VehicleContext.tsx    # Vehicle state management
```

## Branding

### Colors
- **Primary Orange**: `#f04f23`
- **Black**: `#000000`
- **Gray**: `#edf2f7`
- **Navy Blue**: `#03182a`
- **Green**: `#34BB4B`

### Fonts
- **Source Sans Pro** (from Google Fonts)

## Future Integrations

- **Auth0**: Authentication will be added later
- **Zapier**: Webhook endpoint (`/api/webhook`) is ready for Zapier integration

## Notes

- Vehicle data is stored in React Context (in-memory, not persisted)
- CSV upload expects columns: `year`, `make`, `model`, `vin`, `license_plate`
- Service request payload is logged to console (ready for Zapier webhook)
