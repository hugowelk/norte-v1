// Locked, voice-rule-compliant copy for the 8 values.
// Used by the results page (top 3 cards + secondary list) and the methodology page.
// Do not paraphrase, summarize, or "improve" this text.

import type { ValueKey } from './values';

export interface ValueExplanation {
  definition: string;
  pattern: string;
  cost: string;
  themes: string[];
}


export const VALUE_EXPLANATIONS: Record<ValueKey, ValueExplanation> = {
  achievement: {
    definition:
      "Achievement is the value of someone who measures time by what got built, not by how it felt. Big decisions pass through a single filter: did this move the thing forward, or did it just fill the day? Did I do what I said I'd do?",
    pattern:
      "In your scenarios, this value showed up when there was tension between progress and rest, between finishing and connecting. When the choice was between momentum and stepping away, you stayed with the work.",
    cost:
      "When this value dominates without counterweight, it turns into producing through pain, treating bodies and relationships as variables to optimize around, and a quiet inability to enjoy what you've already built before you're already chasing the next thing. The toll on physical and mental health is real if there's no balancing value pulling the other way.",
    themes: ["progress", "momentum", "follow-through"],
  },
  connection: {
    definition:
      "Connection is the value of someone who measures time by the quality of the relationships in it. The question underneath every decision is: does this bring me closer to the people who matter, or further away? Big choices pass through that filter before anything else does.",
    pattern:
      "In your scenarios, this value showed up when there was tension between efficiency and presence, between a thing that needed doing and a person who needed you. When the choice was between getting it done and being there, you were there.",
    cost:
      "When this value dominates without counterweight, it can turn into difficulty saying no, emotional load that quietly outpaces what you can carry, and a habit of postponing your own work because someone else's needs feel more urgent. The people in your life thrive. You might not.",
    themes: ["presence", "relationships", "being there"],
  },
  aliveness: {
    definition:
      "Aliveness is the value of someone who treats the body as the first instrument, not the last. The question underneath every decision is: am I going to feel this in my body tomorrow, next week, ten years from now, and will it be a feeling I want?",
    pattern:
      "In your scenarios, this value showed up when something else (work, momentum, meaning, obligation) was asking you to override what your body was telling you. When the body said enough, you stopped. When others would have kept going for the reward at the end, you took care of yourself instead.",
    cost:
      "When this value dominates without counterweight, it can become an over-attunement to current bodily comfort that blocks productive discomfort. Training, hard projects, ambitious commitments all require periods of feeling worn out. If the body's \"no\" wins every time, the bigger things you'd want for your future health never get built either.",
    themes: ["body", "rest", "recovery"],
  },
  enjoyment: {
    definition:
      "Enjoyment is the value of someone who chooses the present over the future. The question underneath every decision is: am I living this now, or am I saving it for a version of me that may never arrive?",
    pattern:
      "In your scenarios, this value showed up when something good was available now and there was a sensible reason to wait. When the choice was between a moment that wouldn't repeat and a payoff that might come later, you took the moment.",
    cost:
      "When this value dominates, it becomes a habit of instant gratification. The small good feeling now wins over the bigger shift later. Saving feels like deprivation, training feels like punishment, and the life changes that would compound never get the runway they need.",
    themes: ["the moment", "pleasure", "presence"],
  },
  meaning: {
    definition:
      "Meaning is the value of someone who needs their life to point somewhere. The question underneath every decision is: does this matter, or am I just spending hours? Without an answer, even comfort starts to feel hollow.",
    pattern:
      "In your scenarios, this value showed up when there was a pull toward something that mattered to you and a sensible reason to defer it (no time, no money, not the right moment). When the choice was between waiting for the right conditions and going in anyway, you went in.",
    cost:
      "When this value dominates without counterweight, ordinary days can start feeling like a betrayal. Rest, fun, and presence get dismissed as \"not the real stuff.\" You can also push past warning signs (in your body, in relationships, in finances) because the meaning of what you're doing seems too important to interrupt.",
    themes: ["purpose", "depth", "what matters"],
  },
  contribution: {
    definition:
      "Contribution is the value of someone who measures a life partly by what it gives back. The question underneath every decision is: am I useful here? Helping isn't a side activity, it's something the day has to make room for.",
    pattern:
      "In your scenarios, this value showed up when there was tension between your own forward motion and someone else's real need. When the choice was between protecting your trajectory and showing up for someone who was counting on you, you showed up.",
    cost:
      "When this value dominates without counterweight, your time gets quietly absorbed by other people's emergencies. You become the person who can be counted on, which is good, until \"can be counted on\" becomes the only role you know how to play. The work you'd do for yourself never quite gets the same priority.",
    themes: ["helping", "showing up", "usefulness"],
  },
  stability: {
    definition:
      "Stability is the value of someone who builds from a foundation, not from urgency. The question underneath every decision is: does this leave me with room to absorb what I can't predict, or does it spend down the buffer I worked to build?",
    pattern:
      "In your scenarios, this value showed up when something exciting required spending margin you hadn't yet recovered. When the choice was between forward motion and protecting the ground beneath you, you chose the ground. You protect what gives you better predictions of the future.",
    cost:
      "When this value dominates without counterweight, opportunities pass you by because the timing was never quite safe enough. Caution becomes the default, then the identity. The buffer you protected becomes a buffer you never spend, and the life you waited to start stays in waiting.",
    themes: ["margin", "foundation", "predictability"],
  },
  autonomy: {
    definition:
      "Autonomy is the value of someone who treats their time as the first thing worth defending. The question underneath every decision is: who controls my hours, my pace, my next move? If the answer drifts away from you, something rebalances itself.",
    pattern:
      "In your scenarios, this value showed up when external structures (relationships, obligations, comfortable arrangements) asked you to give up control of your time in exchange for something good. When the trade was real, you held onto the time.",
    cost:
      "When this value dominates without counterweight, it turns into resistance to any kind of structure, including the structures you'd actually benefit from. Commitments feel like cages before they've had a chance to feel like containers. You can end up isolated from real opportunities that ask for small commitments upfront, because the upfront feels like surrender.",
    themes: ["control of time", "independence", "pace"],
  },
};

// First sentence of the definition, used in the secondary values list.
export function getValueOneLiner(key: ValueKey): string {
  const def = VALUE_EXPLANATIONS[key].definition;
  const match = def.match(/^[^.]+\./);
  return match ? match[0] : def;
}
