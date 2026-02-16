const API_BASE = '/api';

const getToken = () => localStorage.getItem('admin_token');

const authHeaders = () => ({
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
});

export const api = {
    // Auth
    async login(password) {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        localStorage.setItem('admin_token', data.token);
        return data;
    },

    async verifyToken() {
        const token = getToken();
        if (!token) return false;
        try {
            const res = await fetch(`${API_BASE}/auth/verify`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            return data.valid;
        } catch {
            return false;
        }
    },

    logout() {
        localStorage.removeItem('admin_token');
    },

    isLoggedIn() {
        return !!getToken();
    },

    // Data
    async getData() {
        const res = await fetch(`${API_BASE}/data`);
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
    },

    async getSection(section) {
        const res = await fetch(`${API_BASE}/data/${section}`);
        if (!res.ok) throw new Error(`Failed to fetch ${section}`);
        return res.json();
    },

    async updateSection(section, data) {
        const res = await fetch(`${API_BASE}/data/${section}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message);
        return result;
    },

    // Upload
    async uploadImage(file) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await fetch(`${API_BASE}/data/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getToken()}` },
            body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    async uploadMultipleImages(files) {
        const formData = new FormData();
        files.forEach(f => formData.append('images', f));
        const res = await fetch(`${API_BASE}/data/upload/multiple`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getToken()}` },
            body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    async deleteImage(filename) {
        const res = await fetch(`${API_BASE}/data/upload/${filename}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },
};
