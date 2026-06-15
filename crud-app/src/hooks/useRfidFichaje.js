import {useEffect, useState, useCallback} from 'react';
import { Client } from '@stomp/stompjs';
import {toast} from "react-toastify";
import {fichajesApi} from "../services/api.js";

export default function useRfidFichaje() {
    const [connected, setConnected] = useState(false);
    const [reading, setReading] = useState(false);

    const load = async ()=>{
        try{
            const [st,ta] = await Promise.all([
                fichajesApi.getStatus()
            ])
            setReading(st.data.reading)
        }catch (e){
            toast.error(`Error conectando al lector rfid: ${e.message}`)
            console.log(`[ERROR] ${e.message}`)
        }
    }

    useEffect(() => {
        load()

        const wsUrl = 'ws://localhost:8080/ws';

        const wsClient = new Client({
            brokerURL: wsUrl,
            reconnectDelay: 3000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,

            onConnect: () => {
                setConnected(true);
                wsClient.subscribe('/topic/fichaje', (msg) => {
                    console.log("MSG:",msg.body)
                });
            },
            onDisconnect: () => setConnected(false),
            onStompError: (frame) => console.error('STOMP error:', frame)
        });

        wsClient.activate();

        return () => {
            wsClient.deactivate()
        }
    }, [])

    const start = useCallback(async () => {
        const res = await fichajesApi.start()
        if (res.status===200) {
            setReading(true)
            toast.success("Sistema de fichaje activado")
            console.log("-------------------- Reading ON --------------------")
        }
    }, [])

    const stop = useCallback(async () => {
        const res = await fichajesApi.stop()
        if (res.status===200) {
            setReading(false)
            toast.success("Sistema de fichaje desactivado")
            console.log("-------------------- Reading OFF --------------------")
        }
    }, [])

    return { reading, connected, start, stop };
}