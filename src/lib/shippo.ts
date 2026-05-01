import { Shippo } from 'shippo';

if (!process.env.SHIPPO_API_KEY) {
  throw new Error('SHIPPO_API_KEY is not defined in environment variables');
}

export const shippoClient = new Shippo({
  apiKeyHeader: process.env.SHIPPO_API_KEY,
});
