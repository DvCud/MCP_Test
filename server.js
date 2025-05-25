import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { cryptoPrices } from './index.js';

// Create an MCP server instance
const server = new McpServer({
  name: 'crypto-price-server',
  version: '0.1.0',
});

/**
 * Fetches the current price of a cryptocurrency from local data
 * @param {string} query - The cryptocurrency name (e.g., "bitcoin", "ethereum")
 * @returns {Promise<Object>} - The price data in a standardized format
 */
async function fetchCryptoPrice(query) {
  try {
    const normalizedQuery = query.toLowerCase();
    if (normalizedQuery in cryptoPrices) {
      return {
        status: 'success',
        data: {
          price: cryptoPrices[normalizedQuery]
        }
      };
    }
    throw new Error('Cryptocurrency not found in database');
  } catch (error) {
    return {
      status: 'error',
      message: error.message || 'Failed to fetch cryptocurrency price'
    };
  }
}

// Register the price tool with the server
server.tool(
  'price',
  {
    query: z.string().describe('The cryptocurrency name to fetch the price for (e.g., "bitcoin")')
  },
  async ({ query }) => {
    try {
      const result = await fetchCryptoPrice(query);
      
      if (result.status === 'error') {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ],
          isError: true
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'error',
              message: error.message || 'An unexpected error occurred'
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  }
);

// Start the server
const transport = new StdioServerTransport();
server.connect(transport).catch((error) => {
  console.error('[MCP Error]', error);
  process.exit(1);
});

console.error('Crypto price MCP server running on stdio'); 