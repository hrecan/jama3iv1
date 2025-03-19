const ports = {
    main: parseInt(process.env.PORT) || 3002,
    alternatives: [3003, 3004, 3005],
    websocket: 3006,
    development: 8080,
    test: 9000
};

module.exports = ports; 