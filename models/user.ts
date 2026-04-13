import { api } from "./api";

type UserResponse = {
    meta: MetaResponse;
    data: User[];
}

export const user = {
    getAll: async () => {
        const response = await api.get<UserResponse>("/users");
        return response.data;
    },

    create: async (request: CreateUserRequest) => {
        const response = await api.post<User>("/users", request);
        return response.data;
    },

    update: async (id: number, request: UpdateUserRequest) => {
        const response = await api.put<User>(`/users/${id}`, request);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete<User>(`/users/${id}`);
        return response.data;
    }
}