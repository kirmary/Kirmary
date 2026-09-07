// Compatibility content for existing products. New products use database rows.
import { archiveDocuments } from "./archive-data";
type CertificateItem = { label: string; pdf: string };
type ProductDocument = {
  src: string;
  title: string;
  category: string;
  sourceYear?: string | number | null;
};

const SPP_CERTIFICATES: Record<string, CertificateItem> = {
  fm: {
    label: "FM APPROVAL",
    pdf: "/certificates/spp-fm-certificate.pdf",
  },
  ul: {
    label: "UL CERTIFIED",
    pdf: "/certificates/spp-ul-certificate.pdf",
  },
  civil: {
    label: "CIVIL DEFENSE APPROVAL",
    pdf: "/certificates/spp-civil-defense.pdf",
  },
};

const BRISTOL_CERTIFICATES: Record<string, CertificateItem> = {
  fm: {
    label: "FM APPROVAL",
    pdf: "/certificates/bristol-fm-certificate.pdf",
  },
  ul: {
    label: "UL CERTIFIED",
    pdf: "/certificates/bristol-ul-certificate.pdf",
  },
};

const LEDE_PLUMBING_CERTIFICATES: Record<string, CertificateItem> = {
  wras: {
    label: "WRAS APPROVED",
    pdf: "/certificates/lede-plumbing-wras.pdf",
  },
  nsf: {
    label: "NSF APPROVED",
    pdf: "/certificates/lede-plumbing-nsf.pdf",
  },
};

const KM_HYDRANT_CERTIFICATES: Record<string, CertificateItem> = {
  fm: {
    label: "FM APPROVAL",
    pdf: "/certificates/km-hydrant-fm.pdf",
  },
  ul: {
    label: "UL CERTIFIED",
    pdf: "/certificates/km-hydrant-ul.pdf",
  },
  civil: {
    label: "CIVIL DEFENSE APPROVAL",
    pdf: "/certificates/km-hydrant-civil-defense.pdf",
  },
};

const KM_CABINET_CERTIFICATES: Record<string, CertificateItem> = {
  bsi: {
    label: "BSI KITEMARK",
    pdf: "/certificates/km-cabinets-bsi.pdf",
  },
  fm: {
    label: "FM APPROVAL",
    pdf: "/certificates/km-cabinets-fm.pdf",
  },
  lpcb: {
    label: "LPCB APPROVED",
    pdf: "/certificates/km-cabinets-lpcb.pdf",
  },
  ul: {
    label: "UL CERTIFIED",
    pdf: "/certificates/km-cabinets-ul.pdf",
  },
  test: {
    label: "TEST CERTIFICATE",
    pdf: "/certificates/km-cabinets-Test Certificate.pdf",
  },
  civil: {
    label: "CIVIL DEFENSE APPROVAL",
    pdf: "/certificates/CIVIL CAB.pdf",
  },
};

const KM_CABINET_FEATURES = [
  "USA Origin",
  "BSI Kitemark",
  "FM Approval",
  "LPCB Approved",
  "UL Certified",
  "Test Certificate",
  "Civil Defense Approval",
] as const;

const KM_HYDRANT_FEATURES = [
  "USA Origin",
  "FM Approval",
  "UL Certified",
  "Civil Defense Approval",
] as const;

const TIGER_STEEL_CERTIFICATES: Record<string, CertificateItem> = {
  fm: {
    label: "FM APPROVAL",
    pdf: "/certificates/tiger-steel-fm.pdf",
  },
  ul: {
    label: "UL CERTIFIED",
    pdf: "/certificates/tiger-steel-ul.pdf",
  },
  civil: {
    label: "CIVIL DEFENSE APPROVAL",
    pdf: "/certificates/tiger-steel-civil-defense.pdf",
  },
  test: {
    label: "TEST CERTIFICATE",
    pdf: "/certificates/tiger-steel-test-certificate.pdf",
  },
};

const TIGER_STEEL_FEATURES = [
  "UAE Origin",
  "FM Approval",
  "UL Certified",
  "Civil Defense Approval",
  "Test Certificate",
] as const;

const VIKING_SPRINKLER_CERTIFICATES: Record<string, CertificateItem> = {
  fm: {
    label: "FM APPROVAL",
    pdf: "/certificates/viking-sprinklers-fm.pdf",
  },
  ul: {
    label: "UL CERTIFIED",
    pdf: "/certificates/viking-sprinklers-ul.pdf",
  },
};

const VIKING_SPRINKLER_FEATURES = [
  "USA Origin",
  "FM Approval",
  "UL Certified",
] as const;

const LEDE_GROOVED_CERTIFICATES: Record<string, CertificateItem> = {
  fm: {
    label: "FM APPROVAL",
    pdf: "/certificates/lede-grooved-fm.pdf",
  },
  ul: {
    label: "UL CERTIFIED",
    pdf: "/certificates/lede-grooved-ul.pdf",
  },
  civil: {
    label: "CIVIL DEFENSE APPROVAL",
    pdf: "/certificates/lede-grooved-civil-defense.pdf",
  },
  test: {
    label: "TEST CERTIFICATE",
    pdf: "/certificates/lede-grooved-test-certificate.pdf",
  },
};

const LEDE_GROOVED_FEATURES = [
  "FM Approval",
  "UL Certified",
  "Civil Defense Approval",
  "Test Certificate",
] as const;

const LEDE_FIRE_VALVE_CERTIFICATES: Record<string, CertificateItem> = {
  fm: {
    label: "FM Approval",
    pdf: "/certificates/lede-fire-valves-fm.pdf",
  },
  ul: {
    label: "UL CERTIFIED",
    pdf: "/certificates/lede-fire-valves-ul.pdf",
  },
  civil: {
    label: "CIVIL DEFENSE APPROVAL",
    pdf: "/certificates/lede-fire-valves-civil-defense.pdf",
  },
  test: {
    label: "TEST CERTIFICATE",
    pdf: "/certificates/lede-fire-valves-test-certificate.pdf",
  },
};

const LEDE_FIRE_VALVE_FEATURES = [
  "FM Approval",
  "UL Certified",
  "Civil Defense Approval",
  "Test Certificate",
] as const;

const MECH_CERTIFICATES: Record<string, CertificateItem> = {
  fm: {
    label: "FM APPROVAL",
    pdf: "/certificates/mech-fm.pdf",
  },
  ul: {
    label: "UL CERTIFIED",
    pdf: "/certificates/mech-ul.pdf",
  },
  civil: {
    label: "CIVIL DEFENSE APPROVAL",
    pdf: "/certificates/mech-civil-defense.pdf",
  },
  test: {
    label: "TEST CERTIFICATE",
    pdf: "/certificates/mech-test-certificate.pdf",
  },
};

const MECH_FEATURES = [
  "FM Approval",
  "UL Certified",
  "Civil Defense Approval",
  "Test Certificate",
] as const;

const ERICO_CERTIFICATES: Record<string, CertificateItem> = {
  fm: {
    label: "FM APPROVAL",
    pdf: "/certificates/erico-fm.pdf",
  },
  ul: {
    label: "UL CERTIFIED",
    pdf: "/certificates/erico-ul.pdf",
  },
};

const ERICO_FEATURES = ["USA Origin", "FM Approval", "UL Certified"] as const;

const POTTER_CERTIFICATES: Record<string, CertificateItem> = {
  fm: {
    label: "FM APPROVAL",
    pdf: "/certificates/potter-fm.pdf",
  },
  ul: {
    label: "UL CERTIFIED",
    pdf: "/certificates/potter-ul.pdf",
  },
};

const POTTER_FEATURES = ["FM Approval", "UL Certified"] as const;

const VALMATIC_CERTIFICATES: Record<string, CertificateItem> = {
  fm: {
    label: "FM APPROVAL",
    pdf: "/certificates/valmatic-fm.pdf",
  },
  ul: {
    label: "UL CERTIFIED",
    pdf: "/certificates/valmatic-ul.pdf",
  },
};

const VALMATIC_FEATURES = ["FM Approval", "UL Certified"] as const;

const KM_VALVE_CERTIFICATES: Record<string, CertificateItem> = {
  fm: {
    label: "FM APPROVAL",
    pdf: "/certificates/km-valves-fm.pdf",
  },
  ul: {
    label: "UL CERTIFIED",
    pdf: "/certificates/km-valves-ul.pdf",
  },
  civil: {
    label: "CIVIL DEFENSE APPROVAL",
    pdf: "/certificates/km-valves-civil-defense.pdf",
  },
  wras: {
    label: "WRAS APPROVED",
    pdf: "/certificates/km-valves-wras.pdf",
  },
  test: {
    label: "TEST CERTIFICATE",
    pdf: "/certificates/km-valves-test-certificate.pdf",
  },
};

const KM_VALVE_FEATURES = [
  "USA Origin",
  "FM Approval",
  "UL Certified",
  "Civil Defense Approval",
  "Test Certificate",
] as const;

function certificateFromTag(
  tag: string,
  productId: string,
): CertificateItem | null {
  const normalized = tag.toLowerCase();

  if (productId === "spp-fire-pumps") {
    if (
      normalized.includes("civil") ||
      normalized.includes("defense") ||
      normalized.includes("defence")
    ) {
      return SPP_CERTIFICATES.civil;
    }

    if (/\bul\b/i.test(tag)) {
      return SPP_CERTIFICATES.ul;
    }

    if (/\bfm\b/i.test(tag)) {
      return SPP_CERTIFICATES.fm;
    }

    return null;
  }

  if (productId === "bristol-fire-pumps") {
    if (/\bul\b/i.test(tag)) {
      return BRISTOL_CERTIFICATES.ul;
    }

    if (/\bfm\b/i.test(tag)) {
      return BRISTOL_CERTIFICATES.fm;
    }

    return null;
  }

  if (productId === "lede-plumbing-hvac-valves") {
    if (normalized.includes("wras")) {
      return LEDE_PLUMBING_CERTIFICATES.wras;
    }

    if (normalized.includes("nsf")) {
      return LEDE_PLUMBING_CERTIFICATES.nsf;
    }

    return null;
  }

  if (productId === "potter") {
    if (/\bul\b/i.test(tag)) {
      return POTTER_CERTIFICATES.ul;
    }

    if (/\bfm\b/i.test(tag)) {
      return POTTER_CERTIFICATES.fm;
    }

    return null;
  }

  if (productId === "valmatic-air-vent") {
    if (/\bul\b/i.test(tag)) {
      return VALMATIC_CERTIFICATES.ul;
    }

    if (/\bfm\b/i.test(tag)) {
      return VALMATIC_CERTIFICATES.fm;
    }

    return null;
  }

  if (productId === "erico" || productId === "erico-hangers") {
    if (/\bul\b/i.test(tag)) {
      return ERICO_CERTIFICATES.ul;
    }

    if (/\bfm\b/i.test(tag)) {
      return ERICO_CERTIFICATES.fm;
    }

    return null;
  }

  if (productId === "mech-threaded-fittings") {
    if (
      normalized.includes("civil") ||
      normalized.includes("defense") ||
      normalized.includes("defence")
    ) {
      return MECH_CERTIFICATES.civil;
    }

    if (normalized.includes("test")) {
      return MECH_CERTIFICATES.test;
    }

    if (/\bul\b/i.test(tag)) {
      return MECH_CERTIFICATES.ul;
    }

    if (/\bfm\b/i.test(tag)) {
      return MECH_CERTIFICATES.fm;
    }

    return null;
  }

  if (productId === "lede-valves") {
    if (
      normalized.includes("civil") ||
      normalized.includes("defense") ||
      normalized.includes("defence")
    ) {
      return LEDE_FIRE_VALVE_CERTIFICATES.civil;
    }

    if (normalized.includes("test")) {
      return LEDE_FIRE_VALVE_CERTIFICATES.test;
    }

    if (/\bul\b/i.test(tag)) {
      return LEDE_FIRE_VALVE_CERTIFICATES.ul;
    }

    if (/\bfm\b/i.test(tag)) {
      return LEDE_FIRE_VALVE_CERTIFICATES.fm;
    }

    return null;
  }

  if (productId === "lede-grooved-fittings") {
    if (
      normalized.includes("civil") ||
      normalized.includes("defense") ||
      normalized.includes("defence")
    ) {
      return LEDE_GROOVED_CERTIFICATES.civil;
    }

    if (normalized.includes("test")) {
      return LEDE_GROOVED_CERTIFICATES.test;
    }

    if (/\bul\b/i.test(tag)) {
      return LEDE_GROOVED_CERTIFICATES.ul;
    }

    if (/\bfm\b/i.test(tag)) {
      return LEDE_GROOVED_CERTIFICATES.fm;
    }

    return null;
  }

  if (productId === "viking-sprinklers") {
    if (/\bul\b/i.test(tag)) {
      return VIKING_SPRINKLER_CERTIFICATES.ul;
    }

    if (/\bfm\b/i.test(tag)) {
      return VIKING_SPRINKLER_CERTIFICATES.fm;
    }

    return null;
  }

  if (productId === "tiger-steel-pipes") {
    if (
      normalized.includes("civil") ||
      normalized.includes("defense") ||
      normalized.includes("defence")
    ) {
      return TIGER_STEEL_CERTIFICATES.civil;
    }

    if (normalized.includes("test")) {
      return TIGER_STEEL_CERTIFICATES.test;
    }

    if (/\bul\b/i.test(tag)) {
      return TIGER_STEEL_CERTIFICATES.ul;
    }

    if (/\bfm\b/i.test(tag)) {
      return TIGER_STEEL_CERTIFICATES.fm;
    }

    return null;
  }

  if (productId === "fire-cabinets") {
    if (
      normalized.includes("civil") ||
      normalized.includes("defense") ||
      normalized.includes("defence")
    ) {
      return KM_CABINET_CERTIFICATES.civil;
    }

    if (normalized.includes("bsi") || normalized.includes("kitemark")) {
      return KM_CABINET_CERTIFICATES.bsi;
    }

    if (normalized.includes("lpcb") || normalized.includes("lpcp")) {
      return KM_CABINET_CERTIFICATES.lpcb;
    }

    if (normalized.includes("test")) {
      return KM_CABINET_CERTIFICATES.test;
    }

    if (/\bul\b/i.test(tag)) {
      return KM_CABINET_CERTIFICATES.ul;
    }

    if (/\bfm\b/i.test(tag)) {
      return KM_CABINET_CERTIFICATES.fm;
    }

    return null;
  }

  if (productId === "fire-hydrant") {
    if (
      normalized.includes("civil") ||
      normalized.includes("defense") ||
      normalized.includes("defence")
    ) {
      return KM_HYDRANT_CERTIFICATES.civil;
    }

    if (/\bul\b/i.test(tag)) {
      return KM_HYDRANT_CERTIFICATES.ul;
    }

    if (/\bfm\b/i.test(tag)) {
      return KM_HYDRANT_CERTIFICATES.fm;
    }

    return null;
  }

  if (productId === "fire-valves") {
    if (
      normalized.includes("civil") ||
      normalized.includes("defense") ||
      normalized.includes("defence")
    ) {
      return KM_VALVE_CERTIFICATES.civil;
    }

    if (normalized.includes("wras")) {
      return KM_VALVE_CERTIFICATES.wras;
    }

    if (normalized.includes("test")) {
      return KM_VALVE_CERTIFICATES.test;
    }

    if (/\bul\b/i.test(tag)) {
      return KM_VALVE_CERTIFICATES.ul;
    }

    if (/\bfm\b/i.test(tag)) {
      return KM_VALVE_CERTIFICATES.fm;
    }
  }

  return null;
}

export function productDocuments(productId: string): ProductDocument[] {
  if (productId === "valmatic-air-vent") {
    return [
      {
        src: "/Technical/valmatic-air-vent-submittal.pdf",
        title: "VALMATIC Automatic Air Vent Submittal",
        category: "TECHNICAL SUBMITTAL",
      },
    ];
  }
  if (productId === "potter") {
    return [
      {
        src: "/Technical/potter-submittal.pdf",
        title: "POTTER Fire Sprinkler Monitoring Submittal",
        category: "TECHNICAL SUBMITTAL",
      },
    ];
  }

  if (productId === "victaulic-machines") {
    return [
      {
        src: "/Technical/tuwei-machines-catalogue.pdf",
        title: "VICTAULIC-TUWEI Pipe Machinery Catalogue",
        category: "TECHNICAL SUBMITTAL",
      },
    ];
  }

  if (productId === "erico") {
    return [
      {
        src: "/Technical/erico-hangers-submittal.pdf",
        title: "ERICO Hangers Submittal",
        category: "TECHNICAL SUBMITTAL",
      },
    ];
  }

  if (productId === "zurn-drains") {
    return [
      {
        src: "/Technical/zurn-drains-submittal.pdf",
        title: "KIRMARY - ZURN Drains Submittal",
        category: "TECHNICAL SUBMITTAL",
      },
    ];
  }

  if (productId === "lede-valves") {
    return [
      {
        src: "/Technical/lede-fire-valves-catalogue.pdf",
        title: "LEDE Fire Valves Catalogue",
        category: "PRODUCT CATALOGUE",
      },
      {
        src: "/Technical/lede-fire-valves-submittal.pdf",
        title: "LEDE Valves for Fire Fighting Works",
        category: "TECHNICAL SUBMITTAL",
      },
    ];
  }

  if (productId === "lede-grooved-fittings") {
    return [
      {
        src: "/Technical/lede-grooved-catalogue-up-to-24.pdf",
        title: "LEDE Grooved Catalogue - Up to 24 Inch",
        category: "PRODUCT CATALOGUE",
      },
      {
        src: "/Technical/lede-grooved-submittal-approvals.pdf",
        title: "LEDE Grooved Fittings Submittal & Approvals",
        category: "TECHNICAL SUBMITTAL",
      },
    ];
  }

  if (productId === "viking-sprinklers") {
    return [
      {
        src: "/Technical/viking-sprinklers-submittal.pdf",
        title: "VIKING Sprinklers Submittal",
        category: "TECHNICAL SUBMITTAL",
      },
    ];
  }

  if (productId === "tiger-steel-pipes") {
    return [
      {
        src: "/Technical/tiger-steel-erw-pipes-submittal.pdf",
        title: "TIGER Steel ERW Pipes Submittal",
        category: "TECHNICAL SUBMITTAL",
      },
    ];
  }

  if (productId === "fire-cabinets") {
    return [
      {
        src: "/Technical/kirmary-fire-cabinets-submittal.pdf",
        title: "KIRMARY Fire Hose Cabinets Submittal",
        category: "TECHNICAL SUBMITTAL",
      },
    ];
  }

  if (productId === "lede-plumbing-hvac-valves") {
    return [
      {
        src: "/Technical/lede-water-valves-catalogue.pdf",
        title: "LEDE Water Valves Catalogue",
        category: "PRODUCT CATALOGUE",
      },
      {
        src: "/Technical/lede-plumbing-hvac-submittal.pdf",
        title: "LEDE Valves - Plumbing, Water Supply & HVAC",
        category: "TECHNICAL SUBMITTAL",
      },
    ];
  }

  if (productId === "fire-hydrant") {
    return [
      {
        src: "/Technical/km-fire-hydrant-submittal.pdf",
        title: "KIRMARY Dry Fire Hydrant Technical Submittal",
        category: "TECHNICAL SUBMITTAL",
      },
    ];
  }

  if (productId === "bristol-fire-pumps") {
    return [
      {
        src: "/Technical/bristol-fire-pumps-submittal.pdf",
        title: "BRISTOL Fire Pumps Submittal",
        category: "TECHNICAL SUBMITTAL",
      },
    ];
  }

  if (productId === "spp-fire-pumps") {
    return [
      {
        src: "/Technical/spp-fire-pumps-brochure.pdf",
        title: "SPP Fire Pumps & Systems Brochure",
        category: "PRODUCT BROCHURE",
      },
      {
        src: "/Technical/spp-fire-pumps-submittal.pdf",
        title: "SPP Fire Pumps Submittal - USA - FM & UL",
        category: "TECHNICAL SUBMITTAL",
      },
    ];
  }

  if (productId === "mech-threaded-fittings") {
    return [
      {
        src: "/Technical/mech-ductile-cast-iron-pipe-fittings.pdf",
        title: "MECH Ductile & Cast Iron Pipe Fittings",
        category: "PRODUCT CATALOGUE",
      },
      {
        src: "/Technical/mech-threaded-fittings-300di-submittal.pdf",
        title: "MECH Threaded Fittings 300DI",
        category: "TECHNICAL SUBMITTAL",
      },
    ];
  }

  const archiveMatches = archiveDocuments.filter((document) => {
    const name = document.title.toLowerCase();

    if (productId === "fire-cabinets") {
      return name.includes("cabinet");
    }

    if (productId === "fire-valves") {
      return (
        name.includes("valve") ||
        name.includes("km100") ||
        name.includes("km150") ||
        name.includes("km200") ||
        name.includes("km250") ||
        name.includes("km300")
      );
    }

    if (productId === "fire-hydrant") {
      return name.includes("hydrant");
    }

    return false;
  });

  if (productId === "fire-valves") {
    return [
      {
        src: "/Technical/kirmary-valves-submittal.pdf",
        title: "KIRMARY Valves Technical Submittal",
        category: "TECHNICAL SUBMITTAL",
      },
    ];
  }

  return archiveMatches;
}

export function legacyProductFeatures(
  productId: string,
  tags: readonly string[] = [],
) {
  const displayTags =
    productId === "fire-valves"
      ? KM_VALVE_FEATURES
      : productId === "fire-hydrant"
        ? KM_HYDRANT_FEATURES
        : productId === "fire-cabinets"
          ? KM_CABINET_FEATURES
          : productId === "tiger-steel-pipes"
            ? TIGER_STEEL_FEATURES
            : productId === "viking-sprinklers"
              ? VIKING_SPRINKLER_FEATURES
              : productId === "lede-grooved-fittings"
                ? LEDE_GROOVED_FEATURES
                : productId === "lede-valves"
                  ? LEDE_FIRE_VALVE_FEATURES
                  : productId === "mech-threaded-fittings"
                    ? MECH_FEATURES
                    : productId === "erico" || productId === "erico-hangers"
                      ? ERICO_FEATURES
                      : productId === "potter"
                        ? POTTER_FEATURES
                        : productId === "valmatic-air-vent"
                          ? VALMATIC_FEATURES
                          : (tags ?? []);

  return displayTags.map((title) => ({
    title,
    certificate: certificateFromTag(title, productId),
  }));
}
