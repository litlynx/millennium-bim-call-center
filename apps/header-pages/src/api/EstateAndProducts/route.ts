import { GetEstateAndProducts } from './service';

export async function GET() {
  return GetEstateAndProducts();
}
