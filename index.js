const {default: axios} = require("axios");
const {readFile} = require("./utils/file-util");
const logger = require("./utils/logger");
const {getDefaultMetrics, setDownCounter, setUpCounter} = require('./utils/prometheus');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

// reading files from config
let configsJSON = JSON.parse(readFile('./configs.json'))

// get environment variables for refresh configs or set to default
let refreshInterval = parseInt(process.env.REFRESH_INTERVAL) || 300;

// this will store all the configs and their intervals
let configsMap = [];

/**
 * Schedules a health check and stored it in a config map
 *
 * @param url The URL that needs to be pinged for health
 * @param interval The interval to ping the url
 * @param configId The ID of the config, which is unique
 */
const healthCheckScheduler = (url, interval, configId, name) => {
    let id = setInterval(() => {
        checkURLHealth(url, name);
    }, interval);
    configsMap.push({configId,id});
};

/**
 *
 * @param url The url that will be probes
 * @param name Name of the url being probed
 * @returns {Promise<void>}
 */
const checkURLHealth = async (url, name) => {
    const config = {
        method: "get",
        url: url,
    };

    try {
        let response = await axios(config);
        if (response.status === 200) {
            logger.info(`Pinging successful for url: ${name} - ${url}, status: ${response.status}`);
            setUpCounter(name, url);
        } else {
            logger.error(`Pinging failed for url: ${name} - ${url}, status: ${response.status}`);
            setDownCounter(name, url);
        }
    } catch (e) {
        logger.error(`Pinging failed for url: ${name} - ${url}`);
        setDownCounter(name, url);
    }
};

/**
 * refreshing configs
 */
const scrapeConfigs = () => {
    clearAllSchedules();
    let configs = JSON.parse(readFile('./configs.json'))
    setConfigsToRun(configs)
}

/**
 * Clearing all schedules
 */
const clearAllSchedules = () => {
    logger.info("clearing all intervals");
    for (const map of configsMap) {
        clearInterval(map.id);
        logger.debug(`cleared interval for: ${map.configId}`)
    }
    configsMap = [];
}

/**
 * Setting configs to be executed
 *
 * @param configs The configs given in the config file
 */
const setConfigsToRun = (configs) => {
    let configId = uuidv4();
    for (const config of configs) {
        healthCheckScheduler(config.endpoint, config.pollSeconds * 1000, configId, config.name);
    }
}

/**
 * This will setup the api server of the service
 */
const setupServer = async () => {
    let app = express();

    app.get('/health', function (req, res) {
        res.send('ok');
    });

    app.get('/metrics', async function (req, res) {
        await getDefaultMetrics(res);
    });

    let serverPort = parseInt(process.env.SERVER_PORT) || 8080
    let server = app.listen(serverPort, function () {
        let port = server.address().port;
        console.log('=== Service running on port: %s ===', port);
    });
}

// set up server for prometheus scraping and health endpoint
setupServer();

// set up interval to refresh configs and schedules
setInterval(() => {
    scrapeConfigs();
}, refreshInterval * 1000);

// setting a checker to scrape configs every 1 minute
setConfigsToRun(configsJSON)




