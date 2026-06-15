package com.matgroup.api.model;

public record TagRead(
        String epc,
        String tid,
        String alias,
        String tagModel,
        int antennaPort,
        long lastSeen,
        String readerHostname,
        boolean alertar
) {
    public static TagRead of(String epc, String tid, String alias, String tagModel, int antenna, long lastSeen, String host, boolean alertar) {
        return new TagRead(epc, tid, alias, tagModel, antenna, lastSeen, host, alertar);
    }
}
