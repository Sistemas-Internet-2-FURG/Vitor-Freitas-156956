import api from "../services/api";

export async function RegisterRequest(name: String, username: String, password: String): Promise<any> {
    try {
        console.log(name,username,password)
        const result = await api.post("/register", {
            name: name,
            username: username,
            password: password,
        });

        return result.data;

    } catch (err: any) {
        if (err?.response?.data?.message) {
            return { "Error": "Erro RegisterRequest()", message: err?.response?.data?.message };
        }
        return { "Error": "Erro RegisterRequest()"};
    }
}
