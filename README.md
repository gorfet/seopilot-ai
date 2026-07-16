# SEOPilot AI — Enterprise SEO SaaS Platform & Client Portal

SEOPilot AI is a fully integrated, full-stack SEO Management and Reporting SaaS platform designed for modern digital agencies, consultants, and their clients. It features automated technical audit crawling, semantic keyword planning, custom AI content drafting, an interactive SEO Copilot, and white-label client containment with live stripe-ready billing structures.

---

## 🎨 Visual Identity & Slate Aesthetic

The application is engineered around a modern, premium **Slate Dark Theme** featuring:
- **Atmospheric Typography**: Pairings of **Inter** for clean UI controls alongside **JetBrains Mono** for structural data indicators, telemetry states, and search score metadata.
- **Dynamic Charting**: Custom responsive vector graphics plotting real-time traffic estimates, indexing gains, and SEO health metrics.
- **Micro-interactions**: Beautiful backdrop-blur filters, interactive status rings, smooth list entrances, and collapsible side navigation.

---

## 🏗️ Technical Architecture & Key Modules

SEOPilot AI leverages a high-performance **Express + React (Vite)** full-stack architecture to maintain total security of sensitive credentials:

1. **Secure Backend Proxy (`server.ts`)**: 
   - All external intelligence queries (Google Gemini API) are executed entirely server-side.
   - API keys are handled as private environmental secrets, completely shielded from client-side network inspectors.
2. **Dynamic SEO Crawler & Scraper**:
   - Simulated technical crawling analyzes domain metadata length, canonical tags, heading distributions (`H1`-`H6`), images, XML sitemaps, robots.txt structures, page weight, and load latency.
3. **AI Content Draft Optimizer**:
   - Employs deep contextual intelligence to generate high-performing organic articles, calculate keywords density, readibility scores, and structure recommendations.
4. **Interactive SEO Copilot Chat**:
   - A server-side conversational assistant to diagnose indexing bottlenecks, plan backlink strategies, and construct technical solutions.
5. **Multi-Role Workspace Containment**:
   - **Agency Admins**: Possess unrestricted master privileges to add/delete monitored websites, run on-demand technical audits, analyze competitors, generate AI content, and configure client white-label assets.
   - **Clients**: Log in to a restricted, customized portal bound to their specific website property. They can access audit reports, download PDFs, view historical trends, and manage custom billing without accessing administrative tools.

---

## 🔑 Authentication, Sandboxes & Guest Access

SEOPilot AI supports multiple secure pathways for users and reviewers:
- **Free Guest Tier**: Click the **"Explore with Free Guest Tier"** button on the Auth Portal. This logs the user in as a standard trial user with access to the core agency interface, beginning with a clean slate of 0 monitored projects and 0% active scores so users can explore registering custom web properties.
- **Sandbox Access Keys** (Collapsible):
  - **Agency Administrator**: `agency@seopilot.ai` (Password: any value) — Full multi-property administrative portal.
  - **Client Portal**: `client@abccreative.studio` (Password: any value) — Locked-down reporting workspace configured for *ABC Creative Studio*.

---

## 🚀 Local Development & Execution

Ensure your environment is configured, then boot the multi-process server:

### 1. Declare Environmental Secrets
Create a `.env` file at the root of the project with your Google Gemini secret key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 2. Install Project Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The server will boot on `http://localhost:3000` executing Express middleware with live Vite asset compilation.

---

## 📄 Build and Deployment Pipeline

The production system compiles the dual layers into a high-performance single-bundled runtime:
```bash
npm run build
```
This builds static client assets in `dist/` and compiles the backend code via `esbuild` to a self-contained `dist/server.cjs` file, enabling rapid Cold Starts on containerized services like Cloud Run.
