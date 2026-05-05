package com.matgroup.api.model;

public record TagRead(
        String epc,
        String tid,
        String alias,
        int antennaPort,
        double rssi,
        long lastSeen,
        int readCount,
        String readerHostname
) {
    public static TagRead of(String epc, String tid, String alias, int antenna, double rssi, long lastSeen, int count, String host) {
        return new TagRead(epc, tid, alias, antenna, rssi, lastSeen, count, host);
    }
}
