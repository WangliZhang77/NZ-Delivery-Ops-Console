# NZ Delivery Ops Console

**Delivery Operations Control Tower - Localized Emergency Mode Simulation**

A production-ready React application demonstrating how a delivery operations system handles disruptions and maintains service continuity during network outages, weather events, and infrastructure failures.

## 🎯 Project Purpose

This project simulates a **real-world delivery operations control tower** used to monitor and manage deliveries across New Zealand cities (Hamilton, Auckland, Tauranga, Rotorua). Unlike typical CRUD applications, this project focuses on **system resilience** - how the application gracefully degrades and recovers from various failure scenarios.

**Why this project?**
- Demonstrates production-grade error handling and offline capabilities
- Shows understanding of system reliability patterns (degraded modes, action queues, audit logging)
- Highlights real-world problem-solving beyond basic CRUD operations
- Perfect for showcasing to employers who value system design thinking

## ✨ Core Features

### 1. **Incident Management**
- Toggle weather incidents (Heavy Rain, Strong Wind, Road Closure) with severity levels
- Network degradation simulation (Degraded/Down modes)
- Real-time system mode calculation (Normal/Disruption/Offline)

### 2. **Dynamic ETA & Risk Adjustment**
- **Heavy Rain**: Multiplies ETA based on severity (Low: 1.10x, Medium: 1.25x, High: 1.45x)
- **Strong Wind**: Adds delay minutes (Low: +5min, Medium: +12min, High: +20min)
- **Road Closure**: Increases risk levels and ETA significantly (Medium: 1.30x, High: 1.60x)
- All effects stack and update in real-time across the application

### 3. **Offline Mode & Action Queue**
- When network is down, write operations are queued instead of failing
- Visual feedback with Toast notifications and Offline Banner
- Actions remain in queue until network recovery

### 4. **Recovery & Replay**
- One-click recovery restores network connectivity
- Queued actions are automatically synced with simulated network delays
- Order states are updated based on queued actions
- Complete audit trail of all recovery operations

### 5. **System Observability**
- Real-time dashboard with KPIs (Active Deliveries, Delayed Orders, Avg Delay)
- Queued Actions table with status filtering
- Comprehensive Audit Log with mode and action type filtering
- Clear visibility into system state and recovery operations

## 🛠 Tech Stack

### Frontend
- **React 18** + **TypeScript** - Modern UI with type safety
- **Vite** - Fast build tool and dev server
- **Redux Toolkit** - Centralized state management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client (ready for API integration)

### Testing
- **Vitest** - Fast unit test runner
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction simulation

### Development Tools
- **ESLint** + **Prettier** - Code quality
- **TypeScript** - Type checking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/WangliZhang77/NZ-Delivery-Ops-Console.git
cd NZ-Delivery-Ops-Console

# Install dependencies
npm install
```

### Running in Mock Mode

The application runs entirely in mock mode by default - no backend required!

```bash
# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Running Tests

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui
```

### Building for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # TopBar, Sidebar, Layout
│   ├── IncidentPanel/  # Incident control panel
│   ├── OfflineBanner.tsx
│   ├── Toast.tsx       # Notification component
│   ├── StatusBadge.tsx
│   └── RiskBadge.tsx
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard with KPIs
│   ├── OrdersList.tsx  # Orders table with filtering/sorting
│   ├── OrderDetail.tsx # Order details with timeline
│   └── System.tsx      # System status & audit log
├── store/              # Redux store
│   ├── store.ts        # Store configuration
│   ├── incidentsSlice.ts
│   ├── queueSlice.ts
│   ├── auditSlice.ts
│   └── ordersSlice.ts
├── types/               # TypeScript type definitions
│   ├── order.ts
│   ├── incident.ts
│   ├── queue.ts
│   └── audit.ts
├── utils/               # Utility functions
│   ├── format.ts       # Date/ETA formatting
│   ├── incidentEffects.ts  # ETA/risk calculation
│   ├── systemMode.ts    # System mode calculation
│   ├── queue.ts         # Queue management
│   ├── recover.ts       # Recovery logic
│   └── timeline.ts      # Status timeline generation
├── mock/                # Mock data
│   └── data.ts          # Order generation
└── test/                # Test setup
    └── setup.ts
```

## 🎮 How to Use

### Simulating Incidents

1. Click **"Incident Panel"** button in the top bar
2. Toggle any incident (Rain, Wind, Road Closure, Network)
3. Adjust severity levels
4. Watch orders update in real-time:
   - ETA values change
   - Risk levels adjust
   - Dashboard KPIs update

### Testing Offline Mode

1. Open Incident Panel
2. Enable **Network Degraded/Down** → Select **"Down"**
3. Notice the red **Offline Banner** appears
4. Navigate to any order detail page
5. Click **"Update Status"** or **"Assign Driver"**
6. Action is queued (Toast notification appears)
7. Check **System** page to see queued actions
8. Click **Recover** button in Incident Panel
9. Watch actions sync automatically
10. Check **Audit Log** to see recovery details

## 🧪 Test Coverage

The project includes comprehensive tests covering:

1. ✅ Incident effects on order ETA and risk levels
2. ✅ Offline banner display when network is down
3. ✅ Action queuing when offline
4. ✅ Recovery and action synchronization
5. ✅ Route navigation (orders → detail)

Run tests: `npm test`

## 🔮 Future Enhancements

### Backend Integration
- Replace mock data with real .NET API endpoints
- Environment variable: `VITE_API_MODE=api` to switch to API mode
- MSW (Mock Service Worker) for API mocking during development

### Additional Features
- Real-time WebSocket updates for order status
- Driver location tracking on map
- Advanced analytics and reporting
- Multi-user support with role-based access
- Export functionality for audit logs

### Performance
- Virtual scrolling for large order lists
- Optimistic UI updates
- Service Worker for offline caching

## 📝 Key Design Decisions

1. **Redux for State Management**: Centralized state makes it easy to track system-wide changes and implement undo/redo
2. **Pure Functions for Effects**: `applyIncidentsToOrders` is testable and predictable
3. **Action Queue Pattern**: Mimics real-world offline-first architecture
4. **Audit Logging**: Essential for compliance and debugging in production systems

## 🤝 Contributing

This is a portfolio project, but suggestions and improvements are welcome!

## 📄 License

MIT

---

**Built with ❤️ to demonstrate production-grade React development practices**
