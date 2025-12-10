# GitHub Copilot Instructions — FRONTEND (React + Vite + Tailwind)

You are generating code for a React + Vite + Tailwind + Axios single-page application.
Follow these rules strictly.

==================================================
PROJECT STRUCTURE
==================================================


src/
    config/backend.js
    auth/
      authService.js
      useAuth.js
    components/
      Navbar.jsx
      ProtectedRoute.jsx
    features/
      feature1/
        Feature1Page.jsx
    pages/
      LandingPage.jsx
      Dashboard.jsx
      LoginCallback.jsx
    App.jsx
    main.jsx
  index.html
  package.json
  tailwind.config.js
  postcss.config.js
  Dockerfile

==================================================
GENERAL FRONTEND RULES
==================================================

- Always use React functional components
- Always use Vite environment variables via: import.meta.env
- Always use TailwindCSS for styling
- Use HashRouter from React Router v6 (for GitHub Pages support)
- Use Axios for API calls
- Use modular “feature-based” folder structure: every new feature lives under /features/<featureName>
- Every new page must be registered in App.jsx routing
- When calling backend, always use:

    import { BACKEND_URL } from "../config/backend";

- All JWT logic belongs in authService.js and useAuth.js
- Never hardcode backend URL — always use BACKEND_URL

==================================================
AUTHENTICATION RULES
==================================================

- loginWithGoogle() redirects user to `${BACKEND_URL}/auth/google/login`
- LoginCallback.jsx must:
  - read ?token= from URL hash
  - save JWT to localStorage
  - redirect user to "/dashboard"

- ProtectedRoute.jsx should:
  - read JWT from useAuth()
  - redirect to "/" if unauthenticated

- logout() clears JWT and redirects to "/"

==================================================
FEATURE DEVELOPMENT RULES
==================================================

When creating a new feature:

- Create folder: /src/features/<featureName>
- Add page: <FeatureName>Page.jsx
- Register route in App.jsx
- Add entry in Navbar.jsx
- If backend API is needed:
  - Add protected Axios call using JWT
  - Target URL: `${BACKEND_URL}/<featureName>/...`

==================================================
DOCKER RULES
==================================================

- Always expose port 5173
- Always run with: ["npm", "run", "dev", "--", "--host"]

==================================================
GENERATE CODE USING THESE EXAMPLES
==================================================

Example login redirect:
window.location.href = `${BACKEND_URL}/auth/google/login`;

Example API call:
axios.get(`${BACKEND_URL}/feature1/hello`, { headers: { Authorization: `Bearer ${token}` } });

==================================================
END OF FRONTEND INSTRUCTIONS
==================================================
