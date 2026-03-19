import axios from 'axios'

const api = axios.create({
    baseURL: 'http://192.168.1.177:8080/api',
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
// --- Lotes ---
export const lotesApi = {
    getAll:     ()          => api.get('/lotes'),
    getById:    (id)        => api.get(`/lotes/${id}`),
    create:     (body)      => api.post('/lotes', body),
    update:     (id, body)  => api.put(`/lotes/${id}`, body),
    delete:     (id)        => api.delete(`/lotes/${id}`),
}

// --- Etiquetas ---
export const etiquetasApi = {
    getAll:         ()          => api.get('/etiquetas'),
    getById:        (id)        => api.get(`/etiquetas/${id}`),
    getByUsuario:   (cif)       =>api.get(`/etiquetas/usuario/${cif}`),
    create:         (body)      => api.post('/etiquetas', body),
    update:         (id, body)  => api.put(`/etiquetas/${id}`, body),
    delete:         (id)        => api.delete(`/etiquetas/${id}`),
}

// --- Inventarios ---
export const inventariosApi = {
    getAll:     ()          => api.get('/inventarios'),
    getById:    (id)        => api.get(`/inventarios/${id}`),
    create:     (body)      => api.post('/inventarios', body),
    update:     (id, body)  => api.put(`/inventarios/${id}`, body),
    delete:     (id)        => api.delete(`/inventarios/${id}`),
}

// --- Usuarios ---
export const usuariosApi = {
    getAll:     ()          => api.get('/usuarios'),
    getById:    (cif)        => api.get(`/usuarios/${cif}`),
    create:     (body)      => api.post('/usuarios', body),
    update:     (cif, body)  => api.put(`/usuarios/${cif}`, body),
    delete:     (cif)        => api.delete(`/usuarios/${cif}`),
}


// --- API Zebra Printer --- Ver. Bruto
const apiZPL = axios.create({
    baseURL: 'https://api.zebra.com/v2/devices/printers',
    headers: {
        'Content-Type': 'multipart/form-data',
        'apikey': 'l3Q9D1cBaAnsCMQPjI8lQDfyKtT8fwVQ',
        'tenant': 'acd5cfe9481523d320736c0af339e647'
    },
})
const bodyZPL={sn:"99J195100056",zpl_file:"label.zpl"}

export const sendZPL={
    send:   (apikey,tenant,body)    =>apiZPL.post(`/send/${apikey}/${tenant}`,body)
}