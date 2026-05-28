import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert curriculum designer for an Excel/spreadsheet teaching platform. You help teachers create interactive learning modules.

The platform supports these step types:
- "instruction": Text content explaining a concept
- "task": Spreadsheet tasks where students fill in cells with values/formulas
- "quiz": Multiple-choice or short-answer questions

When generating content, return valid JSON matching the requested action schema exactly. Be educational, clear, and age-appropriate for secondary school students.

IMPORTANT RULES:
- Cell references use A1 notation (e.g. A1, B5, C3)
- Formulas start with = (e.g. =SUM(B2:B4))
- Keep instructions concise but informative
- Include "why it matters" explanations to motivate students
- Quiz options should have plausible distractors
- Spreadsheet tasks should have realistic data scenarios
- XP values: simple tasks 5-10, medium 15-25, hard 30-50`;

const TOOL_SCHEMAS = {
  generate_module: {
    type: "function",
    function: {
      name: "generate_module",
      description: "Generate a complete module with lessons and steps",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          estimatedMinutes: { type: "number" },
          lessons: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                steps: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      instruction: { type: "string" },
                      type: { type: "string", enum: ["instruction", "task", "quiz"] },
                      whyItMatters: { type: "string" },
                      quiz: {
                        type: "object",
                        properties: {
                          type: { type: "string", enum: ["multiple-choice", "short-answer"] },
                          options: { type: "array", items: { type: "string" } },
                          correctAnswer: { type: "string" },
                          acceptableAnswers: { type: "array", items: { type: "string" } },
                          explanation: { type: "string" },
                        },
                        required: ["type", "correctAnswer"],
                      },
                      initialSheetState: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          celldata: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                r: { type: "number" },
                                c: { type: "number" },
                                v: {
                                  type: "object",
                                  properties: {
                                    v: {},
                                    m: { type: "string" },
                                    f: { type: "string" },
                                    bl: { type: "number" },
                                  },
                                },
                              },
                              required: ["r", "c", "v"],
                            },
                          },
                          row: { type: "number" },
                          column: { type: "number" },
                        },
                        required: ["name", "celldata", "row", "column"],
                      },
                      task: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          expectations: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                cellRef: { type: "string" },
                                expectedValue: {},
                                expectedFormula: { type: "string" },
                                checkFormula: { type: "boolean" },
                                tolerancePercent: { type: "number" },
                              },
                              required: ["cellRef"],
                            },
                          },
                          editableCells: { type: "array", items: { type: "string" } },
                          hints: { type: "array", items: { type: "string" } },
                          successMessage: { type: "string" },
                          almostCorrectMessage: { type: "string" },
                          incorrectMessage: { type: "string" },
                          xpValue: { type: "number" },
                          bonusXp: { type: "number" },
                        },
                        required: ["id", "expectations", "editableCells", "hints", "successMessage", "xpValue"],
                      },
                    },
                    required: ["title", "instruction", "type"],
                  },
                },
              },
              required: ["title", "description", "steps"],
            },
          },
        },
        required: ["title", "description", "estimatedMinutes", "lessons"],
        additionalProperties: false,
      },
    },
  },

  generate_step: {
    type: "function",
    function: {
      name: "generate_step",
      description: "Generate a single step (instruction, task, or quiz)",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          instruction: { type: "string" },
          type: { type: "string", enum: ["instruction", "task", "quiz"] },
          whyItMatters: { type: "string" },
          quiz: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["multiple-choice", "short-answer"] },
              options: { type: "array", items: { type: "string" } },
              correctAnswer: { type: "string" },
              acceptableAnswers: { type: "array", items: { type: "string" } },
              explanation: { type: "string" },
            },
            required: ["type", "correctAnswer"],
          },
          initialSheetState: {
            type: "object",
            properties: {
              name: { type: "string" },
              celldata: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    r: { type: "number" },
                    c: { type: "number" },
                    v: { type: "object", properties: { v: {}, m: { type: "string" }, f: { type: "string" }, bl: { type: "number" } } },
                  },
                  required: ["r", "c", "v"],
                },
              },
              row: { type: "number" },
              column: { type: "number" },
            },
            required: ["name", "celldata", "row", "column"],
          },
          task: {
            type: "object",
            properties: {
              id: { type: "string" },
              expectations: {
                type: "array",
                items: {
                  type: "object",
                  properties: { cellRef: { type: "string" }, expectedValue: {}, expectedFormula: { type: "string" }, checkFormula: { type: "boolean" }, tolerancePercent: { type: "number" } },
                  required: ["cellRef"],
                },
              },
              editableCells: { type: "array", items: { type: "string" } },
              hints: { type: "array", items: { type: "string" } },
              successMessage: { type: "string" },
              almostCorrectMessage: { type: "string" },
              incorrectMessage: { type: "string" },
              xpValue: { type: "number" },
              bonusXp: { type: "number" },
            },
            required: ["id", "expectations", "editableCells", "hints", "successMessage", "xpValue"],
          },
        },
        required: ["title", "instruction", "type"],
        additionalProperties: false,
      },
    },
  },

  improve_content: {
    type: "function",
    function: {
      name: "improve_content",
      description: "Return improved versions of the provided fields",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          instruction: { type: "string" },
          whyItMatters: { type: "string" },
        },
        required: ["title", "instruction"],
        additionalProperties: false,
      },
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    if (!AI_API_KEY) throw new Error("AI_API_KEY is not configured");

    const { action, prompt, context } = await req.json();

    if (!action || !prompt) {
      return new Response(JSON.stringify({ error: "action and prompt are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const toolSchema = TOOL_SCHEMAS[action as keyof typeof TOOL_SCHEMAS];
    if (!toolSchema) {
      return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userMessage = context
      ? `Context about the current module:\n${JSON.stringify(context, null, 2)}\n\nUser request: ${prompt}`
      : prompt;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        tools: [toolSchema],
        tool_choice: { type: "function", function: { name: toolSchema.function.name } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      return new Response(JSON.stringify({ error: "AI did not return structured output" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ action, result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-module-assist error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
