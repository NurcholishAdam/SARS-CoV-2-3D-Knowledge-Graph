
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
  
  // Climate & Socio
  [NodeType.POLLUTANT]: '#71717a', // Zinc
  [NodeType.LOCATION]: '#facc15', // Yellow
  [NodeType.EVENT]: '#f43f5e', // Rose
  [NodeType.SOCIO_ECONOMIC]: '#8b5cf6', // Violet
  [NodeType.COMORBIDITY]: '#be123c', // Rose Dark
  [NodeType.COINFECTION]: '#b91c1c', // Red Dark
  [NodeType.ENVIRONMENTAL]: '#15803d', // Green Dark
  
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
    // --- Structural Proteins ---
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
    { id: 'LongCovid', label: 'Long COVID', type: NodeType.PHENOTYPE, description: 'Post-acute sequelae of SARS-CoV-2 infection.', val: 22 },

    // --- Comorbidities & Coinfections ---
    { id: 'Diabetes', label: 'T2 Diabetes', type: NodeType.COMORBIDITY, description: 'Metabolic disorder increasing severity risk.', val: 20 },
    { id: 'Influenza', label: 'Influenza A', type: NodeType.COINFECTION, description: 'Common respiratory coinfection.', val: 20 },
    
    // --- Socioeconomic & Environmental ---
    { id: 'HealthcareAccess', label: 'Healthcare Access', type: NodeType.SOCIO_ECONOMIC, description: 'Availability of ICU beds and therapeutics.', val: 18 },
    { id: 'AirQuality', label: 'PM2.5 Levels', type: NodeType.ENVIRONMENTAL, description: 'Air pollution correlating with transmission/severity.', val: 18 },

    // --- Functional Categories ---
    { id: 'Func:Entry', label: 'Viral Entry', type: NodeType.FUNC_ENTRY, description: 'Mechanisms of cell invasion.', val: 15 },
    { id: 'Func:Replication', label: 'Replication Complex', type: NodeType.FUNC_REPLICATION, description: 'RNA synthesis machinery.', val: 15 },
    { id: 'Func:ImmuneMod', label: 'Immune Modulation', type: NodeType.FUNC_IMMUNE_MOD, description: 'Interference with host interferon response.', val: 15 },

    // --- Gene Ontology (GO) Terms ---
    { id: 'GO:0046718', label: 'Viral entry into host cell', type: NodeType.GO_TERM, description: 'Biological process where a virus crosses the host cell membrane.', val: 12 },
    { id: 'GO:0019012', label: 'Virion assembly', type: NodeType.GO_TERM, description: 'The processes by which virus particles are formed.', val: 12 },
    { id: 'GO:0039654', label: 'RdRp activity', type: NodeType.GO_TERM, description: 'RNA-directed RNA polymerase activity (GO:0039654).', val: 12 },
    { id: 'GO:0030683', label: 'Evasion of immune response', type: NodeType.GO_TERM, description: 'Processes where a virus avoids host immune detection.', val: 12 },
    { id: 'GO:0003723', label: 'RNA binding', type: NodeType.GO_TERM, description: 'Interaction with an RNA molecule.', val: 12 },

    // --- Literature ---
    { id: 'Paper:Hoffmann', label: 'Hoffmann et al.', type: NodeType.LITERATURE, description: 'Identified ACE2 entry.', val: 10, metadata: { authors: 'Hoffmann et al.', year: '2020', journal: 'Cell', doi: '10.1016/j.cell.2020.02.052' } },
  ],
  links: [
    { source: 'S', target: 'Func:Entry', label: 'MEDIATES' },
    { source: 'S', target: 'ACE2', label: 'BINDS' },
    { source: 'S', target: 'TMPRSS2', label: 'CLEAVED_BY' },
    { source: 'N', target: 'Func:Replication', label: 'STABILIZES_RNA' },
    { source: 'E', target: 'Func:Entry', label: 'ASSISTS_ASSEMBLY' },
    { source: 'NSP1', target: 'Func:ImmuneMod', label: 'INHIBITS_INTERFERON' },
    { source: 'NSP3', target: 'Func:ImmuneMod', label: 'DEUBIQUITINATES' },
    { source: 'NSP5', target: 'Func:Replication', label: 'PROCESSES_POLYPROTEIN' },
    { source: 'NSP12', target: 'Func:Replication', label: 'DRIVES_SYNTHESIS' },
    { source: 'NSP13', target: 'Func:Replication', label: 'UNWINDS_RNA' },
    { source: 'ORF8', target: 'Func:ImmuneMod', label: 'DOWNREGULATES_MHC_I' },
    { source: 'ORF8', target: 'ImmuneEscape', label: 'CONTRIBUTES_TO' },
    { source: 'ORF8', target: 'SevereDisease', label: 'CORRELATES_WITH' },
    { source: 'ORF3a', target: 'SevereDisease', label: 'INDUCES_INFLAMMATION' },
    { source: 'Paxlovid', target: 'NSP5', label: 'INHIBITS' },
    { source: 'Remdesivir', target: 'NSP12', label: 'INHIBITS' },
    { source: 'Molnupiravir', target: 'NSP12', label: 'MUTATES_VIA' },
    { source: 'Paper:Hoffmann', target: 'ACE2', label: 'IDENTIFIES' },
    { source: 'Diabetes', target: 'SevereDisease', label: 'EXACERBATES' },
    { source: 'Diabetes', target: 'ACE2', label: 'UPREGULATES' },
    { source: 'Influenza', target: 'SevereDisease', label: 'INCREASES_MORTALITY' },
    { source: 'AirQuality', target: 'SevereDisease', label: 'CORRELATES_WITH' },
    { source: 'HealthcareAccess', target: 'SevereDisease', label: 'MITIGATES' },
    { source: 'LongCovid', target: 'SevereDisease', label: 'SEQUELAE_OF' },

    // --- GO Term Links ---
    { source: 'S', target: 'GO:0046718', label: 'ANNOTATED_WITH' },
    { source: 'GO:0046718', target: 'Func:Entry', label: 'DEFINES' },
    
    { source: 'S', target: 'GO:0019012', label: 'ANNOTATED_WITH' },
    { source: 'M', target: 'GO:0019012', label: 'ANNOTATED_WITH' },
    { source: 'E', target: 'GO:0019012', label: 'ANNOTATED_WITH' },
    { source: 'N', target: 'GO:0019012', label: 'ANNOTATED_WITH' },
    
    { source: 'NSP12', target: 'GO:0039654', label: 'HAS_ACTIVITY' },
    { source: 'GO:0039654', target: 'Func:Replication', label: 'DEFINES' },
    
    { source: 'NSP1', target: 'GO:0030683', label: 'ANNOTATED_WITH' },
    { source: 'ORF8', target: 'GO:0030683', label: 'ANNOTATED_WITH' },
    { source: 'GO:0030683', target: 'Func:ImmuneMod', label: 'DEFINES' },
    
    { source: 'N', target: 'GO:0003723', label: 'ANNOTATED_WITH' },
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
    // Mechanisms & Genes
    { id: 'NDM-1', label: 'NDM-1 Gene', type: NodeType.GENE, description: 'New Delhi metallo-beta-lactamase 1; confers broad carbapenem resistance.', val: 25 },
    { id: 'MCR-1', label: 'MCR-1 Gene', type: NodeType.GENE, description: 'Plasmid-mediated colistin resistance; typically zoonotic origin.', val: 25 },
    { id: 'mecA', label: 'mecA Gene', type: NodeType.GENE, description: 'Encodes PBP2a, conferring resistance to methicillin.', val: 22 },
    { id: 'KPC', label: 'KPC Enzyme', type: NodeType.GENE, description: 'Klebsiella pneumoniae carbapenemase; hydrolyzes beta-lactams.', val: 22 },
    { id: 'vanA', label: 'vanA Cluster', type: NodeType.GENE, description: 'Gene complex conferring high-level vancomycin resistance.', val: 23 },
    { id: 'tetM', label: 'tetM Gene', type: NodeType.GENE, description: 'Efflux-mediated tetracycline resistance mechanism.', val: 20 },
    { id: 'ermB', label: 'ermB Gene', type: NodeType.GENE, description: 'Ribosomal methylase conferring macrolide resistance.', val: 20 },

    // Bacterial Strains (ESKAPE + Emerging)
    { id: 'K.pneumoniae', label: 'K. pneumoniae', type: NodeType.BACTERIA, description: 'Klebsiella pneumoniae; hypervirulent resistant strain.', val: 22 },
    { id: 'E.coli', label: 'E. coli (ST131)', type: NodeType.BACTERIA, description: 'Extraintestinal pathogenic E. coli with multidrug resistance.', val: 20 },
    { id: 'P.aeruginosa', label: 'P. aeruginosa', type: NodeType.BACTERIA, description: 'Opportunistic pathogen; highly adaptable efflux systems.', val: 22 },
    { id: 'A.baumannii', label: 'A. baumannii', type: NodeType.BACTERIA, description: 'Carbapenem-resistant Acinetobacter (CRAB).', val: 22 },
    { id: 'S.aureus', label: 'S. aureus (MRSA)', type: NodeType.BACTERIA, description: 'Methicillin-resistant Staphylococcus aureus.', val: 24 },
    { id: 'E.faecium', label: 'E. faecium (VRE)', type: NodeType.BACTERIA, description: 'Vancomycin-resistant Enterococcus; common in clinical settings.', val: 22 },
    { id: 'N.gonorrhoeae', label: 'N. gonorrhoeae', type: NodeType.BACTERIA, description: 'Extensively drug-resistant (XDR) superbug strain.', val: 24 },
    { id: 'M.tuberculosis', label: 'M. tuberculosis', type: NodeType.BACTERIA, description: 'Multidrug-resistant TB (MDR-TB) agent.', val: 26 },

    // Transmission Pathways
    { id: 'Path:HGT', label: 'Horizontal Gene Transfer', type: NodeType.PATHWAY, description: 'Conjugation-mediated plasmid exchange between bacteria.', val: 20 },
    { id: 'Path:Zoonotic', label: 'Zoonotic Pathway', type: NodeType.PATHWAY, description: 'Transmission from livestock/agriculture to humans.', val: 18 },
    { id: 'Path:Healthcare', label: 'Healthcare-Associated', type: NodeType.PATHWAY, description: 'Transmission within ICU and clinical environments.', val: 18 },

    // Drugs
    { id: 'Carbapenem', label: 'Carbapenem', type: NodeType.DRUG, description: 'Last-resort beta-lactam antibiotic.', val: 20 },
    { id: 'Colistin', label: 'Colistin', type: NodeType.DRUG, description: 'Polymyxin E; critical last-line therapeutic.', val: 20 },
    { id: 'Vancomycin', label: 'Vancomycin', type: NodeType.DRUG, description: 'Glycopeptide for Gram-positive infections.', val: 20 },
    { id: 'Methicillin', label: 'Methicillin', type: NodeType.DRUG, description: 'Standard beta-lactam used for MRSA diagnosis.', val: 18 },

    // Gene Ontology (GO) Terms for AMR
    { id: 'GO:0046677', label: 'Response to antibiotic', type: NodeType.GO_TERM, description: 'Any process that results in a change in state or activity of a cell or an organism as a result of an antibiotic stimulus.', val: 12 },
    { id: 'GO:0030655', label: 'Beta-lactamase activity', type: NodeType.GO_TERM, description: 'Catalysis of the hydrolysis of the beta-lactam ring of a beta-lactam antibiotic.', val: 14 },
    { id: 'GO:0015238', label: 'Drug transmembrane transport', type: NodeType.GO_TERM, description: 'The directed movement of a drug into, out of or within a cell, or between cells, by means of some agent such as a transporter or pore.', val: 12 },
    { id: 'GO:0009297', label: 'Pilus-mediated HGT', type: NodeType.GO_TERM, description: 'Pilus-mediated horizontal gene transfer (conjugation).', val: 12 },
    { id: 'GO:0009405', label: 'Pathogenesis', type: NodeType.GO_TERM, description: 'The process by which a microbial entity causes disease in a host.', val: 12 },

    // Surveillance & Locations
    { id: 'Surveillance:Glass', label: 'WHO GLASS', type: NodeType.SURVEILLANCE, description: 'Global Antimicrobial Resistance Surveillance System.', val: 18 },
    { id: 'Loc:SouthAsia', label: 'South Asia', type: NodeType.LOCATION, description: 'High prevalence region for NDM-1 and MCR-1.', val: 15 },
    { id: 'Loc:SEAsia', label: 'Southeast Asia', type: NodeType.LOCATION, description: 'Emerging hotspot for XDR Gonorrhea.', val: 15 },
    { id: 'Loc:Europe', label: 'Europe (EARS-Net)', type: NodeType.LOCATION, description: 'Intensive monitoring of KPC and VRE.', val: 15 },
    { id: 'Loc:NorthAmerica', label: 'North America', type: NodeType.LOCATION, description: 'Active monitoring for emerging MCR-1 cases.', val: 15 },
  ],
  links: [
    { source: 'NDM-1', target: 'K.pneumoniae', label: 'FOUND_IN' },
    { source: 'KPC', target: 'K.pneumoniae', label: 'FOUND_IN' },
    { source: 'MCR-1', target: 'E.coli', label: 'FOUND_IN' },
    { source: 'mecA', target: 'S.aureus', label: 'FOUND_IN' },
    { source: 'vanA', target: 'E.faecium', label: 'FOUND_IN' },
    { source: 'tetM', target: 'N.gonorrhoeae', label: 'FOUND_IN' },
    { source: 'ermB', target: 'N.gonorrhoeae', label: 'FOUND_IN' },
    { source: 'NDM-1', target: 'Carbapenem', label: 'CONFERS_RESISTANCE' },
    { source: 'KPC', target: 'Carbapenem', label: 'INACTIVATES' },
    { source: 'MCR-1', target: 'Colistin', label: 'CONFERS_RESISTANCE' },
    { source: 'vanA', target: 'Vancomycin', label: 'CONFERS_RESISTANCE' },
    { source: 'mecA', target: 'Methicillin', label: 'CONFERS_RESISTANCE' },
    { source: 'Path:HGT', target: 'NDM-1', label: 'PROPAGATES' },
    { source: 'Path:HGT', target: 'MCR-1', label: 'PROPAGATES' },
    { source: 'Path:Zoonotic', target: 'MCR-1', label: 'ORIGIN_OF' },
    { source: 'Path:Healthcare', target: 'E.faecium', label: 'PREVALENT_IN' },
    { source: 'Path:Healthcare', target: 'K.pneumoniae', label: 'PREVALENT_IN' },
    { source: 'Loc:SouthAsia', target: 'NDM-1', label: 'ENDEMIC_AREA' },
    { source: 'Loc:SEAsia', target: 'N.gonorrhoeae', label: 'HIGH_PREVALENCE' },
    { source: 'Loc:Europe', target: 'E.faecium', label: 'MONITORED_IN' },
    { source: 'Surveillance:Glass', target: 'Loc:SouthAsia', label: 'REPORTS_FROM' },
    { source: 'Surveillance:Glass', target: 'Loc:SEAsia', label: 'REPORTS_FROM' },

    // GO Term Links for AMR
    { source: 'NDM-1', target: 'GO:0030655', label: 'ANNOTATED_WITH' },
    { source: 'KPC', target: 'GO:0030655', label: 'ANNOTATED_WITH' },
    { source: 'NDM-1', target: 'GO:0046677', label: 'PARTICIPATES_IN' },
    { source: 'MCR-1', target: 'GO:0046677', label: 'PARTICIPATES_IN' },
    { source: 'mecA', target: 'GO:0046677', label: 'PARTICIPATES_IN' },
    { source: 'tetM', target: 'GO:0015238', label: 'ANNOTATED_WITH' },
    { source: 'Path:HGT', target: 'GO:0009297', label: 'ENABLED_BY' },
    { source: 'K.pneumoniae', target: 'GO:0009405', label: 'EXHIBITS' },
    { source: 'S.aureus', target: 'GO:0009405', label: 'EXHIBITS' },
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
    { id: 'AIAgents', label: 'AI Agents', type: NodeType.ACTOR, description: 'Autonomous systems participating in policy-making and scientific discovery.', val: 24 },
    { id: 'MetaAlignment', label: 'Meta-Cognitive Alignment', type: NodeType.ETHICS, description: 'Reflective oversight of AI systems to ensure adherence to human values and first principles.', val: 26 },
  ],
  links: [
    { source: 'WHO', target: 'PandemicTreaty', label: 'DRAFTS' },
    { source: 'PandemicTreaty', target: 'VaccineEquity', label: 'PROMOTES' },
    { source: 'WHO', target: 'IHR', label: 'ADMINISTERS' },
    { source: 'MetaAlignment', target: 'AIAgents', label: 'GOVERNANCE_CHECKS' },
  ]
};

const QUANTUM_HEALTH_DATA: GraphData = {
  nodes: [
    { id: 'VQE', label: 'VQE', type: NodeType.TOOL, description: 'Variational Quantum Eigensolver.', val: 30 },
    { id: 'DrugDiscovery', label: 'Drug Discovery', type: NodeType.PATHWAY, description: 'Finding new medications.', val: 25 },
    { id: 'ProteinFolding', label: 'Protein Folding', type: NodeType.PATHWAY, description: 'Predicting 3D structure.', val: 25 },
    { id: 'Qubit', label: 'Qubit', type: NodeType.TOOL, description: 'Quantum bit.', val: 20 },
    { id: 'QuantumCircuitDepth', label: 'Circuit Depth', type: NodeType.TOOL, description: 'The number of sequential operations in a quantum circuit, a key metric for algorithmic complexity and noise tolerance.', val: 22 },
  ],
  links: [
    { source: 'VQE', target: 'DrugDiscovery', label: 'ACCELERATES' },
    { source: 'VQE', target: 'ProteinFolding', label: 'SIMULATES' },
    { source: 'Qubit', target: 'VQE', label: 'ENABLES' },
    { source: 'VQE', target: 'QuantumCircuitDepth', label: 'HAS_COMPLEXITY' },
    { source: 'QuantumCircuitDepth', target: 'DrugDiscovery', label: 'CONSTRAINS' },
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
