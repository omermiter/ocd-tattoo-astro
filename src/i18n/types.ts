export interface Dictionary {
  nav: {
    home: string;
    archive: string;
    vault: string;
    register: string;
    studio: string;
    request: string;
    langSwitch: string;
    menu: string;
  };
  home: {
    skipIntro: string;
    scrubberHint: string;
    freshLabel: string;
    healedLabel: string;
    commission: { title: string; body: string; cta: string };
    vault: { title: string; nextDropLabel: string; cta: string };
    registerLatest: string;
  };
  work: {
    title: string;
    pieces: (n: number) => string;
    filter: string;
    placement: string;
    healedSuffix: string;
  };
  dossier: {
    back: string;
    placement: string;
    sessions: string;
    hours: string;
    date: string;
    stageReference: string;
    stageStencil: string;
    stageFresh: string;
    stageHealed: string;
    comparisonTitle: string;
    dragHint: string;
  };
  flash: {
    title: string;
    nextDropLabel: string;
    sealed: string;
    available: string;
    retired: string;
    liftInstruction: string;
    claimCta: string;
    claimedCta: string;
    confirmTitle: string;
    confirmBody: string;
    whatsappCta: string;
    whatsappMessage: (serial: string) => string;
    emptyState: string;
    city: string;
    claimedOn: string;
    dimensions: string;
  };
  register: {
    title: string;
    subtitle: string;
    colSerial: string;
    colClaimed: string;
    colCity: string;
    colPlacement: string;
    empty: string;
  };
  studio: {
    title: string;
    processTitle: string;
    processSteps: string[];
    aftercareTitle: string;
    aftercare: { period: string; body: string }[];
    bio: string;
  };
  request: {
    title: string;
    stepOf: (n: number, total: number) => string;
    steps: {
      placement: { label: string; placeholder: string };
      size: { label: string; placeholder: string };
      reference: { label: string; hint: string };
      window: { label: string; placeholder: string };
      description: { label: string; placeholder: string };
    };
    submitCta: string;
    continueCta: string;
    backCta: string;
    closingTitle: string;
    closingBody: string;
  };
  footer: {
    handle: string;
    location: string;
  };
  notFound: {
    title: string;
    body: string;
    backCta: string;
  };
}
