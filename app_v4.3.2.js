// ============================================================
//  V4.3 – Robustes Portfolio (auf Basis V4.2 Ertragsverwendung)
//  NEU: Mein Portfolio Panel – Fonds auswählen, nach Turm-Schicht
//       gruppiert, mit editierbarer %-Gewichtung pro Schicht,
//       persistent via localStorage
// ============================================================

// ── LAYER COLOURS (passend zu CSS data-block-id) ─────────────
const layerColors = {
    "block-kasse": "#FFB300",
    "block-defensiv": "#6E9E2E",
    "block-ausgewogen": "#8CC63F",
    "block-dynamisch": "#A8D84E",
    "block-maerkte": "#5D9CEC",
    "block-spezial": "#00B1EB",
    "block-tagesgeld": "#FFCA28"
};

// ── DATA ─────────────────────────────────────────────────────
const zeitphasen = [
    { id: "phase1", name: "Zeitphase 1", duration: "<= 1 Jahr", assetClass: "Geldmarkt", mappedBlocks: ["block-kasse"], exactMatchBlock: "block-kasse" },
    { id: "phase2", name: "Zeitphase 2", duration: "2-3 Jahre", assetClass: "WB Anleihen, EB Anleihen", mappedBlocks: ["block-kasse", "block-defensiv"], exactMatchBlock: "block-defensiv" },
    { id: "phase3", name: "Zeitphase 3", duration: "4-6 Jahre", assetClass: "WB Anleihen, EB Anleihen", mappedBlocks: ["block-kasse", "block-defensiv", "block-ausgewogen"], exactMatchBlock: "block-ausgewogen" },
    { id: "phase4", name: "Zeitphase 4", duration: ">6-8 Jahre", assetClass: "WB Aktien / Anleihen", mappedBlocks: ["block-kasse", "block-defensiv", "block-ausgewogen", "block-dynamisch"], exactMatchBlock: "block-dynamisch" },
    { id: "phase5", name: "Zeitphase 5", duration: ">6-8 Jahre", assetClass: "WB Aktien", mappedBlocks: ["block-kasse", "block-defensiv", "block-ausgewogen", "block-dynamisch", "block-maerkte", "block-spezial"], exactMatchBlock: "block-maerkte" },
    { id: "phase6", name: "Zeitphase 6", duration: ">6-12 Jahre", assetClass: "EB Aktien", mappedBlocks: ["block-kasse", "block-defensiv", "block-ausgewogen", "block-dynamisch", "block-maerkte", "block-spezial"], exactMatchBlock: "block-maerkte" }
];

const managementBlocks = [
    {
        id: "block-kasse", title: "Kapitalreservefonds", subtitle: "Kasse / Wertsicherung",
        funds: [
            { name: "Basis-Fonds I Nachhaltig", info: "WKN: 847809 / ISIN: DE0008478090", type: "Anleihen Euro kurz", ertrag: "ausschüttend" },
            { name: "ZinsPlus", info: "WKN: A0MUWS / ISIN: DE000A0MUWS7", type: "Geldmarkt plus", ertrag: "thesaurierend" },
            { name: "iShares EUR Government Bond 0-1yr", info: "WKN: A0RGEL / ISIN: IE00B3FH7618", type: "EB Anleihen (Kasse)", ertrag: "ausschüttend" },
            { name: "Renten Strategie K", info: "WKN: 979952 / ISIN: DE0009799528", type: "EB Anleihen (Kasse)", ertrag: "thesaurierend" },
            { name: "Flossbach von Storch - Bond Defensive", info: "WKN: A2P2FU / ISIN: LU2207302121", type: "EB Anleihen (Kasse)", ertrag: "thesaurierend" },
            { name: "iShares iBonds Dec 2025 Term E.", info: "WKN: A3EFXA / ISIN: IE000NXQKHU1", type: "EB Anleihen (Kasse)", ertrag: "ausschüttend" },
            { name: "iShares iBonds Dec 2026 Term E.", info: "WKN: A3D8E3 / ISIN: IE000SIZJZ82", type: "EB Anleihen (Kasse)", ertrag: "ausschüttend" },
            { name: "iShares iBonds Dec 2028 Term E.", info: "WKN: A3D8E7 / ISIN: IE000264WWY0", type: "EB Anleihen (Kasse)", ertrag: "ausschüttend" },
            { name: "Xtrackers Target Mat Sept 2027", info: "WKN: DBX0VA / ISIN: LU2673523218", type: "EB Anleihen (Kasse)" },
            { name: "Carmignac Credit 2027", info: "WKN: A3DK4P / ISIN: FR0014008231", type: "EB Anleihen (Kasse)", ertrag: "ausschüttend" },
            { name: "Carmignac Credit 2029", info: "WKN: A3EXGB / ISIN: FR001400KAX8", type: "EB Anleihen (Kasse)", ertrag: "ausschüttend" },
            { name: "Carmignac Credit 2031", info: "WKN: A40Y9T", type: "EB Anleihen (Kasse)", ertrag: "ausschüttend" },
            { name: "BlackRock ESG Fixed Income Strat.", info: "WKN: A0NDDA / ISIN: LU0438336264", type: "Anleihen flexibel", ertrag: "thesaurierend" },
            { name: "Carmignac Portfolio Flexible Bond", info: "WKN: A417MG / ISIN: LU3060210526", type: "Anleihen flexibel", ertrag: "ausschüttend" }
        ]
    },
    {
        id: "block-defensiv", title: "Defensive Vermögensverwalter", subtitle: "Stabilitätsorientiert",
        funds: [
            // Vermögensverwalter – defensiv (VV defensiv)
            { name: "Allianz Multi Asset Risk Control", info: "WKN: A0LBPU / ISIN: LU0268212239", type: "VV defensiv", ertrag: "ausschüttend" },
            { name: "BKC Treuhand Portfolio", info: "WKN: A0YFQ9 / ISIN: DE000A0YFQ92", type: "VV defensiv", ertrag: "ausschüttend" },
            { name: "DWS Concept DJE Alpha Renten Global", info: "WKN: 974515 / ISIN: LU0087412390", type: "VV defensiv", ertrag: "thesaurierend" },
            { name: "EB - Multi Asset Conservative", info: "WKN: A1JUU9 / ISIN: DE000A1JUU95", type: "VV defensiv", ertrag: "ausschüttend" },
            { name: "Flossbach von Storch - Multi Asset Def.", info: "WKN: A0M43U / ISIN: LU0323577923", type: "VV defensiv", ertrag: "ausschüttend" },
            { name: "Invesco Pan European High Income Fund", info: "WKN: A2H61M / ISIN: LU1775955647", type: "VV defensiv", ertrag: "ausschüttend" },
            { name: "Lazard Patrimoine SRI", info: "WKN: A2JFHW / ISIN: FR0012355139", type: "VV defensiv", ertrag: "thesaurierend" },
            { name: "ODDO BHF Polaris Moderate", info: "WKN: A2JJ1S / ISIN: DE000A2JJ1S3", type: "VV defensiv", ertrag: "thesaurierend" },
            { name: "PIMCO Strategic Income Fund", info: "WKN: A1W76Y / ISIN: IE00B7KFL990", type: "VV defensiv", ertrag: "ausschüttend" },
            { name: "Sauren Global Defensiv", info: "WKN: 214466 / ISIN: LU0163675910", type: "VV defensiv", ertrag: "thesaurierend" },
            // Weites Benchmarking Anleihen (WB Anleihen)
            { name: "Ampega Rendite Rentenfonds", info: "WKN: 848105 / ISIN: DE0008481052", type: "WB Anleihen", ertrag: "ausschüttend" },
            { name: "iShares Core Global Aggregate Bond", info: "WKN: A0RGEQ / ISIN: IE00B3F81409", type: "WB Anleihen", ertrag: "ausschüttend" },
            { name: "Lazard Nordic High Yield Bond", info: "WKN: A3DTD2 / ISIN: IE000F8BEZE4", type: "WB Anleihen", ertrag: "ausschüttend" },
            { name: "Rentenstrategie MultiManager A", info: "WKN: A0M5RE / ISIN: LU0326856028", type: "WB Anleihen" },
            { name: "Rentenstrategie MultiManager I", info: "WKN: A41FXL", type: "WB Anleihen" },
            { name: "T. Rowe Price - Diversified Income", info: "WKN: A2DW8B / ISIN: LU1676121723", type: "WB Anleihen", ertrag: "ausschüttend" },
            { name: "Vanguard EUR Corporate Bond", info: "WKN: A143JK / ISIN: IE00BZ163G84", type: "WB Anleihen", ertrag: "ausschüttend" },
            { name: "Vanguard EUR Eurozone Government", info: "WKN: A143JL / ISIN: IE00BZ163H91", type: "WB Anleihen", ertrag: "ausschüttend" },
            { name: "ACATIS IFK Value Renten", info: "WKN: A0X758 / ISIN: DE000A0X7582", type: "WB Anleihen", ertrag: "ausschüttend" },
            { name: "DWS Invest Euro High Yield Corp.", info: "WKN: DWS04F / ISIN: LU0616839766", type: "WB Anleihen", ertrag: "ausschüttend" },
            { name: "Morgan Stanley - Global Convertible Bond", info: "WKN: 633596", type: "WB Anleihen", ertrag: "thesaurierend" },
            { name: "Schroder ISF Sustainable Euro Credit", info: "WKN: A2PXFB / ISIN: LU2080003614", type: "WB Anleihen", ertrag: "thesaurierend" }
        ]
    },
    {
        id: "block-ausgewogen", title: "Ausgewogene Vermögensverwalter", subtitle: "Balance aus Chance & Sicherheit",
        funds: [
            // Vermögensverwalter – ausgewogen (WB Aktien/Anleihen ausgewogen)
            { name: "ACATIS Value Event Fonds D", info: "WKN: A2DR2M / ISIN: DE000A2DR2M0", type: "VV ausgewogen", ertrag: "ausschüttend" },
            { name: "Allianz Better World Dynamic", info: "WKN: A3CUB5 / ISIN: LU2364421870", type: "VV ausgewogen", ertrag: "ausschüttend" },
            { name: "Dynamic Global Balance", info: "WKN: A0EAWB / ISIN: DE000A0EAWB2", type: "VV ausgewogen", ertrag: "ausschüttend" },
            { name: "FERI Core Strategy Balanced F", info: "WKN: A12GMF / ISIN: LU1155658856", type: "VV ausgewogen", ertrag: "ausschüttend" },
            { name: "GANÉ Value Event Fund M", info: "WKN: A407LK / ISIN: DE000A407LK3", type: "VV ausgewogen", ertrag: "ausschüttend" },
            { name: "JPM Total Emerging Markets Income", info: "WKN: A1W5Y6 / ISIN: LU0974360454", type: "VV ausgewogen", ertrag: "ausschüttend" },
            { name: "MEAG EuroBalance", info: "WKN: 975745 / ISIN: DE0009757450", type: "VV ausgewogen", ertrag: "ausschüttend" },
            { name: "MFS Prudent Capital", info: "WKN: A2ANEB / ISIN: LU1442549025", type: "VV ausgewogen", ertrag: "thesaurierend" },
            { name: "ODDO BHF Polaris Flexible", info: "WKN: A0M003 / ISIN: LU0319572730", type: "VV ausgewogen", ertrag: "ausschüttend" },
            { name: "Phaidros Funds - Balanced", info: "WKN: A0MN91 / ISIN: LU0295585748", type: "VV ausgewogen", ertrag: "thesaurierend" },
            { name: "Sauren Global Balanced", info: "WKN: 930920 / ISIN: LU0106280836", type: "VV ausgewogen", ertrag: "thesaurierend" },
            { name: "Swisscanto Portfolio Fund Sust. Balanced", info: "WKN: A41MQN / ISIN: LU2637080321", type: "VV ausgewogen", ertrag: "thesaurierend" },
            { name: "X of the Best - ausgewogen", info: "WKN: A1CVCD / ISIN: LU0497150481", type: "VV ausgewogen", ertrag: "ausschüttend" },
            // WB Aktien/Anleihen/Edelmetalle – ausgewogen
            { name: "Allianz Income and Growth", info: "WKN: A1J24Q / ISIN: LU0690374546", type: "WB Aktien/Anleihen", ertrag: "ausschüttend" },
            { name: "Guinness Global Equity Income", info: "WKN: A2DKZV / ISIN: IE00BD0NVN71", type: "WB Aktien/Anleihen", ertrag: "ausschüttend" },
            { name: "Nordea Global Stable Equity", info: "WKN: 591135", type: "WB Aktien/Anleihen" },
            { name: "OptoFlex I", info: "WKN: A1J4YY / ISIN: DE000A1J4YY2", type: "WB Aktien (Schwankung)", ertrag: "thesaurierend" },
            { name: "ACATIS Value Event Fonds A", info: "WKN: A0X754 / ISIN: DE000A0X7541", type: "WB Aktien/Anleihen", ertrag: "ausschüttend" }
        ]
    },
    {
        id: "block-dynamisch", title: "Dynamische Vermögensverwalter", subtitle: "Weites Benchmarking auf Aktien",
        funds: [
            // Weites Benchmarking Aktien (WB Aktien) – laut VEM PDF hier korrekt zugeordnet
            { name: "ACATIS Datini Valueflex Fonds", info: "WKN: A1H72F / ISIN: DE000A1H72F1", type: "WB Aktien", ertrag: "thesaurierend" },
            { name: "Arabesque Global ESG Flexible Allocation", info: "WKN: A12HQR / ISIN: LU1164757400", type: "WB Aktien (VV dyn.)", ertrag: "ausschüttend" },
            { name: "BL Global 75", info: "WKN: 986855 / ISIN: LU0048293285", type: "WB Aktien (VV dyn.)", ertrag: "ausschüttend" },
            { name: "DWS ESG Dynamic Opportunities", info: "WKN: DWS17J / ISIN: DE000DWS17J0", type: "WB Aktien (VV dyn.)", ertrag: "thesaurierend" },
            { name: "FERI Core Strategy Dynamic F", info: "WKN: A12GMG / ISIN: LU1155658930", type: "WB Aktien (VV dyn.)", ertrag: "ausschüttend" },
            { name: "FMM-Fonds", info: "WKN: 847811 / ISIN: DE0008478116", type: "WB Aktien (VV dyn.)", ertrag: "thesaurierend" },
            { name: "FS Exponential Technologies P", info: "WKN: A2DMRL / ISIN: LU1575871881", type: "WB Aktien", ertrag: "ausschüttend" },
            { name: "FvS - Multiple Opportunities R", info: "WKN: A0M430 / ISIN: LU0323578657", type: "WB Aktien (VV dyn.)", ertrag: "ausschüttend" },
            { name: "GlobalPortfolioOne", info: "WKN: A2PT6U / ISIN: AT0000A2B4T3", type: "WB Aktien (VV dyn.)", ertrag: "thesaurierend" },
            { name: "ÖkoWorld ÖkoVision Classic", info: "WKN: 974968 / ISIN: LU0061928585", type: "WB Aktien", ertrag: "thesaurierend" },
            { name: "X of the Best - dynamisch", info: "WKN: A0Q5MC / ISIN: LU0374994712", type: "WB Aktien", ertrag: "ausschüttend" },
            // FERI Konzepte (ebenfalls dynamisch zugeordnet)
            { name: "smarTrack balanced B", info: "WKN: A2PSGG / ISIN: LU1717097338", type: "WB Aktien/Anleihen", ertrag: "ausschüttend" },
            { name: "smarTrack growth B", info: "WKN: A2PSGF / ISIN: LU1717097767", type: "WB Aktien/Anleihen", ertrag: "ausschüttend" },
            // Zielrendite Multi Asset / Absolute Return
            { name: "DWS Concept Kaldemorgen", info: "WKN: DWSK01 / ISIN: LU0599946976", type: "Zielrendite Multi Asset", ertrag: "ausschüttend" }
        ]
    },
    {
        id: "block-maerkte", title: "Märkte", subtitle: "Enges Benchmarking auf Aktien",
        funds: [
            // EB Aktien – weltweit breite Markt-ETFs
            { name: "iShares Core MSCI World UCITS ETF", info: "WKN: A0RPWH / ISIN: IE00B4L5Y983", type: "EB Aktien", ertrag: "thesaurierend" },
            { name: "iShares Core S&P 500 UCITS ETF", info: "WKN: A0YEDG / ISIN: IE00B5BMR087", type: "EB Aktien", ertrag: "thesaurierend" },
            { name: "Xtrackers MSCI World UCITS ETF", info: "WKN: A1XB5V / ISIN: IE00BJ0KDQ92", type: "EB Aktien" },
            { name: "UBS MSCI ACWI SRI UCITS ETF", info: "WKN: A2PL5B / ISIN: IE00BDR55471", type: "EB Aktien" },
            { name: "UBS MSCI World SRI UCITS ETF", info: "WKN: A2PZBH / ISIN: IE00BK72HH44", type: "EB Aktien" },
            { name: "Vanguard FTSE Developed Europe ETF", info: "WKN: A1T8FS / ISIN: IE00B945VV12", type: "EB Aktien" },
            { name: "iShares MSCI World Small Cap ETF", info: "WKN: A2DWBY / ISIN: IE00BF4RFH31", type: "EB Aktien", ertrag: "thesaurierend" },
            { name: "UBS MSCI ACWI Socially Resp. ETF", info: "WKN: A2PL58 / ISIN: IE00BDR55L72", type: "EB Aktien" },
            // EB Aktien – Regionen
            { name: "AB SICAV - American Growth Port.", info: "WKN: 986838 / ISIN: LU0077335932", type: "EB Aktien" },
            { name: "Aktienstrategie MultiManager", info: "WKN: A0M5RD / ISIN: LU0326856845", type: "EB Aktien", ertrag: "thesaurierend" },
            { name: "Eleva European Selection Fund", info: "WKN: A2PKNU / ISIN: LU1610664406", type: "EB Aktien", ertrag: "ausschüttend" },
            { name: "Fidelity Funds - Germany", info: "WKN: A0LF01 / ISIN: LU0261948227", type: "EB Aktien", ertrag: "thesaurierend" },
            { name: "Fidelity Funds - Global Technology", info: "WKN: 921800 / ISIN: LU0115765816", type: "EB Aktien", ertrag: "thesaurierend" },
            { name: "Janus Henderson Horizon Pan Eur. Smaller", info: "WKN: 989229 / ISIN: LU0088927925", type: "EB Aktien", ertrag: "thesaurierend" },
            { name: "Pictet - Quest Europe Sust. Equities", info: "WKN: 750443 / ISIN: LU0144509717", type: "EB Aktien" },
            { name: "iShares MSCI EM Asia UCITS ETF", info: "WKN: A1C1H5 / ISIN: IE00B5L8K969", type: "EB Aktien", ertrag: "thesaurierend" },
            { name: "Xtrackers MSCI EM UCITS ETF", info: "WKN: A12GVR / ISIN: IE00BTJRMP35", type: "EB Aktien" },
            { name: "Xtrackers DAX UCITS ETF", info: "WKN: DBX1DA / ISIN: LU0274211480", type: "EB Aktien" },
            { name: "Xtrackers Euro Stoxx 50 UCITS ETF", info: "WKN: DBX1EU / ISIN: LU0274211217", type: "EB Aktien" },
            { name: "Xtrackers Nikkei 225 UCITS ETF", info: "WKN: DBX0NJ / ISIN: LU0839027447", type: "EB Aktien" },
            { name: "Xtrackers Art. Intel. & Big Data ETF", info: "WKN: A2N6LC / ISIN: IE00BGV5VN51", type: "EB Aktien" },
            { name: "Xtrackers MSCI World Energy ETF", info: "WKN: A113FF / ISIN: IE00BP3QZB59", type: "EB Aktien" },
            { name: "AXA IM Nasdaq 100 UCITS ETF", info: "WKN: A3DXEB / ISIN: IE000QDFFK00", type: "EB Aktien", ertrag: "thesaurierend" },
            { name: "Global X Uranium UCITS ETF", info: "WKN: A3DC8S / ISIN: IE000NDUGN37", type: "EB Aktien", ertrag: "thesaurierend" },
            { name: "iShares Digital Security UCITS ETF", info: "WKN: A2JMGE / ISIN: IE00BG0J4C88", type: "EB Aktien", ertrag: "thesaurierend" },
            { name: "VanEck Defense UCITS ETF", info: "WKN: A3D9M1 / ISIN: IE000YYE6WK5", type: "EB Aktien" },
            { name: "iShares NASDAQ US Biotechnology", info: "WKN: A2DWAW / ISIN: IE00BYXG2H39", type: "EB Aktien", ertrag: "thesaurierend" }
        ]
    },
    {
        id: "block-spezial", title: "Spezialitäten / Themen", subtitle: "Immobilien, PE, Gold, Beteiligungen",
        funds: [
            // EB Edelmetalle & Rohstoffe
            { name: "BGF World Gold Fund", info: "WKN: 974119 / ISIN: LU0055631609", type: "EB Edelmetalle", ertrag: "thesaurierend" },
            { name: "BGF World Mining Fund", info: "WKN: 986932 / ISIN: LU0075056555", type: "EB Rohstoffe", ertrag: "thesaurierend" },
            { name: "HansaGold", info: "WKN: A0NEKK / ISIN: DE000A0NEKK2", type: "EB Edelmetalle", ertrag: "thesaurierend" },
            { name: "Vontobel Fund - Commodity", info: "WKN: A2JKK0 / ISIN: LU1683488867", type: "EB Rohstoffe", ertrag: "thesaurierend" },
            { name: "DJE - Gold & Stabilitätsfonds", info: "WKN: A0M67Q / ISIN: LU0323357649", type: "WB Sachwerte", ertrag: "ausschüttend" },
            // Themen-Spezialfonds
            { name: "BGF World Healthscience Fund", info: "WKN: A0BL36 / ISIN: LU0171307068", type: "EB Aktien Gesundheit", ertrag: "thesaurierend" },
            { name: "DNB Fund Renewable Energy", info: "WKN: A0MWAL / ISIN: LU0302296149", type: "EB Aktien Energie", ertrag: "thesaurierend" },
            { name: "Janus Henderson Horizon Global Tech.", info: "WKN: A0MP0Q / ISIN: LU0264738294", type: "EB Aktien Themen", ertrag: "thesaurierend" },
            { name: "Morgan Stanley - Global Opportunity", info: "WKN: A1H6XK / ISIN: LU0552385295", type: "EB Aktien Themen", ertrag: "thesaurierend" },
            { name: "Nomura India Equity Fund", info: "WKN: A1C9ED / ISIN: IE00B35HDY84", type: "EB Aktien Region" },
            { name: "Pictet - Robotics", info: "WKN: A141Q9 / ISIN: LU1279334053", type: "EB Aktien Themen" },
            { name: "Pictet - Timber", info: "WKN: A0QZ7T / ISIN: LU0340559557", type: "EB Aktien Themen" },
            { name: "Robeco Sustainable Water", info: "WKN: A2QBUQ / ISIN: LU2146190835", type: "EB Aktien Themen" },
            { name: "Triodos Pioneer Impact Fund", info: "WKN: A4039Q / ISIN: LU2723591728", type: "EB Aktien Themen" },
            { name: "Wellington Enduring Infrastructure Assets", info: "WKN: A2PGYQ", type: "EB Aktien Themen" }
        ]
    },
    {
        id: "block-tagesgeld", title: "Tagesgeld", subtitle: "Kurzfristige Einlagen",
        funds: [
            { name: "Basis-Fonds I Nachhaltig", info: "WKN: 847809 / ISIN: DE0008478090", type: "Anleihen Euro kurz", ertrag: "ausschüttend" },
            { name: "Flossbach von Storch - Bond", info: "WKN: A2P9FU", type: "EB Anleihen (Kasse)", ertrag: "thesaurierend" },
            { name: "iShares EUR Government Bond 0-1yr", info: "WKN: A0RGEL / ISIN: IE00B3FH7618", type: "EB Anleihen (Kasse)", ertrag: "ausschüttend" },
            { name: "iShares iBonds Dec 2026 Term E.", info: "WKN: A3D8E3 / ISIN: IE000SIZJZ82", type: "EB Anleihen (Kasse)", ertrag: "ausschüttend" },
            { name: "iShares iBonds Dec 2028 Term E.", info: "WKN: A3D8E7 / ISIN: IE000264WWY0", type: "EB Anleihen (Kasse)", ertrag: "ausschüttend" },
            { name: "Renten Strategie K", info: "WKN: 979951 / ISIN: DE0009799528", type: "EB Anleihen (Kasse)", ertrag: "thesaurierend" },
            { name: "Xtrackers Target Mat Sept 2027", info: "WKN: DBX0VA / ISIN: LU2673523218", type: "EB Anleihen (Kasse)" },
            { name: "ZinsPlus", info: "WKN: A0MUWS / ISIN: DE000A0MUWS7", type: "Geldmarkt plus", ertrag: "thesaurierend" },
            { name: "Tagesgeldkonto", info: "Bankeinlage", type: "Geldmarkt" }
        ]
    }
];

// ── PORTFOLIO STATE ───────────────────────────────────────────
const STORAGE_KEY = 'portfolioV432_ertragsverwendung';
const GLOBALS_KEY = 'portfolioGlobalsV432';

// portfolio = [{ blockId, blockTitle, allocation: Number, funds:[{name,info,type,ertrag}] }]
let portfolio = loadPortfolio();

function loadPortfolio() {
    try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r); } catch (e) { }
    return [];
}
function savePortfolio() { localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio)); }

function loadGlobals() {
    try { const r = localStorage.getItem(GLOBALS_KEY); if (r) return JSON.parse(r); } catch (e) { }
    return {
        totalInvestment: 0,
        totalSparrate: 0,
        fundInvestments: {},
        fundSparrates: {}
    };
}
let portfolioGlobals = loadGlobals();
function saveGlobals() { localStorage.setItem(GLOBALS_KEY, JSON.stringify(portfolioGlobals)); }

function getOrCreateLayer(blockId, blockTitle) {
    let layer = portfolio.find(l => l.blockId === blockId);
    if (!layer) {
        layer = { blockId, blockTitle, allocation: 0, funds: [] };
        const order = managementBlocks.map(b => b.id);
        const idx = order.indexOf(blockId);
        const at = portfolio.findIndex(l => order.indexOf(l.blockId) > idx);
        if (at === -1) portfolio.push(layer); else portfolio.splice(at, 0, layer);
    }
    return layer;
}

function isFundSelected(blockId, fundName) {
    const l = portfolio.find(l => l.blockId === blockId);
    return l ? l.funds.some(f => f.name === fundName) : false;
}

function addFund(block, fund) {
    const layer = getOrCreateLayer(block.id, block.title);
    if (!isFundSelected(block.id, fund.name))
        layer.funds.push({ name: fund.name, info: fund.info, type: fund.type, ertrag: fund.ertrag });
    savePortfolio();
}

function removeFund(blockId, fundName) {
    const layer = portfolio.find(l => l.blockId === blockId);
    if (!layer) return;
    layer.funds = layer.funds.filter(f => f.name !== fundName);
    if (layer.funds.length === 0) portfolio = portfolio.filter(l => l.blockId !== blockId);
    savePortfolio();
}

function setLayerAllocation(blockId, value) {
    const layer = portfolio.find(l => l.blockId === blockId);
    if (layer) { layer.allocation = Math.max(0, Math.min(100, Number(value) || 0)); savePortfolio(); }
}

function resetPortfolio() { portfolio = []; savePortfolio(); }

// ── MAIN ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    const timelineContainer = document.getElementById('timeline-container');
    const towerContainer = document.getElementById('tower-container');
    const sideTowerContainer = document.getElementById('side-tower-container');
    const detailPhaseName = document.getElementById('detail-phase-name');
    const detailDuration = document.getElementById('detail-duration');
    const detailAssetClass = document.getElementById('detail-asset-class');
    const detailCard = document.getElementById('phase-detail-card');
    const modal = document.getElementById('funds-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalList = document.getElementById('modal-funds-list');
    const modalFilter = document.getElementById('modal-filter');
    const closeBtn = document.querySelector('.close-modal');
    const totalInvestmentInput = document.getElementById('total-investment-input');
    const totalDistributedDisplay = document.getElementById('total-distributed-display');
    const totalRemainingDisplay = document.getElementById('total-remaining-display');
    const totalInvestmentSparrate = document.getElementById('total-investment-sparrate');
    const sparrateDistributedDisplay = document.getElementById('sparrate-distributed-display');
    const sparrateRemainingDisplay = document.getElementById('sparrate-remaining-display');
    const layerBreakdownList = document.getElementById('layer-breakdown-list');
    const pdfExportBtn = document.getElementById('pdf-export-btn');
    const panelEmpty = document.getElementById('panel-empty');
    const panelLayers = document.getElementById('panel-layers');
    const allocTotal = document.getElementById('alloc-total');
    const allocBarFill = document.getElementById('alloc-bar-fill');
    const resetBtn = document.getElementById('reset-portfolio-btn');
    const printBtn = document.getElementById('print-portfolio-btn');

    let currentBlockData = null;

    // ── FORMATTERS ──────────────────────────────────────────
    const formatCurrency = a => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(a);
    const formatNumberInput = a => a === 0 ? '' : new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a);
    const parseEuro = s => { if (!s) return 0; const p = parseFloat(s.toString().replace(/\./g, '').replace(',', '.')); return isNaN(p) ? 0 : p; };

    // ── FINANCE OVERVIEW (V4.2) ─────────────────────────────
    const updateFinancialOverview = () => {
        let totalDistributedEinmal = 0;
        let totalDistributedSparrate = 0;
        const layerTotalsEinmal = {};
        const layerTotalsSparrate = {};

        managementBlocks.forEach(block => {
            let be = 0;
            let bs = 0;
            block.funds.forEach(f => {
                be += portfolioGlobals.fundInvestments[f.name] || 0;
                bs += portfolioGlobals.fundSparrates[f.name] || 0;
            });
            if (be > 0) layerTotalsEinmal[block.id] = be;
            if (bs > 0) layerTotalsSparrate[block.id] = bs;
            totalDistributedEinmal += be;
            totalDistributedSparrate += bs;
        });

        const remainingEinmal = portfolioGlobals.totalInvestment - totalDistributedEinmal;
        const remainingSparrate = portfolioGlobals.totalSparrate - totalDistributedSparrate;

        if (totalDistributedDisplay) totalDistributedDisplay.textContent = formatCurrency(totalDistributedEinmal);
        if (totalRemainingDisplay) {
            totalRemainingDisplay.textContent = formatCurrency(remainingEinmal);
            const row = totalRemainingDisplay.closest('.finance-row');
            if (row) row.classList.toggle('negative-balance', remainingEinmal < 0);
        }

        if (sparrateDistributedDisplay) sparrateDistributedDisplay.textContent = formatCurrency(totalDistributedSparrate);
        if (sparrateRemainingDisplay) {
            sparrateRemainingDisplay.textContent = formatCurrency(remainingSparrate);
            const row = sparrateRemainingDisplay.closest('.finance-row');
            if (row) row.classList.toggle('negative-balance', remainingSparrate < 0);
        }

        if (layerBreakdownList) {
            layerBreakdownList.innerHTML = '';
            document.querySelectorAll('.layer-assigned-amount,.layer-assigned-amount-right').forEach(b => { b.classList.remove('visible'); b.textContent = ''; });
            const ids = Object.keys(layerTotalsEinmal);
            if (ids.length === 0) {
                layerBreakdownList.innerHTML = '<li class="empty-breakdown">Noch keine Beträge zugewiesen</li>';
            } else {
                ids.forEach(blockId => {
                    const block = managementBlocks.find(b => b.id === blockId);
                    if (!block) return;
                    const amountEinmal = layerTotalsEinmal[blockId];
                    const amountSpar = layerTotalsSparrate[blockId] || 0;
                    const color = layerColors[blockId] || '#BEB6AA';
                    const li = document.createElement('li');

                    let breakdownStr = formatCurrency(amountEinmal);
                    if (amountSpar > 0) breakdownStr += ` + ${formatCurrency(amountSpar)} mtl.`;

                    li.innerHTML = `<span class="breakdown-layer-name"><span class="layer-color-dot" style="background:${color}"></span>${block.title}</span><span class="breakdown-amount">${breakdownStr}</span>`;
                    layerBreakdownList.appendChild(li);

                    const layerEl = document.getElementById(blockId);
                    if (layerEl) {
                        const cls = blockId === 'block-tagesgeld' ? 'layer-assigned-amount-right' : 'layer-assigned-amount';
                        let badge = layerEl.querySelector(`.${cls}`);
                        if (!badge) { badge = document.createElement('div'); badge.className = cls; layerEl.appendChild(badge); }
                        badge.textContent = breakdownStr;
                        badge.classList.add('visible');
                    }
                });
            }
        }

        if (pdfExportBtn) {
            const ok = portfolioGlobals.totalInvestment > 0 && remainingEinmal === 0 && remainingSparrate === 0;
            pdfExportBtn.toggleAttribute('disabled', !ok);
            ok ? pdfExportBtn.removeAttribute('title') : pdfExportBtn.setAttribute('title', 'Bitte verteilen Sie zunächst das gesamte Anlagevermögen (Verbleibend: 0 €).');
        }

        if (portfolio.length > 0) {
            portfolio.forEach(layer => {
                const blockTotal = layerTotalsEinmal[layer.blockId] || 0;
                layer.allocation = portfolioGlobals.totalInvestment > 0
                    ? Math.round(blockTotal / portfolioGlobals.totalInvestment * 100 * 10) / 10
                    : 0;
            });
            savePortfolio();
        }
    };

    if (totalInvestmentInput) {
        totalInvestmentInput.value = portfolioGlobals.totalInvestment > 0 ? formatNumberInput(portfolioGlobals.totalInvestment) : '';
        totalInvestmentInput.addEventListener('blur', e => {
            const v = parseEuro(e.target.value);
            portfolioGlobals.totalInvestment = v > 0 ? v : 0;
            e.target.value = v > 0 ? formatNumberInput(v) : '';
            saveGlobals();
            updateFinancialOverview(); renderPanel();
        });
        totalInvestmentInput.addEventListener('focus', e => {
            e.target.value = portfolioGlobals.totalInvestment > 0 ? portfolioGlobals.totalInvestment.toString().replace('.', ',') : '';
        });
        totalInvestmentInput.addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });
    }

    if (totalInvestmentSparrate) {
        totalInvestmentSparrate.value = portfolioGlobals.totalSparrate > 0 ? formatNumberInput(portfolioGlobals.totalSparrate) : '';
        totalInvestmentSparrate.addEventListener('blur', e => {
            const v = parseEuro(e.target.value);
            portfolioGlobals.totalSparrate = v > 0 ? v : 0;
            e.target.value = v > 0 ? formatNumberInput(v) : '';
            saveGlobals();
            updateFinancialOverview(); renderPanel();
        });
        totalInvestmentSparrate.addEventListener('focus', e => {
            e.target.value = portfolioGlobals.totalSparrate > 0 ? portfolioGlobals.totalSparrate.toString().replace('.', ',') : '';
        });
        totalInvestmentSparrate.addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });
    }

    // ── PORTFOLIO PANEL RENDERING ───────────────────────────
    const updateAllocBar = () => {
        let total = 0;
        document.querySelectorAll('.layer-alloc-input').forEach(inp => { total += Number(inp.value) || 0; });
        allocTotal.textContent = total;
        allocBarFill.style.width = Math.min(total, 100) + '%';
        allocBarFill.classList.toggle('over-hundred', total > 100);
        allocTotal.classList.toggle('over-hundred', total > 100);
    };

    const updateTowerBadges = () => {
        managementBlocks.forEach(block => {
            const layer = portfolio.find(l => l.blockId === block.id);
            const count = layer ? layer.funds.length : 0;
            const badge = document.querySelector(`#${block.id} .layer-selection-count`);
            if (!badge) return;
            badge.classList.toggle('visible', count > 0);
            if (count > 0) badge.textContent = `✓ ${count} ausgewählt`;
        });
    };

    const renderPanel = () => {
        panelLayers.innerHTML = '';
        if (portfolio.length === 0) {
            panelEmpty.style.display = 'flex';
            panelLayers.style.display = 'none';
            updateAllocBar();
            updateTowerBadges();
            return;
        }
        panelEmpty.style.display = 'none';
        panelLayers.style.display = 'block';

        portfolio.forEach(layer => {
            const color = layerColors[layer.blockId] || '#BEB6AA';
            const layerEl = document.createElement('div');
            layerEl.className = 'panel-layer';

            // Calculate EUR total for this layer
            let layerEurTotal = 0;
            let layerSparTotal = 0;
            layer.funds.forEach(f => {
                layerEurTotal += portfolioGlobals.fundInvestments[f.name] || 0;
                layerSparTotal += portfolioGlobals.fundSparrates[f.name] || 0;
            });
            const eurHint = layerEurTotal > 0 || layerSparTotal > 0 ? ` <span class="layer-alloc-eur">${formatCurrency(layerEurTotal)}${layerSparTotal > 0 ? ' + ' + formatCurrency(layerSparTotal) + ' mtl.' : ''}</span>` : '';

            const header = document.createElement('div');
            header.className = 'panel-layer-header';
            header.innerHTML = `
                <div class="layer-panel-dot" style="background:${color}"></div>
                <span class="layer-name">${layer.blockTitle}</span>
                <div class="layer-alloc-wrap">
                    <input class="layer-alloc-input" type="number" readonly
                        value="${layer.allocation}" data-block-id="${layer.blockId}"
                        title="Automatisch berechnet aus den eingegebenen Beträgen">
                    <span class="layer-alloc-pct">%${eurHint}</span>
                </div>`;
            layerEl.appendChild(header);

            layer.funds.forEach(fund => {
                const ertragTxt = fund.ertrag ? ` · ${fund.ertrag}` : '';
                const item = document.createElement('div');
                item.className = 'panel-fund-item';
                item.innerHTML = `
                    <div class="panel-fund-info">
                        <div class="panel-fund-name" title="${fund.name}">${fund.name}</div>
                        <div class="panel-fund-meta">${fund.info}${ertragTxt}</div>
                    </div>
                    <button class="panel-fund-remove" title="Entfernen"
                        data-block="${layer.blockId}" data-fund="${fund.name}">✕</button>`;
                layerEl.appendChild(item);
            });

            panelLayers.appendChild(layerEl);
        });

        panelLayers.querySelectorAll('.panel-fund-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                removeFund(btn.dataset.block, btn.dataset.fund);
                renderPanel();
                if (currentBlockData && currentBlockData.id === btn.dataset.block) refreshModalButtons();
            });
        });

        updateAllocBar();
        updateTowerBadges();
    };

    // ── MODAL ────────────────────────────────────────────────
    const refreshModalButtons = () => {
        if (!currentBlockData) return;
        modalList.querySelectorAll('.fund-list-item').forEach(li => {
            const sel = isFundSelected(currentBlockData.id, li.dataset.fundName);
            const btn = li.querySelector('.btn-fund-select');
            if (!btn) return;
            li.classList.toggle('is-selected', sel);
            btn.classList.toggle('selected', sel);
            btn.textContent = sel ? '✓ Ausgewählt' : '+ Auswählen';
        });
    };

    const renderFundList = funds => {
        modalList.innerHTML = '';
        if (!funds || funds.length === 0) {
            modalList.innerHTML = '<li class="fund-list-item"><span class="fund-name">Keine Fonds für diesen Filter.</span></li>';
            return;
        }
        funds.forEach(fund => {
            const sel = isFundSelected(currentBlockData.id, fund.name);
            const ertragCls = fund.ertrag === 'thesaurierend' ? 'thesaurierend' : fund.ertrag === 'ausschüttend' ? 'ausschuettend' : '';
            const ertragHtml = fund.ertrag ? `<span class="fund-badge-ertrag ${ertragCls}">${fund.ertrag}</span>` : '';
            const fundInput = `
                <div class="fund-input-wrapper">
                    <div class="fund-input-col">
                        <label class="fund-input-label">Einmalbeitrag</label>
                        <div class="currency-input-wrapper">
                            <input type="text" class="fund-investment-input" data-fund-key="${fund.name}"
                                placeholder="0,00" inputmode="decimal"
                                value="${portfolioGlobals.fundInvestments[fund.name] ? formatNumberInput(portfolioGlobals.fundInvestments[fund.name]) : ''}">
                            <span class="currency-symbol">€</span>
                        </div>
                    </div>
                    <div class="fund-input-col">
                        <label class="fund-input-label">Sparrate mtl.</label>
                        <div class="currency-input-wrapper">
                            <input type="text" class="fund-sparrate-input" data-fund-key="${fund.name}"
                                placeholder="0,00" inputmode="decimal"
                                value="${portfolioGlobals.fundSparrates[fund.name] ? formatNumberInput(portfolioGlobals.fundSparrates[fund.name]) : ''}">
                            <span class="currency-symbol">€</span>
                        </div>
                    </div>
                </div>`;

            const li = document.createElement('li');
            li.className = `fund-list-item${sel ? ' is-selected' : ''}`;
            li.dataset.fundName = fund.name;
            li.innerHTML = `
                <div class="fund-info-wrapper">
                    <div class="fund-header">
                        <span class="fund-name">${fund.name}</span>
                    </div>
                    <div style="margin-top:4px;display:flex;gap:8px;flex-wrap:wrap;">
                        <span class="fund-badge">${fund.type}</span>
                        ${ertragHtml}
                    </div>
                    <span class="fund-info" style="margin-top:6px;display:block;">${fund.info}</span>
                </div>
                ${fundInput}
                <button class="btn-fund-select${sel ? ' selected' : ''}"
                    title="${sel ? 'Klicken zum Entfernen' : 'Zum Portfolio hinzufügen'}">
                    ${sel ? '✓ Ausgewählt' : '+ Auswählen'}
                </button>`;

            // EUR Input events (V4.2)
            const inpEinmal = li.querySelector('.fund-investment-input');
            if (inpEinmal) {
                inpEinmal.addEventListener('blur', e => {
                    const v = parseEuro(e.target.value);
                    if (v > 0) { portfolioGlobals.fundInvestments[fund.name] = v; e.target.value = formatNumberInput(v); }
                    else { delete portfolioGlobals.fundInvestments[fund.name]; e.target.value = ''; }
                    saveGlobals();
                    updateFinancialOverview(); renderPanel();
                });
                inpEinmal.addEventListener('focus', e => {
                    const v = portfolioGlobals.fundInvestments[fund.name] || 0;
                    e.target.value = v > 0 ? v.toString().replace('.', ',') : '';
                });
                inpEinmal.addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });
            }

            const inpSpar = li.querySelector('.fund-sparrate-input');
            if (inpSpar) {
                inpSpar.addEventListener('blur', e => {
                    const v = parseEuro(e.target.value);
                    if (v > 0) { portfolioGlobals.fundSparrates[fund.name] = v; e.target.value = formatNumberInput(v); }
                    else { delete portfolioGlobals.fundSparrates[fund.name]; e.target.value = ''; }
                    saveGlobals();
                    updateFinancialOverview(); renderPanel();
                });
                inpSpar.addEventListener('focus', e => {
                    const v = portfolioGlobals.fundSparrates[fund.name] || 0;
                    e.target.value = v > 0 ? v.toString().replace('.', ',') : '';
                });
                inpSpar.addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });
            }

            // Portfolio select toggle (V4.3)
            const selBtn = li.querySelector('.btn-fund-select');
            selBtn.addEventListener('click', e => {
                e.stopPropagation();
                if (isFundSelected(currentBlockData.id, fund.name)) removeFund(currentBlockData.id, fund.name);
                else addFund(currentBlockData, fund);
                renderPanel();
                refreshModalButtons();
            });

            modalList.appendChild(li);
        });
    };

    const populateFilterDropdown = funds => {
        modalFilter.innerHTML = '<option value="all">Alle Managementansätze (Filter)</option>';
        if (!funds) return;
        const types = [...new Set(funds.map(f => f.type))].sort();
        types.forEach(t => { const o = document.createElement('option'); o.value = t; o.textContent = t; modalFilter.appendChild(o); });
        modalFilter.style.display = types.length > 1 ? 'block' : 'none';
    };

    modalFilter.addEventListener('change', e => {
        if (!currentBlockData) return;
        const f = e.target.value === 'all' ? currentBlockData.funds : currentBlockData.funds.filter(f => f.type === e.target.value);
        renderFundList(f);
    });

    // ── TOWER LAYERS ─────────────────────────────────────────
    const reversedBlocks = [...managementBlocks].reverse();
    reversedBlocks.forEach((block, index) => {
        const blockEl = document.createElement('div');
        blockEl.className = 'tower-layer';
        blockEl.id = block.id;
        blockEl.dataset.blockId = block.id;
        blockEl.style.zIndex = reversedBlocks.length - index;
        blockEl.innerHTML = `
            <div class="layer-selection-count"></div>
            <div class="layer-content">
                <div class="block-title">${block.title}</div>
                <div class="block-subtitle">${block.subtitle}</div>
            </div>`;

        blockEl.addEventListener('click', () => {
            currentBlockData = block;
            modalTitle.textContent = block.title;
            modalFilter.value = 'all';
            populateFilterDropdown(block.funds);
            renderFundList(block.funds);
            modal.classList.add('open');
        });

        if (block.id === 'block-tagesgeld') {
            if (sideTowerContainer) { blockEl.style.zIndex = 1; sideTowerContainer.appendChild(blockEl); }
        } else {
            if (towerContainer) towerContainer.appendChild(blockEl);
        }
    });

    // ── MODAL CLOSE ──────────────────────────────────────────
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    window.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

    // ── PHASE HIGHLIGHTING ───────────────────────────────────
    const highlightBlocks = (mappedIds, exactId) => {
        document.querySelectorAll('.tower-layer').forEach(el => {
            el.classList.remove('highlighted', 'exact-match');
            const b = el.querySelector('.exact-match-badge'); if (b) b.remove();
        });
        mappedIds.forEach(blockId => {
            const b = document.getElementById(blockId);
            if (!b) return;
            b.classList.add('highlighted');
            if (blockId === exactId) {
                b.classList.add('exact-match');
                const bgColor = window.getComputedStyle(b).backgroundColor;
                b.style.setProperty('--badge-color', bgColor);
                const badge = document.createElement('div');
                badge.className = 'exact-match-badge';
                badge.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Passender Ansatz`;
                b.insertBefore(badge, b.firstChild);
            }
        });
    };

    const updateDetails = phase => {
        if (!phase) {
            detailPhaseName.textContent = 'Alle Phasen anzeigen';
            detailDuration.textContent = 'Gesamter Anlagehorizont';
            detailAssetClass.textContent = 'Alle verfügbaren Anlageklassen';
            detailCard.classList.remove('active-state');
            return;
        }
        detailPhaseName.textContent = phase.name;
        detailDuration.textContent = phase.duration;
        detailAssetClass.textContent = phase.assetClass;
        detailCard.classList.add('active-state');
    };

    let activePhaseId = null;

    const handlePhaseClick = phase => {
        if (activePhaseId === phase.id) {
            activePhaseId = null;
            document.querySelectorAll('.timeline-btn').forEach(b => b.classList.remove('active'));
            updateDetails(null);
            document.querySelectorAll('.tower-layer').forEach(el => { el.classList.add('highlighted'); el.classList.remove('exact-match'); const b = el.querySelector('.exact-match-badge'); if (b) b.remove(); });
            return;
        }
        activePhaseId = phase.id;
        document.querySelectorAll('.timeline-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll(`.timeline-btn[data-phase="${phase.id}"]`).forEach(b => b.classList.add('active'));
        updateDetails(phase);
        highlightBlocks(phase.mappedBlocks, phase.exactMatchBlock);
    };

    // ── TIMELINE BUTTONS ─────────────────────────────────────
    zeitphasen.forEach(phase => {
        const btn = document.createElement('button');
        btn.className = 'timeline-btn'; btn.textContent = phase.name; btn.dataset.phase = phase.id;
        btn.addEventListener('click', () => handlePhaseClick(phase));
        timelineContainer.appendChild(btn);
    });

    // ── PDF EXPORT (V4.2) ────────────────────────────────────
    if (pdfExportBtn) {
        pdfExportBtn.addEventListener('click', () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const now = new Date();
            const dateStr = now.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }).replace(':', '-');
            const fileName = `${formatNumberInput(totalInvestment).replace(/\./g, '')}_€_${dateStr.replace(/\./g, '-')}_${timeStr}.pdf`;

            doc.setFontSize(18); doc.setTextColor(3, 61, 93);
            doc.text('Anlagevorschlag - Robustes Portfolio', 14, 20);
            doc.setFontSize(11); doc.setTextColor(50, 50, 50);
            doc.text(`Datum: ${dateStr} ${now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`, 14, 30);
            doc.text(`Anzulegendes Gesamtvermögen: ${formatCurrency(totalInvestment)}`, 14, 38);

            const tableData = [];
            managementBlocks.forEach(block => {
                block.funds.forEach(fund => {
                    const amount = fundInvestments[fund.name] || 0;
                    if (amount > 0) {
                        const ertragStr = fund.ertrag ? ` (${fund.ertrag})` : '';
                        tableData.push([fund.name, fund.info, `${fund.type}${ertragStr}`, formatCurrency(amount)]);
                    }
                });
            });
            if (tableData.length === 0) return;

            doc.autoTable({
                startY: 45,
                head: [['Fondsname', 'Details (WKN / Info)', 'Ansatz & Ertragsverwendung', 'Anlagebetrag']],
                body: tableData, theme: 'striped',
                headStyles: { fillColor: [3, 61, 93], textColor: 255, fontStyle: 'bold' },
                columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 50 }, 2: { cellWidth: 40 }, 3: { cellWidth: 'auto', halign: 'right' } },
                styles: { fontSize: 9, cellPadding: 4 }
            });

            // Append portfolio selection summary page
            if (portfolio.length > 0) {
                doc.addPage();
                doc.setFontSize(16); doc.setTextColor(3, 61, 93);
                doc.text('Mein Portfolio – Managementansätze & Gewichtung', 14, 20);
                doc.setFontSize(10); doc.setTextColor(80, 80, 80);
                doc.text('Ausgewählte Fonds gruppiert nach Turm-Schicht inkl. prozentualer Gewichtung:', 14, 30);

                const portData = [];
                portfolio.forEach(layer => {
                    layer.funds.forEach((fund, idx) => {
                        portData.push([
                            idx === 0 ? `${layer.blockTitle} (${layer.allocation}%)` : '',
                            fund.name,
                            fund.type,
                            fund.ertrag || '–'
                        ]);
                    });
                });

                doc.autoTable({
                    startY: 38,
                    head: [['Schicht (Gewichtung)', 'Fondsname', 'Ansatz', 'Ertragsverwendung']],
                    body: portData, theme: 'striped',
                    headStyles: { fillColor: [3, 61, 93], textColor: 255, fontStyle: 'bold' },
                    columnStyles: { 0: { cellWidth: 55 }, 1: { cellWidth: 65 }, 2: { cellWidth: 35 }, 3: { cellWidth: 'auto' } },
                    styles: { fontSize: 9, cellPadding: 4 }
                });
            }

            doc.save(fileName);
        });
    }

    // ── PANEL ACTIONS ────────────────────────────────────────
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Portfolio zurücksetzen? Alle ausgewählten Fonds und Beträge werden gelöscht.')) {
                portfolioGlobals = { totalInvestment: 0, totalSparrate: 0, fundInvestments: {}, fundSparrates: {} };
                saveGlobals();
                if (totalInvestmentInput) totalInvestmentInput.value = '';
                if (totalInvestmentSparrate) totalInvestmentSparrate.value = '';
                resetPortfolio(); renderPanel(); refreshModalButtons();
            }
        });
    }
    if (printBtn) printBtn.addEventListener('click', () => window.print());

    // ── INIT ─────────────────────────────────────────────────
    renderPanel();
    document.querySelectorAll('.tower-layer').forEach(el => el.classList.add('highlighted'));
    updateDetails(null);
});
