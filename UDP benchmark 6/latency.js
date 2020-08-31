import LatencyMonitor from 'latency-monitor';
 
const monitor = new LatencyMonitor();
console.log('Event Loop Latency Monitor Loaded: %O', {
    latencyCheckIntervalMs: monitor.latencyCheckIntervalMs,
    dataEmitIntervalMs: monitor.dataEmitIntervalMs
});
monitor.on('data', (summary) => console.log('Event Loop Latency: %O', summary));
/*
 * In console you will see something like this:
 * Event Loop Latency Monitor Loaded:
 *   {dataEmitIntervalMs: 5000, latencyCheckIntervalMs: 500}
 * Event Loop Latency:
 *   {avgMs: 3, events: 10, maxMs: 5, minMs: 1, lengthMs: 5000}
 */