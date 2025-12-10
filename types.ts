export enum NodeType {
  VIRUS_PROTEIN = 'Viral Protein',
  HUMAN_PROTEIN = 'Human Protein',
  DRUG = 'Drug/Compound',
  PHENOTYPE = 'Phenotype/Symptom',
  PATHWAY = 'Biological Pathway',
  // Enriched Context Types
  VARIANT = 'Variant of Concern',
  VACCINE = 'Vaccine/Therapeutic',
  SURVEILLANCE = 'Surveillance/Genomic',
  DATASET = 'Dataset/Resource',
  // KG Specific Types
  LITERATURE = 'Literature/Publication',
  GO_TERM = 'Gene Ontology (Process)',
  // Interactive Types
  QUERY = 'User Evidence',
  HYPOTHESIS = 'AI Hypothesis'
}

export interface NodeMetadata {
  doi?: string;
  authors?: string;
  year?: string;
  journal?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  description: string;
  val?: number; // For visualization size
  color?: string;
  metadata?: NodeMetadata;
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

export interface HypothesisResult {
  hypothesis: string;
  synthesis: string;
  relevantNodeIds: string[];
}

export interface AppState {
  selectedNode: GraphNode | null;
  isSidebarOpen: boolean;
  searchQuery: string;
  enrichment: Record<string, EnrichmentData | null>; // Cache by node ID
  loadingEnrichment: boolean;
}