# AssetSphere React

## Run locally

Install Node.js 18 or newer, then run:

```sh
npm install
npm run dev
```

Open the local address printed by Vite. To create a production build, run `npm run build`; to preview it, run `npm run preview`.

## One React page per route

Every route is mapped in `src/App.jsx` to a dedicated page module in `src/pages/`:

- Public: `HomePage.jsx`, `FeaturesPage.jsx`, `AboutPage.jsx`, `FAQPage.jsx`, `LoginPage.jsx`, `SignupPage.jsx`
- Employee: `EmployeeDashboardPage.jsx`, `EmployeeAssetsPage.jsx`, `EmployeeRequestsPage.jsx`, `EmployeeProfilePage.jsx`, `EmployeeCalendarPage.jsx`
- Admin: `AdminDashboardPage.jsx`, `AdminInventoryPage.jsx`, `AdminEmployeesPage.jsx`, `AdminRequestsPage.jsx`, `AdminCalendarPage.jsx`

`DashboardSectionPage.jsx` and `LegacyPage.jsx` are shared adapters for existing dashboard workflows. This keeps each route independently addressable while retaining the original site's behavior. Login and signup are React forms; the calendar is a React component in `src/components/AssetCalendar.jsx`.

## PE-II syllabus coverage in the code

- Components and JSX: routed pages and reusable UI components under `src/components/` and `src/pages/`.
- Props: pages and reusable components receive values such as dashboard role/view, form field options, and calendar role.
- Local state: forms, login role, calendar cursor/view/filters, and selected event use React state.
- React Router and a multi-page SPA: `src/App.jsx` defines hash-based routes for each public, employee, and admin page.
- Context API and shared state: `src/context/SessionContext.jsx` provides the current session and authentication actions.
- Local versus global state: transient UI state stays within components; shared asset/request records live in Redux Toolkit.
- Redux Toolkit: `src/store/assetStore.js` defines the central record slice and updates.
- Async handling: `loadAssetData` has pending/succeeded/failed states; login and registration show loading and error feedback.
- Forms and validation: login/signup use controlled fields, native required/email/password checks, duplicate-email handling, and submit feedback.
- Reusable inputs: `src/components/FormInput.jsx` is shared by the authentication forms.

## Calendar behavior

The employee calendar only shows the active employee's asset requests. The admin calendar can show records across employees and filter them. The calendar uses request dates, assignment dates, and maintenance dates available in the saved records; it handles invalid/missing ranges and supports month, week, and day navigation. Admin conflict checks flag overlapping events for the same asset.

## Data and sign-in notes

The uploaded source is a browser-only demo. Its records and demo sessions are saved in `localStorage`; it has no API server or shared database. Employee and admin access in this project is demo-only and must not be treated as secure authentication.

The supplied course notice requires significant personal contribution to submitted work. Review and understand the implementation and adapt it yourself so you can explain it accurately.

## Palette previews


