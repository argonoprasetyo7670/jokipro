// =============================================
// AI Agent Worker — LLM Integration (OpenAI)
// =============================================

import OpenAI from "openai";
import { agentGlobalConfig } from "./config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface LLMResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number; // in USD
}

/**
 * Call the LLM with a system prompt and user prompt.
 * Returns the generated text along with token usage stats.
 */
export async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    maxTokens?: number;
    temperature?: number;
    jsonMode?: boolean;
  }
): Promise<LLMResponse> {
  const { model, maxTokens, temperature } = agentGlobalConfig.llm;

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: options?.maxTokens ?? maxTokens,
    temperature: options?.temperature ?? temperature,
    ...(options?.jsonMode && { response_format: { type: "json_object" } }),
  });

  const choice = response.choices[0];
  const usage = response.usage;

  const inputTokens = usage?.prompt_tokens ?? 0;
  const outputTokens = usage?.completion_tokens ?? 0;
  const totalTokens = inputTokens + outputTokens;

  const inputCost = (inputTokens / 1_000_000) * agentGlobalConfig.costPerMillionInput;
  const outputCost = (outputTokens / 1_000_000) * agentGlobalConfig.costPerMillionOutput;
  const estimatedCost = inputCost + outputCost;

  return {
    content: choice?.message?.content ?? "",
    inputTokens,
    outputTokens,
    totalTokens,
    estimatedCost,
  };
}

/**
 * Call LLM and parse the response as JSON.
 */
export async function callLLMJson<T = Record<string, unknown>>(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    maxTokens?: number;
    temperature?: number;
  }
): Promise<{ data: T; tokens: number; cost: number }> {
  const response = await callLLM(systemPrompt, userPrompt, {
    ...options,
    jsonMode: true,
  });

  const data = JSON.parse(response.content) as T;

  return {
    data,
    tokens: response.totalTokens,
    cost: response.estimatedCost,
  };
}
