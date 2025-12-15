import { GraphData, NodeType, GraphDomain } from './types';

// Color palette for node types
export const NODE_COLORS = {
  // Bio / Viral Detail
  [NodeType.VIRUS_PROTEIN]: '#ef4444', // Red Base
  [NodeType.VIRAL_CAPSID]: '#f472b6', // Pink
  [NodeType.VIRAL_ENVELOPE]: '#db2777', // Dark Pink
  [NodeType.VIRAL_MATRIX]: '#9d174d', // Maroon
  [NodeType.VIRAL_NSP]: '#a855f7', // Purple (Non-structural)
  [NodeType.VIRAL_SECRETED]: '#c084fc', // Light Purple
  
  // Functions
  [NodeType.FUNC_ENTRY]: '#fca5a5', // Light Red
  [NodeType.FUNC_REPLICATION]: '#fbbf24', // Amber
  [NodeType.FUNC_PROTEASE]: '#ef4444', // Red
  [NodeType.FUNC_IMMUNE_MOD]: '#f97316', // Orange

  [NodeType.HUMAN_PROTEIN]: '#3b82f6', // Blue
  [NodeType.DRUG]: '#10b981', // Emerald
  [NodeType.PHENOTYPE]: '#f59e0b', // Amber
  [NodeType.PATHWAY]: '#8b5cf6', // Violet
  [NodeType.VARIANT]: '#ec4899', // Pink
  [NodeType.VACCINE]: '#06b6d4', // Cyan
  [NodeType.SURVEILLANCE]: '#f97316', // Orange
  [NodeType.DATASET]: '#64748b', // Slate
  [NodeType.LITERATURE]: '#e2e8f0', // Light Gray
  [NodeType.GO_TERM]: '#84cc16', // Lime
  
  // Clinical / Oncology
  [NodeType.CLINICAL_TRIAL]: '#0ea5e9', // Sky Blue
  [NodeType.PATIENT_COHORT]: '#6366f1', // Indigo
  [NodeType.TUMOR_MARKER]: '#f43f5e', // Rose
  
  // AMR & SynBio
  [NodeType.GENE]: '#d946ef', // Fuchsia
  [NodeType.BACTERIA]: '#a3e635', // Lime Green
  [NodeType.TOOL]: '#22d3ee', // Cyan
  
  // Climate
  [NodeType.POLLUTANT]: '#71717a', // Zinc
  [NodeType.LOCATION]: '#facc15', // Yellow
  [NodeType.EVENT]: '#f43f5e', // Rose
  
  // Policy
  [NodeType.POLICY]: '#6366f1', // Indigo
  [NodeType.ETHICS]: '#fbbf24', // Amber
  [NodeType.ACTOR]: '#14b8a6', // Teal

  // Interactive
  [NodeType.QUERY]: '#ffffff', // White
  [NodeType.HYPOTHESIS]: '#d946ef', // Magenta
};

const SARS_DATA: GraphData = {
  nodes: [
    // --- Structural Proteins (Added PDB IDs) ---
    { id: 'S', label: 'Spike (S)', type: NodeType.VIRUS_PROTEIN, description: 'Trimeric surface glycoprotein mediating entry.', val: 30, metadata: { pdbId: '6VXX' } },
    { id: 'N', label: 'Nucleocapsid (N)', type: NodeType.VIRAL_CAPSID, description: 'Encapsulates genome, highly immunogenic, critical for packaging.', val: 22, metadata: { pdbId: '6VYO' } },
    { id: 'M', label: 'Membrane (M)', type: NodeType.VIRAL_MATRIX, description: 'Most abundant structural protein, defines viral shape.', val: 20 },
    { id: 'E', label: 'Envelope (E)', type: NodeType.VIRAL_ENVELOPE, description: 'Small protein involved in assembly and release; ion channel activity.', val: 18, metadata: { pdbId: '5X29' } },

    // --- Non-Structural Proteins (NSPs) ---
    { id: 'NSP1', label: 'NSP1', type: NodeType.VIRAL_NSP, description: 'Host shutdown factor; inhibits host translation.', val: 20 },
    { id: 'NSP3', label: 'NSP3 (PLpro)', type: NodeType.VIRAL_NSP, description: 'Large multi-domain protein; Papain-like protease activity.', val: 22, metadata: { pdbId: '6W9C' } },
    { id: 'NSP5', label: 'NSP5 (Mpro)', type: NodeType.VIRAL_NSP, description: 'Main protease; cleaves viral polyprotein.', val: 25, metadata: { pdbId: '6LU7' } },
    { id: 'NSP12', label: 'NSP12 (RdRp)', type: NodeType.VIRAL_NSP, description: 'RNA-dependent RNA polymerase; core of replication machinery.', val: 25, metadata: { pdbId: '7BV2' } },
    { id: 'NSP13', label: 'NSP13 (Helicase)', type: NodeType.VIRAL_NSP, description: 'Unwinds RNA during replication.', val: 18 },
    
    // --- Secreted / Accessory ---
    { id: 'ORF8', label: 'ORF8', type: NodeType.VIRAL_SECRETED, description: 'Secreted protein; downregulates MHC-I, linked to immune evasion.', val: 20, metadata: { pdbId: '7JTL' } },
    { id: 'ORF3a', label: 'ORF3a', type: NodeType.VIRAL_SECRETED, description: 'Viroporin; induces apoptosis and inflammation.', val: 18 },

    // --- Human Targets ---
    { id: 'ACE2', label: 'ACE2', type: NodeType.HUMAN_PROTEIN, description: 'Angiotensin-converting enzyme 2 receptor.', val: 18, metadata: { pdbId: '6M0J' } },
    { id: 'TMPRSS2', label: 'TMPRSS2', type: NodeType.HUMAN_PROTEIN, description: 'Protease priming Spike for entry.', val: 18 },
    
    // --- Drugs ---
    { id: 'Paxlovid', label: 'Paxlovid', type: NodeType.DRUG, description: 'Nirmatrelvir (Mpro inhibitor) + Ritonavir.', val: 20 },
    { id: 'Remdesivir', label: 'Remdesivir', type: NodeType.DRUG, description: 'Nucleoside analog inhibiting RdRp.', val: 18 },
    { id: 'Molnupiravir', label: 'Molnupiravir', type: NodeType.DRUG, description: 'Induces lethal mutagenesis via RdRp.', val: 18 },

    // --- Phenotypes ---
    { id: 'ImmuneEscape', label: 'Immune Escape', type: NodeType.PHENOTYPE, description: 'Evasion of neutralizing antibodies.', val: 20 },
    { id: 'SevereDisease', label: 'Severe Disease', type: NodeType.PHENOTYPE, description: 'Hospitalization, hypoxia, organ failure.', val: 20 },

    // --- Functional Categories (Abstract Nodes for grouping) ---
    { id: 'Func:Entry', label: 'Viral Entry', type: NodeType.FUNC_ENTRY, description: 'Mechanisms of cell invasion.', val: 15 },
    { id: 'Func:Replication', label: 'Replication Complex', type: NodeType.FUNC_REPLICATION, description: 'RNA synthesis machinery.', val: 15 },
    { id: 'Func:ImmuneMod', label: 'Immune Modulation', type: NodeType.FUNC_IMMUNE_MOD, description: 'Interference with host interferon response.', val: 15 },

    // --- Literature ---
    { id: 'Paper:Hoffmann', label: 'Hoffmann et al.', type: NodeType.LITERATURE, description: 'Identified ACE2 entry.', val: 10, metadata: { authors: 'Hoffmann et al.', year: '2020', journal: 'Cell', doi: '10.1016/j.cell.2020.02.052' } },
  ],
  links: [
    // Structural Links
    { source: 'S', target: 'Func:Entry', label: 'MEDIATES' },
    { source: 'S', target: 'ACE2', label: 'BINDS' },
    { source: 'S', target: 'TMPRSS2', label: 'CLEAVED_BY' },
    { source: 'N', target: 'Func:Replication', label: 'STABILIZES_RNA' },
    { source: 'E', target: 'Func:Entry', label: 'ASSISTS_ASSEMBLY' },

    // NSP Function Links
    { source: 'NSP1', target: 'Func:ImmuneMod', label: 'INHIBITS_INTERFERON' },
    { source: 'NSP3', target: 'Func:ImmuneMod', label: 'DEUBIQUITINATES' },
    { source: 'NSP5', target: 'Func:Replication', label: 'PROCESSES_POLYPROTEIN' },
    { source: 'NSP12', target: 'Func:Replication', label: 'DRIVES_SYNTHESIS' },
    { source: 'NSP13', target: 'Func:Replication', label: 'UNWINDS_RNA' },

    // Accessory Links
    { source: 'ORF8', target: 'Func:ImmuneMod', label: 'DOWNREGULATES_MHC_I' },
    { source: 'ORF8', target: 'ImmuneEscape', label: 'CONTRIBUTES_TO' },
    { source: 'ORF8', target: 'SevereDisease', label: 'CORRELATES_WITH' },
    { source: 'ORF3a', target: 'SevereDisease', label: 'INDUCES_INFLAMMATION' },

    // Drug Interactions
    { source: 'Paxlovid', target: 'NSP5', label: 'INHIBITS' },
    { source: 'Remdesivir', target: 'NSP12', label: 'INHIBITS' },
    { source: 'Molnupiravir', target: 'NSP12', label: 'MUTATES_VIA' },

    // Literature
    { source: 'Paper:Hoffmann', target: 'ACE2', label: 'IDENTIFIES' },
  ]
};

const ONCOLOGY_DATA: GraphData = {
    nodes: [
        { id: 'EGFR', label: 'EGFR', type: NodeType.HUMAN_PROTEIN, description: 'Epidermal Growth Factor Receptor.', val: 25, metadata: { pdbId: '1IVO' } },
        { id: 'KRAS', label: 'KRAS', type: NodeType.HUMAN_PROTEIN, description: 'GTPase, common oncogene.', val: 25, metadata: { pdbId: '4OBE' } },
        { id: 'G12C', label: 'KRAS G12C', type: NodeType.VARIANT, description: 'Specific mutation targeted by Sotorasib.', val: 20 },
        { id: 'Sotorasib', label: 'Sotorasib', type: NodeType.DRUG, description: 'Inhibitor of KRAS G12C.', val: 22 },
        { id: 'Osimertinib', label: 'Osimertinib', type: NodeType.DRUG, description: '3rd gen EGFR TKI.', val: 22 },
        { id: 'LungCancer', label: 'NSCLC', type: NodeType.PHENOTYPE, description: 'Non-Small Cell Lung Cancer.', val: 30 },
        { id: 'Trial:CodeBreaK', label: 'CodeBreaK 100', type: NodeType.CLINICAL_TRIAL, description: 'Phase 2 trial of Sotorasib.', val: 18, metadata: { year: '2021', journal: 'NEJM' } },
        { id: 'Cohort:Smokers', label: 'Smoker Cohort', type: NodeType.PATIENT_COHORT, description: 'Patients with history of smoking.', val: 15 },
    ],
    links: [
        { source: 'KRAS', target: 'G12C', label: 'MUTATES_TO' },
        { source: 'G12C', target: 'LungCancer', label: 'DRIVES' },
        { source: 'Sotorasib', target: 'G12C', label: 'INHIBITS' },
        { source: 'Trial:CodeBreaK', target: 'Sotorasib', label: 'INVESTIGATES' },
        { source: 'Trial:CodeBreaK', target: 'LungCancer', label: 'TREATS' },
        { source: 'Cohort:Smokers', target: 'G12C', label: 'HIGH_PREVALENCE' },
        { source: 'EGFR', target: 'LungCancer', label: 'DRIVES' },
        { source: 'Osimertinib', target: 'EGFR', label: 'INHIBITS' }
    ]
};

const AMR_DATA: GraphData = {
  nodes: [
    { id: 'NDM-1', label: 'NDM-1', type: NodeType.GENE, description: 'New Delhi metallo-beta-lactamase 1.', val: 25 },
    { id: 'K.pneumoniae', label: 'K. pneumoniae', type: NodeType.BACTERIA, description: 'Klebsiella pneumoniae.', val: 22 },
    { id: 'Carbapenem', label: 'Carbapenem', type: NodeType.DRUG, description: 'Last-resort antibiotic.', val: 20 },
    { id: 'Colistin', label: 'Colistin', type: NodeType.DRUG, description: 'Last-resort antibiotic for MDR.', val: 20 },
    { id: 'MCR-1', label: 'MCR-1', type: NodeType.GENE, description: 'Mobilized colistin resistance.', val: 25 },
    { id: 'E.coli', label: 'E. coli', type: NodeType.BACTERIA, description: 'Escherichia coli.', val: 20 },
    { id: 'Surveillance:Glass', label: 'GLASS', type: NodeType.SURVEILLANCE, description: 'Global Antimicrobial Resistance and Use Surveillance System.', val: 18 },
  ],
  links: [
    { source: 'NDM-1', target: 'K.pneumoniae', label: 'FOUND_IN' },
    { source: 'NDM-1', target: 'Carbapenem', label: 'CONFERS_RESISTANCE' },
    { source: 'MCR-1', target: 'E.coli', label: 'FOUND_IN' },
    { source: 'MCR-1', target: 'Colistin', label: 'CONFERS_RESISTANCE' },
    { source: 'Surveillance:Glass', target: 'K.pneumoniae', label: 'MONITORS' },
  ]
};

const NEURO_DATA: GraphData = {
  nodes: [
    { id: 'Alzheimers', label: 'Alzheimer\'s', type: NodeType.PHENOTYPE, description: 'Progressive neurodegenerative disease.', val: 30 },
    { id: 'AmyloidBeta', label: 'Amyloid Beta', type: NodeType.HUMAN_PROTEIN, description: 'Peptide linked to AD plaques.', val: 25 },
    { id: 'Tau', label: 'Tau', type: NodeType.HUMAN_PROTEIN, description: 'Protein associated with tangles.', val: 25 },
    { id: 'ApoE4', label: 'ApoE4', type: NodeType.GENE, description: 'Major genetic risk factor.', val: 22 },
    { id: 'Lecanemab', label: 'Lecanemab', type: NodeType.DRUG, description: 'Anti-amyloid antibody.', val: 20 },
  ],
  links: [
    { source: 'AmyloidBeta', target: 'Alzheimers', label: 'AGGREGATES_IN' },
    { source: 'Tau', target: 'Alzheimers', label: 'AGGREGATES_IN' },
    { source: 'ApoE4', target: 'Alzheimers', label: 'INCREASES_RISK' },
    { source: 'Lecanemab', target: 'AmyloidBeta', label: 'TARGETS' },
  ]
};

const CLIMATE_DATA: GraphData = {
  nodes: [
    { id: 'HeatWave', label: 'Heat Wave', type: NodeType.EVENT, description: 'Prolonged period of excessive heat.', val: 30 },
    { id: 'Malaria', label: 'Malaria', type: NodeType.PHENOTYPE, description: 'Mosquito-borne disease.', val: 25 },
    { id: 'MosquitoRange', label: 'Vector Range', type: NodeType.LOCATION, description: 'Geographic spread of vectors.', val: 22 },
    { id: 'AirPollution', label: 'PM2.5', type: NodeType.POLLUTANT, description: 'Fine particulate matter.', val: 25 },
    { id: 'Asthma', label: 'Asthma', type: NodeType.PHENOTYPE, description: 'Respiratory condition.', val: 25 },
  ],
  links: [
    { source: 'HeatWave', target: 'MosquitoRange', label: 'EXPANDS' },
    { source: 'MosquitoRange', target: 'Malaria', label: 'INCREASES_TRANSMISSION' },
    { source: 'AirPollution', target: 'Asthma', label: 'EXACERBATES' },
    { source: 'HeatWave', target: 'AirPollution', label: 'TRAPS' },
  ]
};

const SYNBIO_DATA: GraphData = {
  nodes: [
    { id: 'CRISPR-Cas9', label: 'CRISPR-Cas9', type: NodeType.TOOL, description: 'Gene editing tool.', val: 30 },
    { id: 'Biosensor', label: 'Biosensor', type: NodeType.TOOL, description: 'Detects chemicals/pathogens.', val: 25 },
    { id: 'Yeast', label: 'S. cerevisiae', type: NodeType.BACTERIA, description: 'Model organism host.', val: 20 },
    { id: 'Artemisinin', label: 'Artemisinin', type: NodeType.DRUG, description: 'Antimalarial produced via yeast.', val: 22 },
    { id: 'Ethics:Safety', label: 'Biosafety', type: NodeType.ETHICS, description: 'Containment of GMOs.', val: 18 },
  ],
  links: [
    { source: 'CRISPR-Cas9', target: 'Yeast', label: 'EDITS' },
    { source: 'Yeast', target: 'Artemisinin', label: 'PRODUCES' },
    { source: 'Ethics:Safety', target: 'CRISPR-Cas9', label: 'REGULATES' },
  ]
};

const POLICY_DATA: GraphData = {
  nodes: [
    { id: 'WHO', label: 'WHO', type: NodeType.ACTOR, description: 'World Health Organization.', val: 30 },
    { id: 'PandemicTreaty', label: 'Pandemic Treaty', type: NodeType.POLICY, description: 'International agreement on pandemic prevention.', val: 25 },
    { id: 'VaccineEquity', label: 'Vaccine Equity', type: NodeType.ETHICS, description: 'Fair distribution of vaccines.', val: 25 },
    { id: 'IHR', label: 'IHR (2005)', type: NodeType.POLICY, description: 'International Health Regulations.', val: 22 },
  ],
  links: [
    { source: 'WHO', target: 'PandemicTreaty', label: 'DRAFTS' },
    { source: 'PandemicTreaty', target: 'VaccineEquity', label: 'PROMOTES' },
    { source: 'WHO', target: 'IHR', label: 'ADMINISTERS' },
  ]
};

const QUANTUM_HEALTH_DATA: GraphData = {
  nodes: [
    { id: 'VQE', label: 'VQE', type: NodeType.TOOL, description: 'Variational Quantum Eigensolver.', val: 30 },
    { id: 'DrugDiscovery', label: 'Drug Discovery', type: NodeType.PATHWAY, description: 'Finding new medications.', val: 25 },
    { id: 'ProteinFolding', label: 'Protein Folding', type: NodeType.PATHWAY, description: 'Predicting 3D structure.', val: 25 },
    { id: 'Qubit', label: 'Qubit', type: NodeType.TOOL, description: 'Quantum bit.', val: 20 },
  ],
  links: [
    { source: 'VQE', target: 'DrugDiscovery', label: 'ACCELERATES' },
    { source: 'VQE', target: 'ProteinFolding', label: 'SIMULATES' },
    { source: 'Qubit', target: 'VQE', label: 'ENABLES' },
  ]
};

export const DOMAIN_DATA: Record<GraphDomain, GraphData> = {
    [GraphDomain.SARS_COV_2]: SARS_DATA,
    [GraphDomain.AMR]: AMR_DATA, 
    [GraphDomain.NEURO]: NEURO_DATA,
    [GraphDomain.CLIMATE]: CLIMATE_DATA,
    [GraphDomain.SYNBIO]: SYNBIO_DATA,
    [GraphDomain.POLICY]: POLICY_DATA,
    [GraphDomain.QUANTUM_HEALTH]: QUANTUM_HEALTH_DATA,
    [GraphDomain.ONCOLOGY]: ONCOLOGY_DATA
};
