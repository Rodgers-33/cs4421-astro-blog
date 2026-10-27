import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
    if (process.env.HEALTH_CHECK_FAIL === "true") {
        return new Response(
            JSON.stringify({
                status: "error",
                message: "Intentional rollback drill failure",
                timestamp: new Date().toISOString(),
            }),
            {
                status: 503,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    return new Response(
        JSON.stringify({
            status: "ok",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        }),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        }
    );
};