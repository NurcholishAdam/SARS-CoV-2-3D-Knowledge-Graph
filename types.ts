
export enum NodeType {
  VIRUS_PROTEIN = 'Viral Protein',
  VIRAL_CAPSID = 'Capsid Protein',
  VIRAL_ENVELOPE = 'Envelope Protein',
  VIRAL_MATRIX = 'Matrix Protein',
  VIRAL_NSP = 'Non-Structural Protein',
  VIRAL_SECRETED = 'Secreted/Accessory',
  FUNC_ENTRY = 'Entry Mechanism',
  FUNC_REPLICATION = 'Replication Machinery',
  FUNC_PROTEASE = 'Protease Activity',
  FUNC_IMMUNE_MOD = 'Immune Modulation',
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
  CLINICAL_TRIAL = 'Clinical Trial',
  PATIENT_COHORT = 'Patient Cohort',
  TUMOR_MARKER = 'Tumor Marker',
  GENE = 'Gene/Genetic Part',
  BACTERIA = 'Microbe/Strain',
  TOOL = 'Tool/Method',
  POLLUTANT = 'Pollutant/Factor',
  LOCATION = 'Location/Region',
  EVENT = 'Climate Event',
  SOCIO_ECONOMIC = 'Socioeconomic Factor',
  COMORBIDITY = 'Comorbidity',
  COINFECTION = 'Coinfection',
  ENVIRONMENTAL = 'Environmental Factor',
  POLICY = 'Policy/Framework',
  ETHICS = 'Ethical Concern',
  ACTOR = 'Actor/Agency',
  QUERY = 'User Evidence',
  HYPOTHESIS = 'AI Hypothesis'
}

export enum GraphDomain {
  SARS_COV_2 = 'SARS-CoV-2',
  AMR = 'Antimicrobial Resistance',
  ONCOLOGY = 'Oncology (Precision Med)', 
  NEURO = 'Neurodegenerative Disease',
  CLIMATE = 'Climate-Health',
  SYNBIO = 'Synthetic Biology',
  POLICY = 'Global Policy & Ethics',
  QUANTUM_HEALTH = 'Quantum AI in Health'
}

export interface LoreMetrics {
  complexity: {
    graphDepth: number;
    entropy: number;
    quantumCircuitDepth: number;
    tokenCount: number;
  };
  laws: {
    computeMonotonicity: boolean;
    compositionalityScore: number;
    accuracyDecay: number;
  };
  compliance: {
    nMAD: number; 
    spearman: number;
    status: 'High' | 'Partial' | 'Fail';
  };
}

export interface HypothesisResult {
  hypothesis: string;
  synthesis: string;
  relevantNodeIds: string[];
  architectureBridge: {
    coreSynthesis: string;
    lawAlignment: string;
    universalImpact: string;
    urmHybridLogic: string; // Specific to URM Hybrid repo
  };
  universalReasoning: {
    firstPrinciples: string[];
    crossDomainSynergy: { domain: string; insight: string }[];
    abstractLogicMapping: string;
    certaintyScore: number;
  };
  lore: LoreMetrics;
  reasoning: {
    intentsDetected: string[];
    steps: string[];
    biasCheck: string;
    confidenceScore: number;
    quantumStages: {
        superposition: string;
        entanglement: string;
        interference: string;
        collapse: string;
        decoherence: string;
    }
  };
  serendipityTraces?: string[];
  sources?: { title: string; uri: string }[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  description: string;
  val?: number;
  metadata?: any;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  label: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface HubProposal {
  id: string;
  nodeLabel: string;
  nodeType: NodeType;
  description: string;
  status: 'approved' | 'rejected';
  aiCritique: string;
  sources?: { title: string; uri: string }[];
  provenanceScore?: number;
}

export type LayoutMode = '3d-force' | 'dag-td' | 'radial';

export interface EnrichmentData {
  summary: string;
  sources: { title: string; uri: string }[];
  relatedTopics: string[];
}
