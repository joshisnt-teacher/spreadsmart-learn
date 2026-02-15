

## Fix: Netlify 404 on Page Refresh

### The Problem
Netlify serves static files. When you refresh `/dashboard`, it looks for a file at that path, finds nothing, and returns a 404. Your app uses React Router for client-side routing, which only works after `index.html` loads.

### The Solution
Create a single file: `public/_redirects`

Contents:
```
/*    /index.html   200
```

This tells Netlify: "For any URL that doesn't match a static file, serve `index.html` with a 200 status code." React Router then takes over and renders the correct page.

### Technical Details
- The file goes in the `public/` directory so Vite copies it to the build output as-is
- The `200` status code (not `301` or `302`) means it's a rewrite, not a redirect — the URL stays the same in the browser
- This won't affect static assets like images, CSS, or JS since Netlify serves those directly before falling back to this rule

### After Implementation
1. The `_redirects` file will be created in `public/`
2. Push the change to GitHub
3. Netlify will automatically redeploy
4. Refreshing `/dashboard`, `/student`, `/module/:id`, or any route will work correctly

