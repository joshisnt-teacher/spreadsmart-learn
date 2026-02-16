

## Dashboard Cleanup and Teacher Settings Page

### 1. Hide "Your Modules" Section

Remove the entire "Your Modules" section (lines 245-305 in `TeacherDashboard.tsx`) from the dashboard view. The code stays in the codebase but won't render, making it easy to re-enable later.

### 2. Remove "Preview Modules" Button

Remove the "Preview Modules" button from the header (line 184). The built-in modules section with individual Preview buttons on each module card will remain, so teachers can still preview specific modules.

### 3. Create Teacher Settings Page

A new `/dashboard/settings` page with:

- **Profile section**: Display name and email (read-only)
- **Account actions**: Sign out button, change password (sends reset email via the auth system)
- **Back navigation**: Link back to the dashboard

A Settings icon/button will be added to the dashboard header (replacing the removed Preview Modules button area) linking to this new page.

### Technical Changes

| File | Change |
|------|--------|
| `src/pages/TeacherDashboard.tsx` | Remove "Your Modules" block (lines 245-305), remove "Preview Modules" button (line 184), add Settings icon button in header |
| `src/pages/TeacherSettings.tsx` | New page with profile display, password reset, and sign-out |
| `src/App.tsx` | Add route `/dashboard/settings` |

