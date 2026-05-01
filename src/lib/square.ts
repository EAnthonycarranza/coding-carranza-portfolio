import { SquareClient, SquareEnvironment } from 'square';

if (!process.env.SQUARE_ACCESS_TOKEN) {
  throw new Error('SQUARE_ACCESS_TOKEN is not defined in environment variables');
}

export const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: SquareEnvironment.Sandbox,
});

export const { payments, locations, checkout } = squareClient;
