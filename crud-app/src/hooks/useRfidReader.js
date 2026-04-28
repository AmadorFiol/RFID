import {useEffect, useState, useCallback, useContext} from 'react';
import { Client } from '@stomp/stompjs';
import {toast} from "react-toastify";
import {etiquetasApi, clientesApi, rfidApi} from "../services/api.js";
import {UserContext} from "../App.jsx";

export default function useRfidReader() {
    const [tags, setTags] = useState([]);
    const [connected, setConnected] = useState(false);
    const [reading, setReading] = useState(false);
    const [client, setClient] = useState({});
    const user = useContext(UserContext)

    // TODO Solucionar error del setClient
    const load = async ()=>{
        try{
            const [st,ta, cli] = await Promise.all([
                rfidApi.getStatus(),
                rfidApi.getTags(),
                clientesApi.getDefault(user.cif)
            ])
            setReading(st.data.reading)     // Funciona bien
            setTags(ta.data)                // Funciona bien
            console.log("Res",cli.data)     // Veo que hay datos en la Promise
            setClient(cli.data)             // Setteo el contenido de la Promise
        }catch (e){
            toast.error(`Error conectando al lector rfid: ${e.message}`)
            console.log(`[ERROR] ${e.message}`)
        }
    }

    const addTagToDB = async (tag) => {
        console.log("Client",client)    // Sigue siendo un obj vacio ._.
        try{
            await etiquetasApi.getByEpcAndTib(tag.epc,tag.tid)
        } catch (e) {
            if (e.isAxiosError) {
                etiquetasApi.create({
                    cliente: {id: client.id},
                    inventario: {id: 0},
                    alias: '',
                    epc: tag.epc,
                    tid: tag.tid,
                })
            }
        }
    }

    useEffect(() => {
        const wsUrl = 'ws://localhost:8080/ws';

        const wsClient = new Client({
            brokerURL: wsUrl,
            reconnectDelay: 3000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            onConnect: () => {
                setConnected(true);
                wsClient.subscribe('/topic/tags', (msg) => {
                    const res = JSON.parse(msg.body);
                    addTagToDB(res)
                    setTags(prev=>{
                        let fresh = [];
                        if(prev.length>0){
                            for (const t in prev) {
                                if (prev[t].epc===(res.epc)) {
                                    fresh.push(res)
                                } else {
                                    fresh.push(prev[t])
                                }
                            }
                            fresh.includes(res)? null:fresh.push(res)
                        } else {
                            fresh.push(res)
                        }
                        return fresh
                    });
                });
            },
            onDisconnect: () => setConnected(false),
            onStompError: (frame) => console.error('STOMP error:', frame)
        });

        wsClient.activate();

        // Cargar el estado inicial desde REST
        load()

        return () => {
            wsClient.deactivate()
        }
    }, [])

    const start = useCallback(async () => {
        const res = await rfidApi.start()
        if (res.status===200) {
            setReading(true)
            toast.success("Lectura Iniciada")
        }
    }, [])

    const stop = useCallback(async () => {
        const res = await rfidApi.stop()
        if (res.status===200) {
            setReading(false)
            toast.success("Lectura parada")
        }
    }, [])

    const clear = useCallback(async () => {
        const res = await rfidApi.clear()
        if (res.status===200) {
            setTags([])
            toast.success("Tabla limpiada")
        }
    }, [])

    return { tags, reading, connected, start, stop, clear };
}