// ─────────────────────────────────────────────────────────────────────────────
//  Global Typography Scale
//  FONT_SCALE: 1.08 → all sizes increase ~8% for better readability
// ─────────────────────────────────────────────────────────────────────────────

export const FONT_SCALE = 1.08;

const s = (size) => Math.round(size * FONT_SCALE);

// ── Named scale ──────────────────────────────────────────────────────────────
export const FS = {
  // Micro / badge text
  xs:      s(11),   // 12
  // Caption / timestamp / hint
  sm:      s(12),   // 13
  // Body secondary (company, phone, label)
  base:    s(13),   // 14
  // Body primary (card name, input, button)
  md:      s(14),   // 15
  // Input text / list item title
  lg:      s(15),   // 16
  // Button text / section label
  xl:      s(16),   // 17
  // Section heading
  h4:      s(18),   // 19
  // Screen title
  h3:      s(20),   // 22
  // Header title
  h2:      s(22),   // 24
  // Large heading
  h1:      s(24),   // 26
  // Card name / avatar letter
  display: s(34),   // 37
};

export default FS;
