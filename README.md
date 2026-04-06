# VaultFi - Premium Financial Dashboard

VaultFi is an interactive, highly-responsive frontend financial dashboard built to demonstrate modern React state management, complex data visualization, and premium UI design. 

This project fulfills all requirements for the Frontend Development Evaluation.

## 🚀 Features

- **Dynamic Theming Engine:** Change the application's primary accent color instantly among curated themes (Indigo, Emerald, Rose, Amber). 
- **OLED Midnight Mode:** True `#000000` dark mode rendering that re-shades all glass cards to maximize contrast.
- **Smart Advisor AI:** A dynamic insight engine that watches your burn rate and compares it to a localized monthly budget target, offering dynamic warnings when runway is running low.
- **Role-Based Access Control (RBAC):** Simulated via a persistent global state. Toggle between `Finance Viewer` (read-only) and `Super Admin` (can add/edit transactions) using the Account dropdown in the bottom left sidebar.
- **Data Visualization:** Employs `recharts` for an area-mapped Balance Trend and a spending pie-chart breakdown.
- **Fluid Layout:** A highly responsive grid built with Tailwind CSS that flexes beautifully down to mobile, swapping the desktop sidebar for a native-feeling sticky bottom navigation bar.

## 🛠️ Tech Stack & Architecture

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (customized with CSS Variables for dynamic routing)
- **State Management**: `Zustand` with `persist` middleware (saving theme, role, and transaction data locally for a seamless experience).
- **Animations**: `Framer Motion` (for page layout transitions) and pure keyframe CSS (for the ambient Aurora mesh background).
- **Icons**: `Lucide React`
- **Charts**: `Recharts`

## 📦 Setup & Installation

This project is a standalone Vite application requiring no external backend or database. It runs completely locally in the browser.

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

