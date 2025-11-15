import { useQuery } from '@tanstack/react-query';

interface CryptoRates {
  [key: string]: number;
}

const COINGECKO_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  USDT: 'tether',
  BNB: 'binancecoin',
};

export function useCryptoRates() {
  return useQuery({
    queryKey: ['crypto-rates'],
    queryFn: async (): Promise<CryptoRates> => {
      try {
        const ids = Object.values(COINGECKO_IDS).join(',');
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch crypto rates');
        }

        const data = await response.json();

        // Convert CoinGecko format to our format
        const rates: CryptoRates = {};
        Object.entries(COINGECKO_IDS).forEach(([symbol, id]) => {
          rates[symbol] = data[id]?.usd || 0;
        });

        console.log('Fetched crypto rates:', rates);
        return rates;
      } catch (error) {
        console.error('Error fetching crypto rates:', error);
        // Return fallback rates if API fails
        return {
          BTC: 96000,
          ETH: 3180,
          USDT: 1,
          BNB: 936,
        };
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 20000, // Consider data stale after 20 seconds
  });
}
