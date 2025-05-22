export class Client { 
    constructor(
        public hostname: string,
        public cert: string,
        public key: string,
        public port?: number,
    ) {}

    static async connect(c:Client): Promise<Deno.TlsConn> {
        const conn = await Deno.connectTls({
            hostname: c.hostname,
            port: c.port??700,
            cert: await Deno.readTextFile(c.cert),
            key: await Deno.readTextFile(c.key)
        });
        const greetingResponse = await readResponse(conn);

        // console.log("Greeting:", greetingResponse);
        // console.log( await executeCommand(`echo '${greetingResponse.trimStart()}' | xmllint --format -`) );
        const greetingXML = await executeCommand(`echo '${greetingResponse.trimStart()}' | xmllint --format -`);
        console.log( greetingXML.split("\n").map(line => `S:   ${line}`).join("\n") );

        return conn;
    }

    static async send(c:Deno.TlsConn, xml:string): Promise<Deno.TlsConn> {
        console.log('\n');
        console.log(`${xml.split("\n").map(line => `C:   ${line}`).join("\n")}`);
        const encoder = new TextEncoder();
        const xmlBytes = encoder.encode(xml);
        const totalLength = xmlBytes.length + 4; // 4 bytes for the header

        // Create a buffer for the total length (big-endian)
        const header = new Uint8Array(4);
        new DataView(header.buffer).setUint32(0, totalLength, false); // false = big-endian
        
        // Combine the header and the XML payload
        const message = new Uint8Array(totalLength);
        message.set(header, 0);
        message.set(xmlBytes, 4);

        await c.write(message);        
        const re = await readResponse(c);
        // console.log(`\nRAW:|${re}|`);
        const responseXML = await executeCommand(`echo '${re.replace(/^.*\n/, "").trimStart()}' | xmllint --format -`);
        console.log('---');
        console.log( responseXML.split("\n").map(line => `S:   ${line}`).join("\n") );

        return c;
    }
}

async function readResponse(conn: Deno.TlsConn): Promise<string> {
    const headerBuffer = new Uint8Array(4); // Buffer for the 4-byte header
    const bytesRead = await conn.read(headerBuffer);

    if (bytesRead === null || bytesRead < 4) {
        throw new Error("Failed to read the response header");
    }

    // Use DataView to interpret the header as a 32-bit big-endian integer
    const totalLength = new DataView(headerBuffer.buffer).getUint32(0, false); // false = big-endian

    // Allocate a buffer for the remaining message
    const messageBuffer = new Uint8Array(totalLength - 4); // Exclude the header length
    let offset = 0;

    while (offset < messageBuffer.length) {
        const chunk = await conn.read(messageBuffer.subarray(offset));
        if (chunk === null) {
            throw new Error("Connection closed before the full message was received");
        }
        offset += chunk;
    }

    // Decode the message buffer into a string
    const decoder = new TextDecoder("utf-8");
    const result = decoder.decode(messageBuffer);

    return result;
}

async function executeCommand(command: string): Promise<string> {
  const process = new Deno.Command("zsh", {
    args: ["-c", command],
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stdout, stderr } = await process.output();

  if (code === 0) {
    const output = new TextDecoder().decode(stdout).trim();
    return output;
  } else {
    const error = new TextDecoder().decode(stderr).trim();
    throw new Error(error);
  }
}
  