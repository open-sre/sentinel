const {default: axios} = require("axios");
const {readFile} = require("./utils/file-util");
const logger = require("./utils/logger");

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
const healthCheckScheduler = (url, interval, configId) => {
    let id = setInterval(() => {
        checkURLHealth(url);
    }, interval);
    configsMap.push({configId,id});
};

/**
 *
 * @param url
 * @returns {Promise<void>}
 */
const checkURLHealth = async (url) => {
    const config = {
        method: "get",
        url: url,
    };

    try {
        let response = await axios(config);
        if (response.status === 200) {
            logger.info(`Pinging successful for url: ${url}, status: ${response.status}`);
        } else {
            logger.error(`Pinging failed for url: ${url}, status: ${response.status}`);
        }
    } catch (e) {
        logger.error(`Pinging failed for url: ${url}`);
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
    for (const config of configs) {
        healthCheckScheduler(config.endpoint, config.pollSeconds * 1000, configs.id);
    }
}

// set up interval to refresh configs and schedules
setInterval(() => {
    scrapeConfigs();
}, refreshInterval * 1000);

// setting a checker to scrape configs every 1 minute
setConfigsToRun(configsJSON)




