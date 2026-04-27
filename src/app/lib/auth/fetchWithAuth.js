let isRefreshing = false;

export const fetchWithAuth = async (url, options = {}) => {
    let res = await fetch(url, {
        ...options,
        credentials: "include",
    });

    if (res.status === 401 && !isRefreshing) {
        isRefreshing = true;

        const refresh = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
        });

        isRefreshing = false;

        if (refresh.ok) {
            res = await fetch(url, {
                ...options,
                credentials: "include",
            });
        } else {
            return new Response(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            );
        }
    }

    return res;
};