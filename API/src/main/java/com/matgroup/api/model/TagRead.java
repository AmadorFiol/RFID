package com.matgroup.api.model;

public record TagRead(
        String epc,
        String tid,
        int antennaPort,
        double rssi,
        long lastSeen,
        int readCount,
        String readerHostname
) {
    public static TagRead of(String epc, String tid, int antenna, double rssi, long lastSeen, int count, String host) {
        return new TagRead(epc, tid, antenna, rssi, lastSeen, count, host);
    }
}
