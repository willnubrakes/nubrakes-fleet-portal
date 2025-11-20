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

## Deployment to GitHub Pages

This project is configured for static export to GitHub Pages.

### Option 1: Using GitHub Actions (Recommended)

1. **Update your Personal Access Token** to include `workflow` scope:
   - Go to: https://github.com/settings/tokens
   - Edit your token and check the `workflow` scope
   - Or create a new token with `repo` and `workflow` scopes

2. **Enable GitHub Pages**:
   - Go to your repository: https://github.com/willnubrakes/nubrakes-fleet-portal/settings/pages
   - Under "Source", select "GitHub Actions"
   - The workflow will automatically deploy on every push to `main`

3. **Create the workflow file** (`.github/workflows/deploy.yml`):
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [main]
   
   permissions:
     contents: read
     pages: write
     id-token: write
   
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: "22"
             cache: "npm"
         - run: npm ci
         - run: npm run build
         - uses: actions/configure-pages@v4
         - uses: actions/upload-pages-artifact@v3
           with:
             path: "./out"
     
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       needs: build
       steps:
         - uses: actions/deploy-pages@v4
   ```

### Option 2: Manual Deployment

1. **Build the site**:
   ```bash
   npm run build
   ```

2. **Enable GitHub Pages**:
   - Go to: https://github.com/willnubrakes/nubrakes-fleet-portal/settings/pages
   - Under "Source", select "Deploy from a branch"
   - Choose branch: `gh-pages` and folder: `/ (root)`

3. **Deploy manually**:
   ```bash
   npm run deploy
   ```

Your site will be available at: `https://willnubrakes.github.io/nubrakes-fleet-portal/`

## Notes

- Vehicle data is stored in React Context (in-memory, not persisted)
- CSV upload expects columns: `year`, `make`, `model`, `vin`, `license_plate`
- Service request payload is logged to console in static deployment (API routes don't work on GitHub Pages)
- For production webhook, update the fetch URL in `app/service-request/page.tsx` to point to your Zapier webhook
