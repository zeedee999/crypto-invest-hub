import { useQuery } from '@tanstack/react-query';

interface CryptoRates {
  [key: string]: number;
}

export interface CryptoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  circulating_supply: number;
  high_24h: number;
  low_24h: number;
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
          `/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
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

export function useCryptoMarketData() {
  return useQuery({
    queryKey: ['crypto-market-data'],
    queryFn: async (): Promise<CryptoMarketData[]> => {
      try {
        const response = await fetch(
          '/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch crypto market data');
        }

        const data = await response.json();
        console.log('Fetched crypto market data:', data);
        return data;
      } catch (error) {
        console.error('Error fetching crypto market data:', error);
        // Return fallback data if API fails
        return [
          {
            id: 'bitcoin',
            symbol: 'BTC',
            name: 'Bitcoin',
            image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
            current_price: 96000,
            market_cap: 1900000000000,
            market_cap_rank: 1,
            total_volume: 45000000000,
            price_change_percentage_24h: 2.5,
            price_change_percentage_7d: 5.2,
            circulating_supply: 19800000,
            high_24h: 97000,
            low_24h: 94500,
          },
          {
            id: 'ethereum',
            symbol: 'ETH',
            name: 'Ethereum',
            image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
            current_price: 3180,
            market_cap: 380000000000,
            market_cap_rank: 2,
            total_volume: 18000000000,
            price_change_percentage_24h: 1.8,
            price_change_percentage_7d: 3.5,
            circulating_supply: 120000000,
            high_24h: 3250,
            low_24h: 3100,
          },
          {
            id: 'tether',
            symbol: 'USDT',
            name: 'Tether',
            image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
            current_price: 1,
            market_cap: 95000000000,
            market_cap_rank: 3,
            total_volume: 65000000000,
            price_change_percentage_24h: 0.01,
            price_change_percentage_7d: 0.02,
            circulating_supply: 95000000000,
            high_24h: 1.001,
            low_24h: 0.999,
          },
          {
            id: 'binancecoin',
            symbol: 'BNB',
            name: 'BNB',
            image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
            current_price: 936,
            market_cap: 135000000000,
            market_cap_rank: 4,
            total_volume: 2800000000,
            price_change_percentage_24h: 3.2,
            price_change_percentage_7d: 6.8,
            circulating_supply: 144000000,
            high_24h: 950,
            low_24h: 920,
          },
        ];
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 20000, // Consider data stale after 20 seconds
  });
}
