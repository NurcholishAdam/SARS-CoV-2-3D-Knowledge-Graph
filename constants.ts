import { GraphData, NodeType } from './types';

// Color palette for node types
export const NODE_COLORS = {
  [NodeType.VIRUS_PROTEIN]: '#ef4444', // Red
  [NodeType.HUMAN_PROTEIN]: '#3b82f6', // Blue
  [NodeType.DRUG]: '#10b981', // Emerald
  [NodeType.PHENOTYPE]: '#f59e0b', // Amber
  [NodeType.PATHWAY]: '#8b5cf6', // Violet
};

export const INITIAL_GRAPH_DATA: GraphData = {
  nodes: [
    // Viral Proteins
    { id: 'S', label: 'Spike Protein (S)', type: NodeType.VIRUS_PROTEIN, description: 'Main target for neutralizing antibodies and entry into host cells.', val: 20 },
    { id: 'Mpro', label: 'Main Protease (Mpro)', type: NodeType.VIRUS_PROTEIN, description: 'Essential for viral replication and transcription.', val: 15 },
    { id: 'N', label: 'Nucleocapsid (N)', type: NodeType.VIRUS_PROTEIN, description: 'Packages the viral genome into a helical ribonucleoprotein.', val: 12 },
    { id: 'RdRp', label: 'RdRp (nsp12)', type: NodeType.VIRUS_PROTEIN, description: 'RNA-dependent RNA polymerase, engine of viral replication.', val: 15 },
    { id: 'E', label: 'Envelope (E)', type: NodeType.VIRUS_PROTEIN, description: 'Involved in assembly and release of virions.', val: 8 },

    // Human Proteins
    { id: 'ACE2', label: 'ACE2', type: NodeType.HUMAN_PROTEIN, description: 'Angiotensin-converting enzyme 2, the main receptor for SARS-CoV-2.', val: 18 },
    { id: 'TMPRSS2', label: 'TMPRSS2', type: NodeType.HUMAN_PROTEIN, description: 'Serine protease that primes the Spike protein.', val: 15 },
    { id: 'IL6', label: 'IL-6', type: NodeType.HUMAN_PROTEIN, description: 'Pro-inflammatory cytokine involved in cytokine storm.', val: 12 },
    { id: 'FURIN', label: 'Furin', type: NodeType.HUMAN_PROTEIN, description: 'Protease that cleaves Spike protein at the S1/S2 site.', val: 10 },

    // Drugs
    { id: 'Remdesivir', label: 'Remdesivir', type: NodeType.DRUG, description: 'Broad-spectrum antiviral medication.', val: 10 },
    { id: 'Paxlovid', label: 'Paxlovid', type: NodeType.DRUG, description: 'Oral antiviral drug targeting Mpro.', val: 12 },
    { id: 'Dexamethasone', label: 'Dexamethasone', type: NodeType.DRUG, description: 'Corticosteroid used for anti-inflammatory effects.', val: 10 },
    { id: 'Tocilizumab', label: 'Tocilizumab', type: NodeType.DRUG, description: 'Monoclonal antibody against IL-6 receptor.', val: 10 },

    // Phenotypes
    { id: 'Hypoxia', label: 'Hypoxia', type: NodeType.PHENOTYPE, description: 'Low oxygen levels in tissues.', val: 8 },
    { id: 'Fever', label: 'Fever', type: NodeType.PHENOTYPE, description: 'Elevated body temperature.', val: 8 },
    { id: 'CytokineStorm', label: 'Cytokine Storm', type: NodeType.PHENOTYPE, description: 'Severe immune reaction.', val: 15 },
    { id: 'Anosmia', label: 'Anosmia', type: NodeType.PHENOTYPE, description: 'Loss of smell.', val: 6 },
    
    // Pathways
    { id: 'Apoptosis', label: 'Apoptosis', type: NodeType.PATHWAY, description: 'Programmed cell death.', val: 10 },
    { id: 'Inflammation', label: 'Inflammation', type: NodeType.PATHWAY, description: 'Immune system response.', val: 12 },
  ],
  links: [
    // Viral-Human Interactions
    { source: 'S', target: 'ACE2', label: 'Binds to' },
    { source: 'ACE2', target: 'TMPRSS2', label: 'Co-expressed' },
    { source: 'S', target: 'TMPRSS2', label: 'Primed by' },
    { source: 'S', target: 'FURIN', label: 'Cleaved by' },
    
    // Drug Targets
    { source: 'Remdesivir', target: 'RdRp', label: 'Inhibits' },
    { source: 'Paxlovid', target: 'Mpro', label: 'Inhibits' },
    { source: 'Tocilizumab', target: 'IL6', label: 'Antagonizes' },
    
    // Pathophysiology
    { source: 'S', target: 'CytokineStorm', label: 'Triggers' },
    { source: 'IL6', target: 'CytokineStorm', label: 'Mediates' },
    { source: 'CytokineStorm', target: 'Fever', label: 'Causes' },
    { source: 'CytokineStorm', target: 'Hypoxia', label: 'Leads to' },
    { source: 'ACE2', target: 'Inflammation', label: 'Regulates' },
    { source: 'Mpro', target: 'Apoptosis', label: 'Induces' },
  ]
};