// App version - update this with each significant release
// Format: MAJOR.MINOR.PATCH-BUILD_DATE
export const APP_VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString().split('T')[0];

// Helper to get full version string
export const getVersionString = () => `v${APP_VERSION}`;
