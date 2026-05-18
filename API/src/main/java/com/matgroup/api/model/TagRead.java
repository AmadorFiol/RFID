package com.matgroup.api.model;

public record TagRead(
        String epc,
        String tid,
        String alias,
        String tagModel,
        int antennaPort,
        double rssi,
        int readCount,
        String readerHostname,
        boolean alertar
) {
    public static TagRead of(String epc, String tid, String alias, String tagModel, int antenna, double rssi, int count, String host, boolean alertar) {
        return new TagRead(epc, tid, alias, tagModel, antenna, rssi, count, host, alertar);
    }
}
