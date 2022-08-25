import queryString from 'query-string'
import settings from "./settings";

const websocketClient = (options = {}, onConnect = null) => {
  let url = settings?.websockets?.url;
  let new_url = location.origin.replace(/^http/, 'ws')
  if (options.queryParams) {
    url = `${url}?${queryString.stringify(options.queryParams)}`;
  }
  console.log(new_url, 'the new url')
  let client = new WebSocket(new_url);
  client.addEventListener("open", () => {
    console.log(`[websockets] Connected to ${settings?.websockets?.url}`);
  });
  client.addEventListener("close", () => {
    console.log(`[websockets] Disconnected from ${settings?.websockets?.url}`);
    client = null;
    if (options?.onDisconnect) {
        options.onDisconnect();
    }
  });
  client.addEventListener("message", (event) => {
    if (event?.data && options.onMessage) {
      options.onMessage(JSON.parse(event.data));
    }
  });
  const connection = {
    client,
    send: (message = {}) => {
      if (options.queryParams) {
        message = { ...message, ...options.queryParams };
      }
      return client.send(JSON.stringify(message));
    },
  };
  if (onConnect) onConnect(connection);
  return connection;
};

export default websocketClient;
