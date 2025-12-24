import "@std/dotenv/load";
import {
  AnthropicModelProvider,
  ErrorDetectionInterceptor,
  ESLintErrorDetector,
  runAgentInTerminal,
  TypeScriptErrorDetector,
  ZypherAgent,
} from "@corespeed/zypher";
import {
  CopyFileTool,
  defineEditFileTool,
  DeleteFileTool,
  GrepSearchTool,
  ListDirTool,
  ReadFileTool,
  RunTerminalCmdTool,
} from "@corespeed/zypher/tools";

function getRequiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

const prompt = await Deno.readTextFile("./prompt.md");

const workspace = "./deckspeed-template";

Deno.chdir(workspace);
console.log(` Changed working directory to: ${Deno.cwd()}`);

const zypher = new ZypherAgent(
  new AnthropicModelProvider({
    apiKey: getRequiredEnv("ANTHROPIC_API_KEY"),
  }),
  {
    customInstructions: prompt,
  },
);

const mcpServerManager = zypher.mcpServerManager;

const { EditFileTool } = defineEditFileTool();

mcpServerManager.registerTool(ReadFileTool);
mcpServerManager.registerTool(EditFileTool);
mcpServerManager.registerTool(CopyFileTool);
mcpServerManager.registerTool(DeleteFileTool);
mcpServerManager.registerTool(GrepSearchTool);
mcpServerManager.registerTool(ListDirTool);
mcpServerManager.registerTool(RunTerminalCmdTool);

const loopInterceptorManager = zypher.loopInterceptorManager;

const errorDetectionInterceptor = new ErrorDetectionInterceptor();
errorDetectionInterceptor.registerDetector(new TypeScriptErrorDetector());
errorDetectionInterceptor.registerDetector(new ESLintErrorDetector());
loopInterceptorManager.register(errorDetectionInterceptor);

await zypher.init();

await runAgentInTerminal(zypher, "claude-sonnet-4-20250514");