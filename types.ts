export enum NodeType {
  VIRUS_PROTEIN = 'Viral Protein',
  HUMAN_PROTEIN = 'Human Protein',
  DRUG = 'Drug/Compound',
  PHENOTYPE = 'Phenotype/Symptom',
  PATHWAY = 'Biological Pathway'
}

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  description: string;
  val?: number; // For visualization size
  color?: string;
}

export interface GraphLink {
  source: string | GraphNode; // force-graph-3d mutates this to object
  target: string | GraphNode;
  label: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface EnrichmentData {
  summary: string;
  sources: { title: string; uri: string }[];
  relatedTopics: string[];
}

export interface AppState {
  selectedNode: GraphNode | null;
  isSidebarOpen: boolean;
  searchQuery: string;
  enrichment: Record<string, EnrichmentData | null>; // Cache by node ID
  loadingEnrichment: boolean;
}