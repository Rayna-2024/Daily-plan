import "@std/dotenv/load";
import {
  AnthropicModelProvider,
  ZypherAgent,
} from "@corespeed/zypher";

function getRequiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

// Read the daily planner prompt
const dailyPlannerPrompt = `You are an AI daily planning assistant specialized in creating structured, detailed daily plans.

Your task is to analyze the user's input about their tasks, appointments, and priorities, then generate a comprehensive daily plan.

When generating a plan, you must respond with a JSON object that includes:
1. A structured daily plan with specific time blocks
2. Task prioritization and categorization
3. Realistic time estimates
4. Appropriate breaks and transitions

Format your response EXACTLY as a valid JSON object with this structure:
{
  "title": "Descriptive title for the day",
  "summary": "Brief overview of the day's focus",
  "timeBlocks": [
    {
      "id": "unique-id",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "title": "Task/Activity name",
      "description": "Detailed description",
      "category": "work|personal|health|social|learning|other",
      "priority": "high|medium|low",
      "type": "task|break|meal|commute|buffer",
      "estimatedDuration": 60
    }
  ],
  "totalTasks": 5,
  "estimatedProductiveHours": 6,
  "priorities": ["Top priority 1", "Top priority 2"],
  "notes": "Additional planning notes and recommendations"
}

Guidelines:
- Start the day around 8-9 AM unless specified otherwise
- Include appropriate breaks (15-30 min between major tasks)
- Add meal breaks (lunch, dinner if needed)
- Balance work and personal activities
- Be realistic with time estimates
- Prioritize tasks based on urgency and importance
- Consider energy levels throughout the day
- End the day at a reasonable hour (before 9 PM for evening activities)
- ONLY respond with valid JSON, no additional text or markdown formatting`;

// Initialize Zypher Agent
const zypher = new ZypherAgent(
  new AnthropicModelProvider({
    apiKey: getRequiredEnv("ANTHROPIC_API_KEY"),
  }),
  {
    customInstructions: dailyPlannerPrompt,
  },
);

await zypher.init();

console.log("✅ Zypher Agent initialized successfully");

// Create HTTP server
const port = 3001;

async function handleRequest(req: Request): Promise<Response> {
  // Enable CORS
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);

  // Health check endpoint
  if (url.pathname === "/health" && req.method === "GET") {
    return new Response(
      JSON.stringify({ 
        status: "OK", 
        message: "Zypher Daily Planning Assistant is running" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // Generate plan endpoint
  if (url.pathname === "/api/generate-plan" && req.method === "POST") {
    try {
      const body = await req.json();
      const { userInput } = body;

      if (!userInput || userInput.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: "User input is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log("📝 Generating plan for input:", userInput);

      // Use Zypher Agent to generate the plan
      const response = await zypher.generate(
        `User's request: "${userInput}"\n\nPlease create a structured daily plan based on this request. Respond ONLY with valid JSON following the format specified in your instructions.`,
        "claude-sonnet-4-20250514"
      );

      console.log("🤖 Zypher response:", response);

      // Extract the JSON from the response
      let responseText = response.trim();
      
      // Remove any markdown formatting if present
      if (responseText.startsWith('```json')) {
        responseText = responseText.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (responseText.startsWith('```')) {
        responseText = responseText.replace(/```\n?/, '').replace(/\n?```$/, '');
      }

      let planData;
      try {
        planData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse Zypher response as JSON:', parseError);
        console.log('Raw response:', responseText);
        
        // Fallback: create a basic plan structure
        planData = {
          title: `Daily Plan for ${new Date().toLocaleDateString()}`,
          summary: "A balanced day focusing on your priorities",
          timeBlocks: [
            {
              id: "morning-routine",
              startTime: "08:00",
              endTime: "09:00",
              title: "Morning Routine",
              description: "Start the day with personal preparation",
              category: "personal",
              priority: "medium",
              type: "break",
              estimatedDuration: 60
            },
            {
              id: "main-tasks",
              startTime: "09:00",
              endTime: "12:00",
              title: "Focus on Priority Tasks",
              description: userInput,
              category: "work",
              priority: "high",
              type: "task",
              estimatedDuration: 180
            },
            {
              id: "lunch-break",
              startTime: "12:00",
              endTime: "13:00",
              title: "Lunch Break",
              description: "Meal and rest time",
              category: "personal",
              priority: "medium",
              type: "meal",
              estimatedDuration: 60
            }
          ],
          totalTasks: 1,
          estimatedProductiveHours: 3,
          priorities: ["Complete main tasks from user request"],
          notes: "Plan generated based on your request. Consider breaking down large tasks into smaller, manageable chunks."
        };
      }

      // Add unique IDs and current date if missing
      const today = new Date().toISOString().split('T')[0];
      const finalPlan = {
        id: `plan-${Date.now()}`,
        date: today,
        createdAt: new Date().toISOString(),
        ...planData
      };

      // Ensure all time blocks have unique IDs
      finalPlan.timeBlocks = finalPlan.timeBlocks.map((block: any, index: number) => ({
        ...block,
        id: block.id || `block-${index + 1}-${Date.now()}`
      }));

      console.log('✅ Generated plan successfully');
      return new Response(JSON.stringify(finalPlan), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } catch (error) {
      console.error('❌ Error generating plan:', error);
      return new Response(
        JSON.stringify({ 
          error: "Failed to generate daily plan",
          details: error instanceof Error ? error.message : "Unknown error"
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  }

  // 404 for unknown routes
  return new Response(
    JSON.stringify({ error: "Not found" }),
    {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

console.log(`🚀 Zypher Daily Planning Assistant running on http://localhost:${port}`);
console.log(`📋 Health check: http://localhost:${port}/health`);
console.log(`🤖 Zypher Agent ready to generate plans!`);

Deno.serve({ port }, handleRequest);
