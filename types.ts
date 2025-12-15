
export enum NodeType {
  // Bio / Viral Components
  VIRUS_PROTEIN = 'Viral Protein', // Generic
  VIRAL_CAPSID = 'Capsid Protein', // N
  VIRAL_ENVELOPE = 'Envelope Protein', // E
  VIRAL_MATRIX = 'Matrix Protein', // M
  VIRAL_NSP = 'Non-Structural Protein', // NSP1-16
  VIRAL_SECRETED = 'Secreted/Accessory', // ORF8, etc.
  
  // Viral Functions
  FUNC_ENTRY = 'Entry Mechanism',
  FUNC_REPLICATION = 'Replication Machinery',
  FUNC_PROTEASE = 'Protease Activity',
  FUNC_IMMUNE_MOD = 'Immune Modulation',

  // General Bio
  HUMAN_PROTEIN = 'Human Protein',
  DRUG = 'Drug/Compound',
  PHENOTYPE = 'Phenotype/Symptom',
  PATHWAY = 'Biological Pathway',
  VARIANT = 'Variant',
  VACCINE = 'Vaccine/Therapeutic',
  SURVEILLANCE = 'Surveillance',
  DATASET = 'Dataset',
  LITERATURE = 'Literature',
  GO_TERM = 'Process',
  
  // Clinical / Oncology
  CLINICAL_TRIAL = 'Clinical Trial',
  PATIENT_COHORT = 'Patient Cohort',
  TUMOR_MARKER = 'Tumor Marker',
  
  // AMR & SynBio
  GENE = 'Gene/Genetic Part',
  BACTERIA = 'Microbe/Strain',
  TOOL = 'Tool/Method', // CRISPR, etc.
  
  // Climate & Env
  POLLUTANT = 'Pollutant/Factor',
  LOCATION = 'Location/Region',
  EVENT = 'Climate Event',
  
  // Policy & Ethics
  POLICY = 'Policy/Framework',
  ETHICS = 'Ethical Concern',
  ACTOR = 'Actor/Agency',

  // Interactive
  QUERY = 'User Evidence',
  HYPOTHESIS = 'AI Hypothesis'
}

export enum GraphDomain {
  SARS_COV_2 = 'SARS-CoV-2',
  AMR = 'Antimicrobial Resistance',
  ONCOLOGY = 'Oncology (Precision Med)', // New Domain
  NEURO = 'Neurodegenerative Disease',
  CLIMATE = 'Climate-Health',
  SYNBIO = 'Synthetic Biology',
  POLICY = 'Global Policy & Ethics',
  QUANTUM_HEALTH = 'Quantum AI in Health'
}

export interface NodeMetadata {
  doi?: string;
  authors?: string;
  year?: string;
  journal?: string;
  pdbId?: string; // For 3D Structure Viewer
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
  reasoning: {
    intentsDetected: string[]; // Multi-intent support
    steps: string[];
    biasCheck: string;
    confidenceScore: number; // 0-100
  };
  quantumScore?: number; // Hybrid Classical-Quantum Score
  sources?: { title: string; uri: string }[];
}

export interface AppState {
  selectedNode: GraphNode | null;
  isSidebarOpen: boolean;
  searchQuery: string;
  enrichment: Record<string, EnrichmentData | null>; // Cache by node ID
  loadingEnrichment: boolean;
}

export interface HubProposal {
    id: string;
    nodeLabel: string;
    nodeType: NodeType;
    description: string;
    status: 'pending' | 'approved' | 'rejected';
    aiCritique?: string;
    sources?: { title: string; uri: string }[];
    provenanceScore?: number; // Governance checkpoint
}

export type LayoutMode = '3d-force' | 'dag-td' | 'dag-lr' | 'radial';
