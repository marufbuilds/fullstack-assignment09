# Equiply — Equipment Rental Platform

Equiply is a full-stack equipment rental platform where customers can explore and rent equipment, equipment owners can manage their listings and bookings, and administrators can manage the platform.

The frontend is built with Next.js and provides a responsive interface for customers, owners, and administrators.

## Tech Stack

- **Next.js** — App Router
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Lucide React** — Icons
- **Framer Motion** — Animations
- **Better Auth** — Authentication
- **Express.js** — Backend API
- **MongoDB** — Database
- **Stripe** — Payment integration

## Main Features

- Responsive landing page and equipment browsing
- Equipment search, filtering, and sorting
- Equipment details and booking flow
- User authentication
- Customer dashboard
- Equipment owner dashboard
- Admin dashboard
- Equipment management
- Booking and payment workflows
- Favorites and user-related features
- Light and dark theme support

## Project Structure

```text
client/
├── public/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── dashboard/
│   │   ├── equipment/
│   │   └── ...
│   ├── components/
│   ├── lib/
│   └── ...
├── src/proxy.ts
├── package.json
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-frontend-repository-url>
cd client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the frontend root:

```env
BACKEND_URL=http://localhost:5000/api
```

Use the appropriate deployed backend URL in your production environment.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Important:** The Express backend must also be running for API-dependent features to work.

## Development Challenges and Lessons Learned

Building Equiply involved more than creating pages and connecting components. Some of the biggest challenges came from making separate parts of the application work together reliably.

### 1. Frontend and Backend Communication

One major challenge was connecting the Next.js frontend with the separate Express backend.

We had to deal with API endpoint mismatches, request methods, response handling, CORS configuration, and environment-specific backend URLs.

**What we learned:** A frontend can look complete while its features still fail because the API integration is incorrect. Understanding the complete request-response flow is essential.

### 2. Centralized API Proxy

Managing backend URLs across multiple pages can make a project difficult to maintain.

We worked toward a centralized Next.js API proxy so frontend requests could use consistent `/api/...` paths instead of directly depending on the backend URL.

**What we learned:** Centralizing API communication makes the application easier to maintain, but authentication cookies, redirects, request headers, and production configuration must also be handled carefully.

### 3. Authentication and Authorization

Authentication was another challenging area. Signing in is only one part of the problem. The application also needs to understand who the user is and what that user is allowed to access.

We had to consider:

- Email and password authentication
- Google authentication
- Session handling
- Protected pages
- Customer, owner, and admin permissions

**What we learned:** Authentication confirms a user's identity, while authorization controls what that user can do. Both are necessary for a secure platform.

### 4. Role-Based Dashboards

Equiply has different types of users, and each role requires different functionality.

Creating customer, owner, and admin experiences meant handling different permissions, data, actions, and page layouts without mixing responsibilities.

**What we learned:** Role-based applications require careful frontend and backend coordination. Hiding a button in the frontend is not enough; permissions must also be checked on the server.

### 5. Booking and Payment Flow

A rental platform needs more than an equipment listing page. Booking and payment involve multiple steps and depend on successful communication between the frontend, backend, database, and payment provider.

We had to consider booking creation, checkout, payment confirmation, and handling failed requests.

**What we learned:** Payment workflows require reliable server-side verification. A successful checkout redirect alone should not be treated as proof of payment.

### 6. Consistent UI and Theme Management

As the application grew, maintaining a consistent design across different pages became increasingly important.

We worked on replacing scattered hardcoded colors with reusable semantic theme classes, keeping the brown-and-cream design consistent while supporting light and dark modes.

**What we learned:** A centralized design system makes future changes easier and prevents individual pages from developing inconsistent styles.

### 7. Debugging and Understanding Generated Code

Another challenge was understanding how different files, components, API calls, and backend routes work together.

Writing code is not the only difficult part of development. Debugging errors, following data flow, and understanding why a feature fails are equally important.

**What we learned:** Building a real application requires patience, problem-solving, and the ability to understand the logic behind the code—not just make the code run.

## What This Project Taught Us

Equiply helped us understand several important full-stack development concepts:

- Connecting a Next.js application to an independent backend
- Organizing API communication
- Working with authentication and user sessions
- Implementing role-based access
- Managing application state and API responses
- Understanding booking and payment workflows
- Maintaining consistent UI across multiple pages
- Debugging integration problems
- Configuring applications for deployment

## Future Improvements

- Improve error handling and loading states
- Strengthen security and server-side validation
- Improve automated testing
- Optimize performance
- Expand equipment discovery and booking features

---

**Equiply is a learning project focused on building a practical full-stack equipment rental platform and understanding the real challenges involved in developing and integrating a modern web application.**
