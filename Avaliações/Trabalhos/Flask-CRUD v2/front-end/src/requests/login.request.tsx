import api from "../services/api";

export async function LoginRequest(username: String, password: String): Promise<any> {
    try {
        const result = await api.post("/login", {
            username: username,
            password: password,
        });

        return result.data;

    } catch (err: any) {
        if (err?.response?.data?.message) {
            return { "Error": "Erro LoginRequest()", message: err?.response?.data?.message };
        }
        return { "Error": "Erro LoginRequest()"};
    }
}
