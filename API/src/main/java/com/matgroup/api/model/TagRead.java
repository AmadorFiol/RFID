package com.matgroup.api.model;

import java.time.Instant;

public record TagRead(
        String epc,
        int antennaPort,
        double rssi,
        long firstSeen,
        long lastSeen,
        int readCount,
        String readerHostname
) {
    public static TagRead of(String epc, int antenna, double rssi,
                             long firstSeen, long lastSeen,
                             int count, String host) {
        return new TagRead(epc, antenna, rssi, firstSeen, lastSeen, count, host);
    }

    public String firstSeenFormatted() {
        return Instant.ofEpochMilli(firstSeen).toString();
    }

    public String lastSeenFormatted() {
        return Instant.ofEpochMilli(lastSeen).toString();
    }
}
