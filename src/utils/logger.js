import { createLogger, format, transports } from 'winston';
import moment from 'moment';

const { combine, timestamp, colorize, printf } = format;

const formatter = printf(info => {
    return `[${moment(info.timestamp).format('MM/DD/YY-HH:mm:ss:SSSS')}][${info.level}] ${info.message}`;
});

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'verbose',
    format: combine(timestamp(), colorize(), formatter),
    transports: [
        new transports.File({
            filename: 'log/test-execution.log',
        }),
    ],
});

export { logger };
