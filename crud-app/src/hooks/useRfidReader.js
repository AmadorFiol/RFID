import { useEffect, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import {toast} from "react-toastify";
import {rfidApi} from "../services/api.js";

export default function useRfidReader() {
    const [tags, setTags] = useState([]);
    const [connected, setConnected] = useState(false);
    const [reading, setReading] = useState(false);

    const load = async ()=>{
        try{
            const [st,ta] = await Promise.all([
                rfidApi.getStatus(),
                rfidApi.getTags()
            ])
            setReading(st.data.reading)
            setTags([...ta.data])
        }catch (e){
            toast.error(`Error conectando al lector rfid: ${e.message}`)
            console.log(`[ERROR] ${e.message}`)
        }
    }

    useEffect(() => {
        const wsUrl = 'ws://localhost:8080/ws';

        const client = new Client({
            brokerURL: wsUrl,
            reconnectDelay: 3000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            onConnect: () => {
                setConnected(true);
                client.subscribe('/topic/tags', (msg) => {
                    const res = JSON.parse(msg.body);
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

        client.activate();

        // Cargar el estado inicial desde REST
        load()

        return () => {
            client.deactivate()
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