# NZ Delivery Ops Console

Delivery Operations Control Tower - Localized Emergency Mode Simulation

## Quick Start

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

After the development server starts, open the displayed local address in your browser (usually `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable components
│   ├── Layout/    # Layout components
│   └── IncidentPanel/  # Incident panel
├── pages/         # Page components
│   ├── Dashboard.tsx
│   ├── OrdersList.tsx
│   ├── OrderDetail.tsx
│   └── System.tsx
└── store/         # Redux state management
    └── store.ts
```

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router
- Redux Toolkit
- Tailwind CSS
- Axios
