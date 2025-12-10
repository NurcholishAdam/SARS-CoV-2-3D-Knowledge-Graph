import { GraphData, NodeType } from './types';

// Color palette for node types
export const NODE_COLORS = {
  [NodeType.VIRUS_PROTEIN]: '#ef4444', // Red
  [NodeType.HUMAN_PROTEIN]: '#3b82f6', // Blue
  [NodeType.DRUG]: '#10b981', // Emerald
  [NodeType.PHENOTYPE]: '#f59e0b', // Amber
  [NodeType.PATHWAY]: '#8b5cf6', // Violet
  [NodeType.VARIANT]: '#ec4899', // Pink
  [NodeType.VACCINE]: '#06b6d4', // Cyan
  [NodeType.SURVEILLANCE]: '#f97316', // Orange
  [NodeType.DATASET]: '#64748b', // Slate
  [NodeType.LITERATURE]: '#e2e8f0', // Light Gray / White
  [NodeType.GO_TERM]: '#84cc16', // Lime
  [NodeType.QUERY]: '#ffffff', // Pure White
  [NodeType.HYPOTHESIS]: '#d946ef', // Magenta / Fuchsia
};

export const INITIAL_GRAPH_DATA: GraphData = {
  nodes: [
    // --- Viral Proteins ---
    { id: 'S', label: 'Spike Protein (S)', type: NodeType.VIRUS_PROTEIN, description: 'Main target for neutralizing antibodies and entry into host cells.', val: 25 },
    { id: 'Mpro', label: 'Main Protease (Mpro)', type: NodeType.VIRUS_PROTEIN, description: 'Essential for viral replication and transcription.', val: 15 },
    { id: 'N', label: 'Nucleocapsid (N)', type: NodeType.VIRUS_PROTEIN, description: 'Packages the viral genome.', val: 12 },
    { id: 'RdRp', label: 'RdRp (nsp12)', type: NodeType.VIRUS_PROTEIN, description: 'RNA-dependent RNA polymerase.', val: 15 },
    { id: 'E', label: 'Envelope (E)', type: NodeType.VIRUS_PROTEIN, description: 'Involved in assembly and release.', val: 8 },
    { id: 'ORF8', label: 'ORF8', type: NodeType.VIRUS_PROTEIN, description: 'Accessory protein involved in immune evasion.', val: 10 },

    // --- Human Proteins ---
    { id: 'ACE2', label: 'ACE2', type: NodeType.HUMAN_PROTEIN, description: 'Angiotensin-converting enzyme 2 receptor.', val: 18 },
    { id: 'TMPRSS2', label: 'TMPRSS2', type: NodeType.HUMAN_PROTEIN, description: 'Serine protease that primes Spike.', val: 15 },
    { id: 'IL6', label: 'IL-6', type: NodeType.HUMAN_PROTEIN, description: 'Pro-inflammatory cytokine.', val: 12 },
    { id: 'FURIN', label: 'Furin', type: NodeType.HUMAN_PROTEIN, description: 'Protease cleaving S1/S2.', val: 10 },
    { id: 'NRP1', label: 'Neuropilin-1', type: NodeType.HUMAN_PROTEIN, description: 'Co-receptor facilitating viral entry.', val: 10 },

    // --- Gene Ontology (Processes) ---
    { id: 'GO:Entry', label: 'Viral Entry into Host Cell', type: NodeType.GO_TERM, description: 'Process by which virus enters the cell.', val: 14 },
    { id: 'GO:Replication', label: 'Viral Genome Replication', type: NodeType.GO_TERM, description: 'Copying of viral genetic material.', val: 14 },
    { id: 'GO:Immune', label: 'Innate Immune Response', type: NodeType.GO_TERM, description: 'Host defense mechanisms.', val: 14 },

    // --- Literature (Pivotal Papers) ---
    { 
      id: 'Paper:Hoffmann2020', 
      label: 'Hoffmann et al. (2020)', 
      type: NodeType.LITERATURE, 
      description: 'Identified ACE2 and TMPRSS2 as entry factors.', 
      val: 12,
      metadata: { doi: '10.1016/j.cell.2020.02.052', authors: 'Hoffmann M, et al.', journal: 'Cell', year: '2020' }
    },
    { 
      id: 'Paper:Walls2020', 
      label: 'Walls et al. (2020)', 
      type: NodeType.LITERATURE, 
      description: 'Cryo-EM structure of the SARS-CoV-2 Spike.', 
      val: 12,
      metadata: { doi: '10.1016/j.cell.2020.02.058', authors: 'Walls AC, et al.', journal: 'Cell', year: '2020' }
    },
    { 
      id: 'Paper:Zhou2020', 
      label: 'Zhou et al. (2020)', 
      type: NodeType.LITERATURE, 
      description: 'Discovery of SARS-CoV-2 and its bat origin.', 
      val: 12,
      metadata: { doi: '10.1038/s41586-020-2012-7', authors: 'Zhou P, et al.', journal: 'Nature', year: '2020' }
    },
    { 
      id: 'Paper:Cao2022', 
      label: 'Cao et al. (2022)', 
      type: NodeType.LITERATURE, 
      description: 'Characterization of Omicron immune evasion.', 
      val: 12,
      metadata: { doi: '10.1038/s41586-021-04385-3', authors: 'Cao Y, et al.', journal: 'Nature', year: '2022' }
    },

    // --- Drugs ---
    { id: 'Remdesivir', label: 'Remdesivir', type: NodeType.DRUG, description: 'Broad-spectrum antiviral.', val: 10 },
    { id: 'Paxlovid', label: 'Paxlovid', type: NodeType.DRUG, description: 'Mpro inhibitor.', val: 12 },
    { id: 'Molnupiravir', label: 'Molnupiravir', type: NodeType.DRUG, description: 'Induces RNA mutagenesis.', val: 10 },
    { id: 'Dexamethasone', label: 'Dexamethasone', type: NodeType.DRUG, description: 'Corticosteroid.', val: 10 },

    // --- Phenotypes ---
    { id: 'CytokineStorm', label: 'Cytokine Storm', type: NodeType.PHENOTYPE, description: 'Severe hyper-inflammation.', val: 15 },
    { id: 'Hypoxia', label: 'Hypoxia', type: NodeType.PHENOTYPE, description: 'Low oxygen levels.', val: 8 },
    { id: 'LongCovid', label: 'Long COVID', type: NodeType.PHENOTYPE, description: 'Post-acute sequelae.', val: 12 },

    // --- Variants ---
    { id: 'Omicron', label: 'Omicron (BA.1/BA.2)', type: NodeType.VARIANT, description: 'Highly transmissible variant.', val: 20 },
    { id: 'Delta', label: 'Delta (B.1.617.2)', type: NodeType.VARIANT, description: 'Highly pathogenic variant.', val: 18 },
    { id: 'JN1', label: 'JN.1', type: NodeType.VARIANT, description: 'Current dominant lineage.', val: 18 },

    // --- Vaccines ---
    { id: 'Pfizer', label: 'Comirnaty (BNT162b2)', type: NodeType.VACCINE, description: 'mRNA vaccine.', val: 18 },
    { id: 'Moderna', label: 'Spikevax', type: NodeType.VACCINE, description: 'mRNA vaccine.', val: 18 },

    // --- Surveillance & Data ---
    { id: 'GISAID', label: 'GISAID', type: NodeType.SURVEILLANCE, description: 'Genomic data repository.', val: 16 },
    { id: 'AlphaFold', label: 'AlphaFold DB', type: NodeType.DATASET, description: 'Protein structure predictions.', val: 14 },
  ],
  links: [
    // --- Protein Interactions ---
    { source: 'S', target: 'ACE2', label: 'BINDS' },
    { source: 'ACE2', target: 'TMPRSS2', label: 'CO_EXPRESSED' },
    { source: 'S', target: 'TMPRSS2', label: 'CLEAVED_BY' },
    { source: 'S', target: 'FURIN', label: 'CLEAVED_BY' },
    { source: 'S', target: 'NRP1', label: 'POTENTIAL_BINDING' },
    
    // --- GO Term Connections (Process) ---
    { source: 'S', target: 'GO:Entry', label: 'FACILITATES' },
    { source: 'ACE2', target: 'GO:Entry', label: 'INVOLVED_IN' },
    { source: 'RdRp', target: 'GO:Replication', label: 'DRIVES' },
    { source: 'ORF8', target: 'GO:Immune', label: 'DOWNREGULATES' },
    { source: 'IL6', target: 'GO:Immune', label: 'PART_OF' },

    // --- Literature Evidence Links ---
    { source: 'Paper:Hoffmann2020', target: 'ACE2', label: 'IDENTIFIES' },
    { source: 'Paper:Hoffmann2020', target: 'TMPRSS2', label: 'IDENTIFIES' },
    { source: 'Paper:Walls2020', target: 'S', label: 'DESCRIBES_STRUCTURE' },
    { source: 'Paper:Zhou2020', target: 'ACE2', label: 'VALIDATES_RECEPTOR' },
    { source: 'Paper:Cao2022', target: 'Omicron', label: 'CHARACTERIZES' },

    // --- Drug Mechanisms ---
    { source: 'Remdesivir', target: 'RdRp', label: 'INHIBITS' },
    { source: 'Paxlovid', target: 'Mpro', label: 'INHIBITS' },
    { source: 'Molnupiravir', target: 'RdRp', label: 'MUTATES' },
    { source: 'Dexamethasone', target: 'GO:Immune', label: 'MODULATES' },

    // --- Variant & Vaccine Links ---
    { source: 'Omicron', target: 'S', label: 'HIGH_MUTATION_RATE' },
    { source: 'Delta', target: 'S', label: 'MUTATION_L452R' },
    { source: 'JN1', target: 'S', label: 'DESCENDANT_OF' },
    { source: 'Pfizer', target: 'S', label: 'ENCODES' },
    { source: 'Moderna', target: 'S', label: 'ENCODES' },
    
    // --- Phenotypes ---
    { source: 'S', target: 'CytokineStorm', label: 'TRIGGERS' },
    { source: 'CytokineStorm', target: 'LongCovid', label: 'ASSOCIATED_WITH' },
    { source: 'Hypoxia', target: 'CytokineStorm', label: 'EXACERBATES' },
    
    // --- Data ---
    { source: 'GISAID', target: 'Omicron', label: 'TRACKS' },
    { source: 'AlphaFold', target: 'ORF8', label: 'PREDICTS_STRUCTURE' },
  ]
};