[v0] API route called with address: 0xE8a090Cf0a138c971ffDbdf52c2B7AD2f7bCeBb6
[v0] Fetching portfolio data for chains: all
[v0] Dune API positions error: 429 Too Many Requests - {"error":"Too many requests. Please contact sales@dune.com to increase your limit."}
[v0] Error fetching DeFi positions: Error: Failed to fetch DeFi positions: 429 Too Many Requests
    at fetchDefiPositions (file:/Users/excalibur/Desktop/dev/stratos-markets-ui/lib/dune-api.ts:148:17)
    at processTicksAndRejections (null)
  146 |       const errorText = await response.text();
  147 |       console.error(`[v0] Dune API positions error: ${response.status} ${response.statusText} - ${errorText}`);
> 148 |       throw new Error(`Failed to fetch DeFi positions: ${response.status} ${response.statusText}`);
      |                 ^
  149 |     }
  150 |
  151 |     const data = await response.json();
[v0] Error in portfolio API route: Error: Failed to fetch DeFi positions from Dune
    at fetchDefiPositions (file:/Users/excalibur/Desktop/dev/stratos-markets-ui/lib/dune-api.ts:155:15)
    at processTicksAndRejections (null)
  153 |   } catch (error) {
  154 |     console.error('[v0] Error fetching DeFi positions:', error);
> 155 |     throw new Error('Failed to fetch DeFi positions from Dune');
      |               ^
  156 |   }
  157 | }
  158 |
 GET /api/portfolio/0xE8a090Cf0a138c971ffDbdf52c2B7AD2f7bCeBb6 502 in 104ms (compile: 2ms, render: 102ms)
