const client = require('prom-client');
const prefix = process.env.PROMETHEUS_METRIC_PREFIX || 'sentinel_probing_';

// Create a Registry which registers the metrics
const register = new client.Registry();

// counter used for successful probing
const successCounter = new client.Counter({
    name: `${prefix}up_count`,
    help: 'probing_success_counter',
    labelNames: ['name', 'url']
});

// counter used for failed probing
const failCounter = new client.Counter({
    name: `${prefix}down_count`,
    help: 'probing_fail_counter',
    labelNames: ['name', 'url']
});

register.registerMetric(successCounter);
register.registerMetric(failCounter);

exports.setDownCounter = (name, url) => {
    failCounter.labels({ name, url }).inc();
};

exports.setUpCounter = (name, url) => {
    successCounter.labels({ name, url }).inc();
};

exports.getDefaultMetrics = async (res) => {
    // Return all metrics the Prometheus exposition format
    res.set('Content-Type', register.contentType);
    let metrics = await register.metrics();
    res.send(metrics);
};

// Enable the collection of default metrics
client.collectDefaultMetrics({ register, prefix });
