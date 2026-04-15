export type Verdict = "Legal" | "Illegal" | "Gray Area" | "No Law Exists" | "Legally Unimaginable";

export interface Era {
  name: string;
  period: string;
  verdict: Verdict;
  reasoning: string;
  wildCard: string;
  whatIf: string[];
}

export interface TimelineData {
  eras: Era[];
  evolutionSummary: string;
  nextTrip: string;
}

export interface QueryNode {
  id: string;
  label: string;
  parentId: string | null;
  timestamp: number;
  data: TimelineData | null;
}

export interface HistoryItem {
  id: string;
  nodeId: string;
  label: string;
  timestamp: number;
}
