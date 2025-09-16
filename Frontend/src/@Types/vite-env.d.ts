interface ImportMetaEnv {
  readonly VITE_BACKEND_API: string;
  readonly VITE_FRONTEND_URL: string;
  readonly VITE_LISTING_API: string;
  readonly VITE_MAPTILER_KEY: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}