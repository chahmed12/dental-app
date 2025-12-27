export const API_BASE_URL = "http://localhost:8080/Backoffice/api";

export async function apiRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: unknown
): Promise<T> {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };

    const config: RequestInit = {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    };

    try {
        console.log(`🔵 API Request: ${method} ${API_BASE_URL}${endpoint}`);
        console.log('📦 Payload:', body);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        console.log(`📡 Response Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            // Try to parse error message from backend
            let errorMessage = "Une erreur est survenue";
            try {
                const errorData = await response.json();
                console.error('❌ Error Response:', errorData);
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // If response is not JSON, use status text
                errorMessage = `Erreur ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }

        // Handle empty responses (e.g. 204 No Content)
        if (response.status === 204) {
            console.log('✅ Success (No Content)');
            return {} as T;
        }

        const data = await response.json();
        console.log('✅ Success Response:', data);
        return data;
    } catch (error) {
        console.error(`❌ API Error (${endpoint}):`, error);
        throw error;
    }
}
