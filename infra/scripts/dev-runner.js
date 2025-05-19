const { spawn } = require("child_process");
const process = require("process");

// Mantém stdin ativo para evitar que o terminal trave após o processo
process.stdin.resume();

function runScript(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const isWin = process.platform === "win32";
    const cmd = isWin ? `${command}.cmd` : command;

    const child = spawn(cmd, args, {
      stdio: "inherit",
      shell: true,
      ...options,
    });

    child.on("exit", (code) => {
      code === 0
        ? resolve()
        : reject(
            new Error(`${command} ${args.join(" ")} exited with code ${code}`),
          );
    });
  });
}

async function main() {
  let app;

  async function cleanup() {
    if (app && app.killed) {
      return;
    }

    if (app && !app.killed) {
      app.kill("SIGINT");
    }

    console.log("\n🛑 Encerrando... Parando serviços Docker.");
    try {
      await runScript("npm", ["run", "services:stop"]);
    } catch (e) {
      console.error("Erro ao encerrar serviços:", e.message);
    }

    process.stdin.pause(); // Libera stdin
    process.exit(0);
  }

  // Captura Ctrl+C e SIGTERM
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  try {
    console.log("▶️ Subindo serviços...");
    await runScript("npm", ["run", "services:up"]);

    console.log("⏳ Aguardando banco de dados...");
    await runScript("npm", ["run", "services:wait:database"]);

    console.log("📦 Executando migrations...");
    await runScript("npm", ["run", "migrations:up"]);

    console.log("🚀 Iniciando app...");
    const isWin = process.platform === "win32";
    app = spawn(isWin ? "npx.cmd" : "npx", ["next", "dev"], {
      stdio: "inherit",
      shell: true,
    });

    app.on("exit", async () => {
      await cleanup();
    });
  } catch (err) {
    console.error("❌ Erro durante execução:", err.message);
    await cleanup();
  }
}

main();
