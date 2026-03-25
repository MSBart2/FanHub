const http = require("http");
const readline = require("readline");

const API_BASE_URL = process.env.FANHUB_API_URL || "http://localhost:5265";

function send(id, result) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result }) + "\n");
}

function sendError(id, code, message) {
  process.stdout.write(
    JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }) + "\n",
  );
}

function getJson(path) {
  return new Promise((resolve, reject) => {
    http
      .get(`${API_BASE_URL}${path}`, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode >= 400) {
            reject(new Error(`API returned ${res.statusCode}: ${data}`));
            return;
          }
          resolve(JSON.parse(data));
        });
      })
      .on("error", reject);
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on("line", async (line) => {
  let request;
  try {
    request = JSON.parse(line);
  } catch {
    return;
  }

  const { id, method, params } = request;

  if (method === "initialize") {
    send(id, {
      protocolVersion: "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: { name: "fanhub-api", version: "1.0.0" },
    });
    return;
  }

  if (method === "notifications/initialized") {
    return; // no response needed
  }

  if (method === "tools/list") {
    send(id, {
      tools: [
        {
          name: "get_characters",
          description: "Fetch all characters from the running FanHub API",
          inputSchema: { type: "object", properties: {} },
        },
        {
          name: "get_character_by_id",
          description:
            "Fetch a single character detail record from the running FanHub API",
          inputSchema: {
            type: "object",
            properties: {
              id: { type: "string", description: "Character ID" },
            },
            required: ["id"],
          },
        },
      ],
    });
    return;
  }

  if (method === "tools/call") {
    const tool = params.name;
    const args = params.arguments || {};

    try {
      if (tool === "get_characters") {
        const data = await getJson("/api/characters");
        send(id, { content: [{ type: "text", text: JSON.stringify(data) }] });
        return;
      }

      if (tool === "get_character_by_id") {
        const data = await getJson(`/api/characters/${args.id}`);
        send(id, { content: [{ type: "text", text: JSON.stringify(data) }] });
        return;
      }

      sendError(id, -32601, `Unknown tool: ${tool}`);
    } catch (err) {
      send(id, {
        content: [{ type: "text", text: `Error: ${err.message}` }],
        isError: true,
      });
    }
    return;
  }

  // Unknown method
  sendError(id, -32601, `Method not found: ${method}`);
});
