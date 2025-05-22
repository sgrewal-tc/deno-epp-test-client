import { Client } from "./src/client.ts";
import { parseArgs } from "@std/cli/parse-args";
import { epp_login, domain_check_fee, epp_logout } from "./src/epp.ts";

const flags = parseArgs(Deno.args, {
    string: ["host", "port", "client_cert", "client_key", "domain"],
    default: { host: "epp.ote.tucowsregistry.net", domain: "sgrewal.click", port: 700, client_cert: "certs/9999-registry_a.crt", client_key: "certs/9999-registry_a.key" },
});

async function main() {
    try{
        const client = new Client(flags.host, flags.client_cert, flags.client_key);
        const start = performance.now();        
        let conn = await Client.connect(client);
        const greetingEnd = performance.now();
        conn = await Client.send(conn, epp_login());
        const loginEnd = performance.now();
        conn = await Client.send(conn, domain_check_fee(flags.domain));
        const feeCheckEnd = performance.now();
        conn = await Client.send(conn, epp_logout());
        const logoutEnd = performance.now();

        const greetingDuration = greetingEnd - start;
        const loginDuration = loginEnd - greetingEnd;
        const feeCheckDuration = feeCheckEnd - loginEnd;
        const logoutDuration = logoutEnd - feeCheckEnd;
        const totalDuration = logoutEnd - start;

        console.log(`
                     Total Duration: ${(totalDuration / 1000).toFixed(2)}s
                     Greeting Duration: ${(greetingDuration / 1000).toFixed(4)}s (${((greetingDuration / totalDuration) * 100).toFixed(0)}%)
                     Login Duration: ${(loginDuration / 1000).toFixed(4)}s (${((loginDuration / totalDuration) * 100).toFixed(0)}%)
                     Fee Check Duration: ${(feeCheckDuration / 1000).toFixed(4)}s (${((feeCheckDuration / totalDuration) * 100).toFixed(0)}%)
                     Logout Duration: ${(logoutDuration / 1000).toFixed(4)}s (${((logoutDuration / totalDuration) * 100).toFixed(0)}%)
                    `);
          
        conn.close();
    } catch (error) {
        console.error("Client error: ", error);
    }
}

main();
