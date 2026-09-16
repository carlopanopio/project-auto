// Live in n8n as "Interview Bot - KB Ingestion" (id Uy37D85QEfkKCjub).
// This file is the source that created it, via the n8n MCP workflow SDK. If you edit
// the workflow in the n8n UI, this file goes stale — update it or treat n8n as canonical.
import { workflow, node, trigger, newCredential, expr } from '@n8n/workflow-sdk';

const ingestWebhook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'KB Ingest Webhook',
    parameters: {
      httpMethod: 'POST',
      path: 'interview-kb-ingest',
      responseMode: 'responseNode',
      authentication: 'headerAuth',
      options: {}
    },
    credentials: { httpHeaderAuth: newCredential('Interview KB Ingest Token') },
    position: [0, 0]
  },
  output: [{ body: { markdown: '# Interview Knowledge Base\n\n## Career timeline\n\n2011-2013 .NET Developer' } }]
});

const clearExistingChunks = node({
  type: 'n8n-nodes-base.postgres',
  version: 2.5,
  config: {
    name: 'Clear Existing Chunks',
    parameters: {
      resource: 'database',
      operation: 'executeQuery',
      query: 'DELETE FROM interview.chunks;',
      options: {}
    },
    credentials: { postgres: { id: 'QjJ9PL3qaHB2TfIo', name: 'Demo - Postgres account' } },
    alwaysOutputData: true,
    position: [224, 0]
  },
  output: [{ success: true }]
});

const chunkMarkdown = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Chunk Markdown',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: 'const markdown = $("KB Ingest Webhook").first().json.body?.markdown ?? "";\n'
        + 'if (!markdown.trim()) { throw new Error("No markdown in request body"); }\n'
        + 'const MAX_CHARS = 1500;\n'
        + 'const MIN_SUBSTANCE = 60;\n'
        + 'function stripScaffolding(body) {\n'
        + '  const lines = body.split("\\n");\n'
        + '  const kept = [];\n'
        + '  for (let i = 0; i < lines.length; i++) {\n'
        + '    const line = lines[i];\n'
        + '    if (/^\\s*[-*]?\\s*\\*{0,2}TODO/.test(line)) {\n'
        + '      while (i + 1 < lines.length && /^\\s{2,}\\S/.test(lines[i + 1]) && !/^\\s*>/.test(lines[i + 1]) && !/^\\s*[-*]\\s/.test(lines[i + 1]) && !/^#{1,6}\\s/.test(lines[i + 1])) { i++; }\n'
        + '      continue;\n'
        + '    }\n'
        + '    if (/^\\s*>/.test(line)) {\n'
        + '      const answer = line.replace(/^\\s*>\\s?/, "").trim();\n'
        + '      if (answer) kept.push(answer);\n'
        + '      continue;\n'
        + '    }\n'
        + '    kept.push(line);\n'
        + '  }\n'
        + '  return kept.join("\\n").replace(/\\n{3,}/g, "\\n\\n").trim();\n'
        + '}\n'
        + 'function substance(text) { return text.replace(/[>#|*_\\-\\s]/g, "").length; }\n'
        + 'const sections = markdown.split(/\\n(?=## )/g);\n'
        + 'const chunks = [];\n'
        + 'for (const section of sections) {\n'
        + '  const text = section.trim();\n'
        + '  if (!text || !text.startsWith("## ")) continue;\n'
        + '  const headingMatch = text.match(/^##\\s+(.+)$/m);\n'
        + '  const heading = (headingMatch ? headingMatch[1] : "Overview").replace(/^\\d+\\.\\s*/, "").trim();\n'
        + '  if (/out of scope/i.test(heading)) continue;\n'
        + '  const body = stripScaffolding(text);\n'
        + '  if (substance(body) < MIN_SUBSTANCE) continue;\n'
        + '  if (body.length <= MAX_CHARS) { chunks.push({ section: heading, content: body }); continue; }\n'
        + '  let buffer = "";\n'
        + '  for (const para of body.split(/\\n\\n+/)) {\n'
        + '    if ((buffer + "\\n\\n" + para).length > MAX_CHARS && buffer) { chunks.push({ section: heading, content: buffer.trim() }); buffer = para; }\n'
        + '    else { buffer = buffer ? buffer + "\\n\\n" + para : para; }\n'
        + '  }\n'
        + '  if (buffer.trim()) chunks.push({ section: heading, content: buffer.trim() });\n'
        + '}\n'
        + 'if (!chunks.length) { throw new Error("KB produced no chunks - is it still all TODOs?"); }\n'
        + 'return chunks.map(c => ({ json: c }));'
    },
    position: [448, 0]
  },
  output: [{ section: 'Career timeline', content: '2011-2013 .NET Developer, Energy sector' }]
});

const embedChunk = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.3,
  config: {
    name: 'Embed Chunk',
    parameters: {
      method: 'POST',
      url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googlePalmApi',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: expr('{{ { "content": { "parts": [ { "text": $json.section + "\\n\\n" + $json.content } ] }, "outputDimensionality": 768 } }}')
    },
    credentials: { googlePalmApi: { id: 'zfL3ogvPQnlrVBZv', name: 'Demo - Gemini API' } },
    position: [672, 0]
  },
  output: [{ embedding: { values: [0.01, 0.02, 0.03] } }]
});

const storeChunk = node({
  type: 'n8n-nodes-base.postgres',
  version: 2.5,
  config: {
    name: 'Store Chunk',
    parameters: {
      resource: 'database',
      operation: 'executeQuery',
      query: 'INSERT INTO interview.chunks (section, content, embedding) VALUES ($1, $2, $3::extensions.vector);',
      options: { queryReplacement: expr('{{ [$("Chunk Markdown").item.json.section, $("Chunk Markdown").item.json.content, "[" + $json.embedding.values.join(",") + "]"] }}') }
    },
    credentials: { postgres: { id: 'QjJ9PL3qaHB2TfIo', name: 'Demo - Postgres account' } },
    position: [896, 0]
  },
  output: [{ success: true }]
});

const respondIngested = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.4,
  config: {
    name: 'Respond Ingested',
    parameters: {
      respondWith: 'json',
      responseBody: expr('{{ { "ok": true, "chunks": $("Chunk Markdown").all().length } }}'),
      options: {}
    },
    executeOnce: true,
    position: [1120, 0]
  }
});

export default workflow('interview-bot-ingest', 'Interview Bot - KB Ingestion')
  .add(ingestWebhook)
  .to(clearExistingChunks)
  .to(chunkMarkdown)
  .to(embedChunk)
  .to(storeChunk)
  .to(respondIngested);
