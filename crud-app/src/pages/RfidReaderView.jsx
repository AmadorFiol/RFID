import useRfidReader from '../hooks/useRfidReader.js';
import {clientesApi, etiquetasApi} from "../services/api.js";
import {useContext, useEffect, useState} from "react";
import {toast} from "react-toastify";
import {UserContext} from "../App.jsx";

export default function RfidReaderView() {
    const { tags, reading, connected, start, stop, clear } = useRfidReader();
    const [cliente, setCliente] = useState()
    const user = useContext(UserContext)

    const load = async ()=>{
        try{
            const res = await clientesApi.getDefault(user.cif)
            setCliente(res.data)
        }catch (e){
            toast.error(`Error obteniendo cliente default: ${e.message}`)
            console.log(`[ERROR] ${e.message}`)
        }
    }

    useEffect(() => { load() },[])

    const addTagToDB = async (tag) => {
        tag.tid===''? tag.tid="000000000000000000000000":null
        try{
            await etiquetasApi.getByEpcAndTid(tag.epc,tag.tid)
            console.log(`[200] ${tag.epc} OK`)
        } catch (e) {
            if (e.isAxiosError && e.status === 404) {
                console.log(`[404] ${tag.epc} NOT FOUND`)
                etiquetasApi.create({
                    epc: tag.epc,
                    tid: tag.tid,
                    cliente: {id: cliente.id},
                    inventario: {id: 0},
                    alias: '',
                    tagModel: tag.tagModel,
                    alertar: false,
                })
            }
        }
    }

    for (const i in tags) {
        addTagToDB(tags[i])
    }

    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', margin: '2rem' }}>
            <h1>Lecturas RFID — Impinj R420</h1>

            <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                {!reading?
                    <button
                        onClick={start}
                        style={{ padding: '.5rem 1rem', background: '#2ecc71', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                        ▶ Iniciar lectura
                     </button>
                    :
                    <button
                        onClick={stop}
                        style={{ padding: '.5rem 1rem', background: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                        ■ Parar lectura
                    </button>
                }

                <button
                    onClick={clear}
                    style={{ padding: '.5rem 1rem', background: '#95a5a6', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    Limpiar
                </button>

                <span style={{ marginLeft: '1rem', fontWeight: 'bold', color: reading ? '#2ecc71' : '#7f8c8d' }}>
                    {reading ? 'LEYENDO' : 'Parado'}
                </span>
                <span style={{ marginLeft: '1rem', color: connected ? '#2ecc71' : '#e74c3c' }}>
                    {connected ? '● WS conectado' : '○ WS desconectado'}
                </span>
            </div>

            <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: 'monospace' }}>
                <thead>
                <tr style={{ background: '#34495e', color: 'white' }}>
                    <th>EPC</th>
                    <th>TID</th>
                    <th>Alias</th>
                    <th>Modelo del Tag</th>
                    <th>Lecturas</th>
                    <th>Antena</th>
                    <th>RSSI (dBm)</th>
                    <th>Reader</th>
                </tr>
                </thead>
                <tbody>
                {tags.map(t => {
                    t.alertar && toast.info(`Se ha encontrado la etiqueta ${t.alias}`)
                    return <TagRow tag={t}/>
                })}
                </tbody>
            </table>
        </div>
    );
}

function TagRow( tag ) {
    return (
        <tr key={tag.tag.epc}>
            <td>{tag.tag.epc}</td>
            <td>{tag.tag.tid}</td>
            <td>{tag.tag.alias}</td>
            <td>{tag.tag.tagModel}</td>
            <td>{tag.tag.readCount}</td>
            <td>{tag.tag.antennaPort}</td>
            <td>{tag.tag.rssi}</td>
            <td>{tag.tag.readerHostname}</td>
        </tr>
    );
}