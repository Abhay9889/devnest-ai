const promptEl = document.getElementById("prompt");
const useCaseEl = document.getElementById("useCase");
const responseEl = document.getElementById("response");
const generateEl = document.getElementById("generate");
const clearEl = document.getElementById("clear");
const modeEl = document.getElementById("mode");
const countEl = document.getElementById("count");

promptEl.addEventListener("input", () => countEl.textContent = promptEl.value.length);

const demoResponses = {
  coding: "Prototype mode:\\n\\nBreak the request into inputs, outputs, constraints, and test cases. A production version of DevNest AI can send this prompt to Claude through the server-side /api/generate endpoint.",
  debug: "Prototype mode:\\n\\nStart with the exact error, reproduce the smallest failing case, inspect the relevant inputs and isolate the failing component. The production endpoint can ask Claude to perform this analysis.",
  explain: "Prototype mode:\\n\\nStart with a plain-language definition, then show a small example, followed by the practical developer use case. Claude can generate the full explanation when API access is configured.",
  idea: "Prototype mode:\\n\\nDefine the target developer, one painful problem, the smallest useful MVP, and measurable success criteria. The production Claude integration can turn this into a detailed roadmap."
};

async function generateResponse() {
  const prompt = promptEl.value.trim();
  if (!prompt) {
    responseEl.textContent = "Please enter a prompt first.";
    return;
  }

  generateEl.disabled = true;
  responseEl.textContent = "Thinking…";

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        prompt,
        useCase: useCaseEl.value
      })
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.demo) {
        modeEl.textContent = "DEMO";
        responseEl.textContent = demoResponses[useCaseEl.value] + "\\n\\nYour prompt:\\n" + prompt;
      } else {
        throw new Error(data.error || "Request failed");
      }
    } else {
      modeEl.textContent = "CLAUDE";
      responseEl.textContent = data.text;
    }
  } catch (err) {
    modeEl.textContent = "DEMO";
    responseEl.textContent = demoResponses[useCaseEl.value] + "\\n\\nYour prompt:\\n" + prompt;
  } finally {
    generateEl.disabled = false;
  }
}

clearEl.addEventListener("click", () => {
  promptEl.value = "";
  countEl.textContent = "0";
  modeEl.textContent = "DEMO";
  responseEl.textContent = "Your response will appear here...";
});
