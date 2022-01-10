import { transports, createLogger, format } from 'winston';
const { timestamp, splat, json, combine } = format;

const timestampStr = {
  format: 'YYYY-MM-DD HH:mm:ss',
};

const logger = createLogger({
  format: combine(timestamp(timestampStr), json()),
  transports: [new transports.Console()],
});

export default logger;
