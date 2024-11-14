import api from "../services/api";

export async function TaskGetAll(token: string): Promise<any> {
    try {
        const result = await api.get("/task", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return result.data;

    } catch (err: any) {
        if (err?.response?.data?.message) {
            return { "Error": "Erro LoginRequest()", message: err?.response?.data?.message };
        }
        return { "Error": "Erro LoginRequest()" };
    }
}

export async function TaskGet(token: string, id: number): Promise<any> {
    try {
        const result = await api.get(`/task/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return result.data;

    } catch (err: any) {
        if (err?.response?.data?.message) {
            return { "Error": "Erro LoginRequest()", message: err?.response?.data?.message };
        }
        return { "Error": "Erro LoginRequest()" };
    }
}

export async function TaskCreate(token: string, title: string, description: string): Promise<any> {
    try {
        const result = await api.post(`/task`, {
            "title": title, "description": description
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return result.data;

    } catch (err: any) {
        if (err?.response?.data?.message) {
            return { "Error": "Erro LoginRequest()", message: err?.response?.data?.message };
        }
        return { "Error": "Erro LoginRequest()" };
    }
}

export async function TaskEdit(token: string, id: number, title?: string, description?: string): Promise<any> {
    try {
        const result = await api.put(`/task/${id}`, {
            "title": title, "description": description
        },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        return result.data;

    } catch (err: any) {
        if (err?.response?.data?.message) {
            return { "Error": "Erro LoginRequest()", message: err?.response?.data?.message };
        }
        return { "Error": "Erro LoginRequest()" };
    }
}

export async function TaskCheck(token: string, id: number): Promise<any> {
    try {
        const result = await api.patch(`/task/${id}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return result.data;

    } catch (err: any) {
        if (err?.response?.data?.message) {
            return { "Error": "Erro LoginRequest()", message: err?.response?.data?.message };
        }
        return { "Error": "Erro LoginRequest()" };
    }
}

export async function TaskDelete(token: string, id: number): Promise<any> {
    try {
        const result = await api.delete(`/task/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return result.data;

    } catch (err: any) {
        if (err?.response?.data?.message) {
            return { "Error": "Erro LoginRequest()", message: err?.response?.data?.message };
        }
        return { "Error": "Erro LoginRequest()" };
    }
}