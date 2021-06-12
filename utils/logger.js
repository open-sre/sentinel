// Logger implementation for the project
const SimpleNodeLogger = require('simple-node-logger'),
    opts = {
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
    },
    logger = SimpleNodeLogger.createSimpleLogger( opts );

module.exports = logger;
