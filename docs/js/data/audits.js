// Audits Data
const AUDITS = {
  summary: [
    { name: 'Sheriff', deficit: '-$5.9M', budget: '$9.1M budget / $3.2M revenue' },
    { name: 'District Attorney', deficit: '-$6.1M', budget: '$8.2M budget / $2.1M revenue' },
    { name: 'Coroner', deficit: '-$1.4M', budget: '$1.6M budget / $0.18M revenue' }
  ],
  offices: {
    sheriff: {
      title: "Sheriff's Office", status: 'HIGH', id: 'sheriff',
      personnel: { total: '$7,280,000', ftes: 71, sections: [
        { cat: 'SWORN DEPUTIES', rows: [
          ['Sheriff (Elected)', 1, '$136,500', '$105K salary'],
          ['Chief Deputy', 1, '$110,500', '$85K salary'],
          ['Lieutenants', 4, '$374,400', '$72K avg salary'],
          ['Sergeants', 8, '$676,000', '$65K avg salary'],
          ['Deputies - Court Security', 24, '$1,716,000', '$55K avg'],
          ['Deputies - Civil Process', 12, '$811,200', '$52K avg'],
          ['Deputies - Transport', 10, '$676,000', '$52K avg']
        ], subtotal: ['Subtotal Sworn', 60, '$4,500,600'] },
        { cat: 'CIVILIAN STAFF', rows: [
          ['Administrative Manager', 1, '$71,500', ''],
          ['Clerical Staff', 8, '$395,200', '$38K avg'],
          ['Sheriff Sale Coordinator', 2, '$114,400', '']
        ], subtotal: ['Subtotal Civilian', 11, '$581,100'] },
        { cat: 'BENEFITS & OTHER', rows: [
          ['Health Insurance', 71, '$1,278,000', '$18K/employee avg', 'review'],
          ['Pension Contributions', '—', '$609,804', '12% of salary'],
          ['Overtime', '—', '$310,496', 'Court & transport', 'high']
        ]}
      ]},
      operating: { total: '$1,456,000', sections: [
        { cat: 'VEHICLES & TRANSPORT', rows: [
          ['Fleet Vehicles (28 units)', '$285,000', 'Lease + maint.', 'review'],
          ['Fuel', '$168,000', '~56K gal @ $3/gal'],
          ['Prisoner Transport', '$95,000', 'State/out-of-county']
        ]},
        { cat: 'EQUIPMENT & SUPPLIES', rows: [
          ['Firearms & Ammunition', '$45,000', 'Quarterly qualification'],
          ['Body Armor & Safety', '$38,000', '5-year replacement cycle'],
          ['Uniforms', '$52,000', '$732/deputy', 'ok'],
          ['Communications Equipment', '$85,000', 'Radios, MDTs'],
          ['Office Supplies', '$24,000', 'Standard']
        ]},
        { cat: 'PROFESSIONAL SERVICES', rows: [
          ['Training & Academy', '$125,000', 'MPOETC required', 'ok'],
          ['Legal Services', '$45,000', 'Sheriff sale legal'],
          ['Insurance & Bonds', '$165,000', 'Liability coverage']
        ]},
        { cat: 'FACILITIES', rows: [
          ['Utilities & Maintenance', '$89,000', 'Courthouse allocation'],
          ['Security Systems', '$48,000', 'Courthouse security'],
          ['Miscellaneous', '$192,000', '', 'high']
        ]}
      ]},
      revenue: { total: '$3,200,000', net: '-$5,536,000', sections: [
        { cat: 'SHERIFF SALES', rows: [
          ['Sale Fees (est. 400 sales)', '$1,200,000', '$3,000 avg/sale'],
          ['Advertising Reimbursement', '$180,000', 'Pass-through']
        ]},
        { cat: 'CIVIL PROCESS', rows: [
          ['Service Fees (est. 15,000)', '$750,000', '$50 avg/service'],
          ['Mileage Reimbursement', '$120,000', 'Per-mile fees']
        ]},
        { cat: 'SECURITY & TRANSPORT', rows: [
          ['Court Security (State)', '$520,000', 'AOPC reimbursement'],
          ['Transport Reimbursement', '$280,000', 'State/DOC']
        ]},
        { cat: 'OTHER', rows: [
          ['Concealed Carry Permits', '$95,000', '~4,750 permits @ $20'],
          ['Background Checks', '$35,000', 'Employment checks'],
          ['Miscellaneous', '$20,000', 'Various']
        ]}
      ]},
      findings: [
        ['Overtime ($310K)', '4.3% of personnel - court scheduling creates predictable OT. Compare to 3% benchmark.'],
        ['Health Insurance ($18K/emp)', 'County-wide rate. State avg is $15K. Potential savings via consortium.'],
        ['Miscellaneous Operating ($192K)', '13% of operating budget unclassified - needs detailed breakdown.'],
        ['Fleet Cost ($10.2K/unit)', 'Above benchmark of $8.5K. Review maintenance contracts.'],
        ['Civil Process Revenue', 'Fee schedule last updated 2019. Market rate is $65-75/service.']
      ],
      recommendations: [
        ['Update Fee Schedule', 'Raise civil process to $65 = +$225K revenue'],
        ['Court Security Grant', 'Apply for AOPC security grant = +$150K'],
        ['Overtime Management', 'Shift scheduling optimization = -$50K'],
        ['Fleet Consolidation', 'Reduce to 24 vehicles = -$40K'],
        ['Reclassify Miscellaneous', 'Require line-item detail per §1720']
      ],
      potential: '$465,000'
    },
    da: {
      title: "District Attorney's Office", status: 'HIGH', id: 'da',
      personnel: { total: '$6,970,000', ftes: 60, sections: [
        { cat: 'ATTORNEYS', rows: [
          ['District Attorney (Elected)', 1, '$221,000', '$170K salary'],
          ['First Assistant DA', 1, '$175,500', '$135K salary'],
          ['Chief Deputy DAs', 3, '$448,500', '$115K avg'],
          ['Senior ADAs', 8, '$988,000', '$95K avg salary'],
          ['Assistant DAs', 14, '$1,310,400', '$72K avg salary']
        ], subtotal: ['Subtotal Attorneys', 27, '$3,143,400'] },
        { cat: 'DETECTIVES', rows: [
          ['Chief County Detective', 1, '$104,000', ''],
          ['County Detectives', 12, '$1,060,800', '$68K avg']
        ], subtotal: ['Subtotal Detectives', 13, '$1,164,800'] },
        { cat: 'SUPPORT STAFF', rows: [
          ['Office Manager', 1, '$71,500', ''],
          ['Paralegals', 6, '$374,400', '$48K avg'],
          ['Legal Secretaries', 8, '$416,000', '$40K avg'],
          ['Victim Advocates', 5, '$273,000', '$42K avg']
        ], subtotal: ['Subtotal Support', 20, '$1,134,900'] },
        { cat: 'BENEFITS & OTHER', rows: [
          ['Health Insurance', 60, '$1,080,000', '', 'review'],
          ['Pension Contributions', '—', '$446,900', '']
        ]}
      ]},
      operating: { total: '$1,230,000', sections: [
        { cat: 'PROSECUTION COSTS', rows: [
          ['Expert Witnesses', '$285,000', 'Forensic, medical, financial', 'high'],
          ['Lab & Forensic Services', '$175,000', 'DNA, ballistics, digital'],
          ['Transcripts & Records', '$65,000', 'Court transcripts']
        ]},
        { cat: 'INVESTIGATIONS', rows: [
          ['Vehicles (8 units)', '$95,000', 'Detective fleet'],
          ['Surveillance Equipment', '$48,000', 'Tech upgrades'],
          ['Travel & Extradition', '$42,000', 'Out-of-state']
        ]},
        { cat: 'VICTIM SERVICES', rows: [
          ['Victim Assistance Program', '$125,000', 'VOCA match required'],
          ['Witness Protection', '$35,000', 'Relocation, security']
        ]},
        { cat: 'ADMINISTRATION', rows: [
          ['Legal Research (Westlaw)', '$68,000', 'Database subscription'],
          ['Office Supplies', '$32,000', 'Standard'],
          ['Professional Development', '$85,000', 'CLE, conferences'],
          ['Technology & Software', '$95,000', 'Case management'],
          ['Miscellaneous', '$80,000', '', 'review']
        ]}
      ]},
      revenue: { total: '$2,100,000', net: '-$6,100,000', sections: [
        { cat: 'FEDERAL GRANTS', rows: [
          ['VOCA Victim Assistance', '$425,000', 'Annual grant'],
          ['JAG Grant (DOJ)', '$185,000', 'Justice assistance'],
          ['VAWA Grant', '$120,000', 'DV prosecution'],
          ['HIDTA (Drug Task Force)', '$95,000', 'Federal drug enforcement']
        ]},
        { cat: 'STATE FUNDING', rows: [
          ['PCCD Grants', '$280,000', 'Various programs'],
          ['State Reimbursements', '$145,000', 'Mandated programs']
        ]},
        { cat: 'FORFEITURES & FEES', rows: [
          ['Asset Forfeiture', '$520,000', 'Drug seizures', 'review'],
          ['Bad Check Restitution', '$85,000', 'Diversion program'],
          ['ARD Program Fees', '$165,000', 'First offender'],
          ['Cost Recovery', '$80,000', 'Investigation costs']
        ]}
      ]},
      findings: [
        ['Expert Witness Costs ($285K)', '23% of operating budget. No competitive bidding on expert contracts. Rate varies $150-$500/hr.'],
        ['Asset Forfeiture Accounting', '$520K revenue but separate fund not reconciled quarterly. PA Act 13 compliance unclear.'],
        ['ADA Salaries ($72K avg)', 'Below market ($82K regional avg). May affect retention/recruitment.'],
        ['Grant Compliance', 'VOCA grant requires 20% match - verify local match documentation.'],
        ['Case Management Software ($95K)', 'Contract last bid 2018. Market has changed significantly.']
      ],
      recommendations: [
        ['Expert Witness Pool', 'Pre-negotiate rates with expert panel = -$75K'],
        ['Forfeiture Fund Audit', 'Full reconciliation per PA Act 13 requirements'],
        ['Grant Maximization', 'Apply for COPS grant = +$200K'],
        ['Software RFP', 'Rebid case management = -$25K'],
        ['ARD Fee Review', 'Compare to neighboring counties (Lehigh: $350, Monroe: $400)']
      ],
      potential: '$300,000'
    },
    coroner: {
      title: "Coroner's Office", status: 'MEDIUM', id: 'coroner',
      personnel: { total: '$1,120,000', ftes: 18, sections: [
        { cat: 'CORONER STAFF', rows: [
          ['Coroner (Elected)', 1, '$110,500', '$85K salary'],
          ['Chief Deputy Coroner', 1, '$80,600', '$62K salary'],
          ['Deputy Coroners (FT)', 3, '$202,800', '$52K avg'],
          ['Deputy Coroners (PT/On-call)', 8, '$145,000', 'varies']
        ]},
        { cat: 'INVESTIGATORS', rows: [
          ['Death Investigators', 3, '$187,200', '$48K avg']
        ]},
        { cat: 'ADMINISTRATIVE', rows: [
          ['Administrative Assistant', 1, '$49,400', ''],
          ['Records Clerk', 1, '$41,600', '']
        ], subtotal: ['Subtotal Staff', 18, '$817,100'] },
        { cat: 'BENEFITS & OTHER', rows: [
          ['Health Insurance (FT only)', 10, '$180,000', ''],
          ['Pension Contributions', '—', '$82,900', ''],
          ['On-Call Stipends', '—', '$40,000', '', 'review']
        ]}
      ]},
      operating: { total: '$480,000', sections: [
        { cat: 'AUTOPSY SERVICES', rows: [
          ['Contracted Autopsies', '$210,000', '~105 @ $2,000 avg', 'high'],
          ['Toxicology Testing', '$65,000', 'NMS Labs contract'],
          ['Histology/Pathology', '$28,000', 'Tissue analysis']
        ]},
        { cat: 'TRANSPORT & REMOVAL', rows: [
          ['Body Removal Services', '$48,000', 'Contracted service'],
          ['Vehicles (3 units)', '$32,000', 'Lease + maintenance'],
          ['Fuel', '$12,000', 'Investigations']
        ]},
        { cat: 'FACILITIES & EQUIPMENT', rows: [
          ['Morgue Operations', '$25,000', 'Supplies, maintenance'],
          ['Refrigeration', '$15,000', 'Equipment service'],
          ['Investigation Equipment', '$18,000', 'Cameras, kits']
        ]},
        { cat: 'ADMINISTRATIVE', rows: [
          ['Office Supplies', '$8,000', 'Standard'],
          ['Training/Certification', '$12,000', 'Required CE'],
          ['Software (CME system)', '$7,000', 'Death tracking']
        ]}
      ]},
      revenue: { total: '$180,000', net: '-$1,420,000', sections: [
        { cat: 'FEES & REIMBURSEMENTS', rows: [
          ['Autopsy Fees (families)', '$45,000', 'Private requests'],
          ['Insurance Reimbursements', '$38,000', 'Death investigations'],
          ['Cremation Permits', '$52,000', '~2,600 @ $20'],
          ['Death Certificates', '$25,000', 'Certified copies'],
          ['Body Transport Fees', '$12,000', 'Out-of-county'],
          ['Forensic Consulting', '$8,000', 'Expert testimony']
        ]}
      ]},
      findings: [
        ['Autopsy Contract ($2,000/each)', 'Lehigh County pays $1,650 through regional consortium. No competitive bid since 2017.'],
        ['PT Deputy Coverage', '8 part-time deputies with varying hourly rates ($18-$35/hr). No standardization.'],
        ['Cremation Permit Fee ($20)', 'Below state average of $35. Fee hasn\'t changed since 2012.'],
        ['Body Removal', 'Single vendor contract, no backup. Risk of service disruption.'],
        ['Toxicology ($65K)', 'NMS Labs contract not competitively bid. LabCorp may be cheaper.']
      ],
      recommendations: [
        ['Join Regional Autopsy Consortium', 'Lehigh/Monroe partnership = -$35K'],
        ['Update Cremation Fee', 'Raise to $35 (state avg) = +$39K'],
        ['Standardize PT Pay', 'Single rate for all PT deputies = clarity'],
        ['Toxicology RFP', 'Competitive bid for lab services = -$15K'],
        ['Body Removal Backup', 'Add secondary vendor for continuity']
      ],
      potential: '$89,000'
    }
  },
  totals: [
    ['Sheriff', '$8,736,000', '$3,200,000', '-$5,536,000', '$465,000'],
    ['District Attorney', '$8,200,000', '$2,100,000', '-$6,100,000', '$300,000'],
    ['Coroner', '$1,600,000', '$180,000', '-$1,420,000', '$89,000'],
    ['TOTAL', '$18,536,000', '$5,480,000', '-$13,056,000', '$854,000']
  ]
};
