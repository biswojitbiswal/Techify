export const BASE_URL =
    process.env.NODE_ENV === "production"
        ? "https://techify-api.vercel.app"
        : "http://localhost:5000";