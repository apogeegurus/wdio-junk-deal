import { createLogger, format, transports } from 'winston';
import moment from 'moment';
import { appConfig } from '../../config/appConfig';

const { combine, timestamp, colorize, printf } = format;

const formatter = printf(info => {
    return `[${moment(info.timestamp).format('MM/DD/YY-HH:mm:ss:SSSS')}][${info.level}] ${info.message}`;
});

const logger = createLogger({
    level: appConfig.get('logLevel'),
    format: combine(timestamp(), colorize(), formatter),
    transports: [
        new transports.File({
            filename: 'log/test-execution.log',
        }),
    ],
});

export { logger };
