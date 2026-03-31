import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: { 'Content-Type': 'application/json' },
})


// --- Clientes ---
export const clientesApi = {
    getAll:         ()          => api.get('/clientes'),
    getById:        (id)        => api.get(`/clientes/${id}`),
    getByUsuario:   (cif)       => api.get(`clientes/usuario/${cif}`),
    getDefault:     (cif)       => api.get(`clientes/usuario/${cif}/default`),
    create:         (body)      => api.post('/clientes', body),
    update:         (id, body)  => api.put(`/clientes/${id}`, body),
    delete:         (id)        => api.delete(`/clientes/${id}`),
}

// --- Etiquetas ---
export const etiquetasApi = {
    getAll:         ()          => api.get('/etiquetas'),
    getById:        (id)        => api.get(`/etiquetas/${id}`),
    getByUsuario:   (cif)       => api.get(`/etiquetas/usuario/${cif}`),
    create:         (body)      => api.post('/etiquetas', body),
    update:         (id, body)  => api.put(`/etiquetas/${id}`, body),
    delete:         (id)        => api.delete(`/etiquetas/${id}`),
}

// --- Inventarios ---
export const inventariosApi = {
    getAll:         ()          => api.get('/inventarios'),
    getById:        (id)        => api.get(`/inventarios/${id}`),
    create:         (body)      => api.post('/inventarios', body),
    update:         (id, body)  => api.put(`/inventarios/${id}`, body),
    delete:         (id)        => api.delete(`/inventarios/${id}`),
}

// --- Lotes ---
export const lotesApi = {
    getAll:         ()          => api.get('/lotes'),
    getById:        (id)        => api.get(`/lotes/${id}`),
    create:         (body)      => api.post('/lotes', body),
    update:         (id, body)  => api.put(`/lotes/${id}`, body),
    delete:         (id)        => api.delete(`/lotes/${id}`),
}

// --- Paginas ---
export const paginasApi = {
    getAll:         ()          => api.get('/paginas'),
    getById:        (id)        => api.get(`/paginas/${id}`),
    getByRol:       (idRol)     => api.get(`/paginas/rol/${idRol}`),
    create:         (body)      => api.post('/paginas', body),
    update:         (id, body)  => api.put(`/paginas/${id}`, body),
    delete:         (id)        => api.delete(`/paginas/${id}`),
}

// --- Pedidos ---
export const pedidosApi = {
    getAll:         ()          => api.get('/pedidos'),
    getById:        (id)        => api.get(`/pedidos/${id}`),
    getByUsuario:   (cif)       => api.get(`/pedidos/usuario/${cif}`),
    create:         (body)      => api.post('/pedidos', body),
    update:         (id, body)  => api.put(`/pedidos/${id}`, body),
    delete:         (id)        => api.delete(`/pedidos/${id}`),
}

// --- Plantillas ---
export const plantillasApi={
    getAll:         ()          => api.get('/plantillas'),
    getById:        (id)        => api.get(`/plantillas/${id}`),
    getByUsuario:   (cif)       => api.get(`/plantillas/usuario/${cif}`),
    create:         (body)      => api.post('/plantillas', body),
    update:         (id, body)  => api.put(`/plantillas/${id}`, body),
    delete:         (id)        => api.delete(`/plantillas/${id}`),
}

// --- Roles ---
export const rolesApi = {
    getAll:         ()          => api.get('/roles'),
    getById:        (id)        => api.get(`/roles/${id}`),
    create:         (body)      => api.post('/roles', body),
    update:         (id, body)  => api.put(`/roles/${id}`, body),
    delete:         (id)        => api.delete(`/roles/${id}`),
}

// --- Usuarios ---
export const usuariosApi = {
    getAll:         ()          => api.get('/usuarios'),
    getById:        (cif)       => api.get(`/usuarios/${cif}`),
    login:          (body)      => api.post(`/usuarios/login`, body),
    create:         (body)      => api.post('/usuarios', body),
    update:         (cif, body) => api.put(`/usuarios/${cif}`, body),
    delete:         (cif)       => api.delete(`/usuarios/${cif}`),
}

// --- Info ---
export const infoApi = {
    getByPedido:    (id)        =>api.get(`/info/pedido/${id}`),
    create:         (body)      =>api.post('/info',body),
    update:         (id,body)   =>api.put(`/info/${id}`,body),
    delete:         (id)        =>api.delete(`/info/${id}`)
}