# Habit Flow - Cloudflare Pages Deployment Guide

This guide covers deploying the Habit Flow application to Cloudflare Pages.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Supabase Project**: Set up your Supabase project and get credentials
3. **GitHub Repository**: Ensure your code is pushed to GitHub

## Environment Variables

The following environment variables need to be configured in Cloudflare Pages:

### Required Variables

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_SITE_URL`: Your production site URL (e.g., `https://your-app.pages.dev`)

### Optional Variables

- `NODE_VERSION`: Set to `18` (default)

## Deployment Steps

### 1. Connect Repository to Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** in the sidebar
3. Click **Create a project**
4. Select **Connect to Git**
5. Choose your GitHub repository (`Muadeel56/Habit-Flow`)
6. Select the branch you want to deploy (usually `main`)

### 2. Configure Build Settings

Set the following build configuration:

- **Framework preset**: `Vue`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (leave empty for root)

### 3. Set Environment Variables

In the Cloudflare Pages project settings:

1. Go to **Settings** → **Environment variables**
2. Add the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_URL=https://your-app.pages.dev
NODE_VERSION=18
```

### 4. Configure Custom Domain (Optional)

1. In your Cloudflare Pages project, go to **Custom domains**
2. Add your custom domain
3. Follow the DNS configuration instructions

### 5. Configure Supabase for Production

Update your Supabase project settings:

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your production URL
3. Add your production URL to **Redirect URLs**
4. Update any email templates to use your production URL

## Build Configuration

The project includes the following build optimizations:

- **Code splitting**: Vendor, UI, charts, and Supabase libraries are split into separate chunks
- **Source maps**: Enabled for better debugging
- **Asset optimization**: Images and static assets are optimized
- **Caching headers**: Configured for optimal performance

## File Structure

```
dist/                    # Build output directory
├── index.html          # Main HTML file
├── assets/             # Optimized assets
│   ├── *.js           # JavaScript bundles
│   └── *.css          # CSS bundles
├── _headers           # Security and caching headers
└── _redirects         # Client-side routing rules
```

## Security Headers

The deployment includes security headers configured in `_headers`:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## Caching Strategy

- **Static assets**: Cached for 1 year with immutable flag
- **HTML files**: No cache, must revalidate
- **Service worker**: No cache, must revalidate

## Troubleshooting

### Build Failures

1. **TypeScript errors**: Ensure all TypeScript errors are resolved
2. **Missing dependencies**: Run `npm install` locally to verify
3. **Environment variables**: Check that all required variables are set

### Runtime Issues

1. **Authentication not working**: Verify Supabase URL and keys
2. **Routing issues**: Check that `_redirects` file is present
3. **CORS errors**: Update Supabase CORS settings

### Performance Issues

1. **Slow loading**: Check bundle sizes and consider code splitting
2. **Caching issues**: Verify `_headers` configuration
3. **Image optimization**: Ensure images are optimized

## Monitoring

- **Cloudflare Analytics**: Available in the Pages dashboard
- **Error tracking**: Check browser console and Cloudflare logs
- **Performance**: Use Cloudflare's Web Analytics

## Updates

To deploy updates:

1. Push changes to your connected branch
2. Cloudflare Pages will automatically trigger a new build
3. Monitor the build logs for any issues
4. Test the deployment in the preview environment first

## Support

For issues with:
- **Cloudflare Pages**: Check [Cloudflare documentation](https://developers.cloudflare.com/pages/)
- **Vue.js**: Check [Vue.js documentation](https://vuejs.org/)
- **Supabase**: Check [Supabase documentation](https://supabase.com/docs)
