import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function testCryptoPrice() {
  // Create and connect the client
  const client = new Client({ name: "crypto-price-test", version: "0.1.0" });
  await client.connect(new StdioClientTransport({
    command: "node",
    args: ["server.js"]
  }));

  try {
    // Test with Bitcoin
    console.log('Testing price fetch for Bitcoin...');
    const result = await client.callTool({
      name: "price",
      arguments: { query: "bitcoin" }
    });

    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testCryptoPrice(); 