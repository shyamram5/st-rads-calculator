import {
  MAMMO_COMPOSITION, MAMMO_FINDING_TYPES, MASS_SHAPE, MASS_MARGIN, MASS_DENSITY,
  MAMMO_ASSOCIATED_FEATURES, ASYMMETRY_TYPES, CALC_MORPHOLOGY, CALC_DISTRIBUTION,
  US_ECHOTEXTURE, US_FINDING_TYPES, US_MASS_SHAPE, US_ORIENTATION, US_MARGIN,
  US_ECHO_PATTERN, US_POSTERIOR, US_ASSOCIATED_FEATURES, US_SPECIAL_CASES,
} from "./biradsRuleEngine";

function findLabel(options, value) {
  const opt = options.find(o => o.value === value);
  return opt ? opt.label : value;
}

export function buildMammoSummary(data) {
  const lines = [];
  if (data.mammoComposition) lines.push(`Breast composition: ${findLabel(MAMMO_COMPOSITION, data.mammoComposition)}`);
  if (data.findingType) lines.push(`Finding: ${findLabel(MAMMO_FINDING_TYPES, data.findingType)}`);
  if (data.massShape) lines.push(`Shape: ${findLabel(MASS_SHAPE, data.massShape)}`);
  if (data.massMargin) lines.push(`Margin: ${findLabel(MASS_MARGIN, data.massMargin)}`);
  if (data.massDensity) lines.push(`Density: ${findLabel(MASS_DENSITY, data.massDensity)}`);
  if (data.associatedFeatures?.length > 0) {
    const labels = data.associatedFeatures.map(f => findLabel(MAMMO_ASSOCIATED_FEATURES, f));
    lines.push(`Associated features: ${labels.join(", ")}`);
  }
  if (data.distortionPriorScar) lines.push(`Prior surgical scar: ${data.distortionPriorScar}`);
  if (data.asymmetryType) lines.push(`Asymmetry type: ${findLabel(ASYMMETRY_TYPES, data.asymmetryType)}`);
  if (data.asymmetryAssociatedFeatures) lines.push(`Asymmetry associated features: ${data.asymmetryAssociatedFeatures}`);
  if (data.calcMorphology) lines.push(`Calc morphology: ${findLabel(CALC_MORPHOLOGY, data.calcMorphology)}`);
  if (data.calcDistribution) lines.push(`Calc distribution: ${findLabel(CALC_DISTRIBUTION, data.calcDistribution)}`);
  if (data.calcBenignException) lines.push(`Benign exception: ${data.calcBenignException}`);
  return lines;
}

export function buildUSSummary(data) {
  const lines = [];
  if (data.usEchotexture) lines.push(`Echotexture: ${findLabel(US_ECHOTEXTURE, data.usEchotexture)}`);
  if (data.usFindingType) lines.push(`Finding: ${findLabel(US_FINDING_TYPES, data.usFindingType)}`);
  if (data.usSpecialCase) lines.push(`Special case: ${findLabel(US_SPECIAL_CASES, data.usSpecialCase)}`);
  if (data.usMassShape) lines.push(`Shape: ${findLabel(US_MASS_SHAPE, data.usMassShape)}`);
  if (data.usOrientation) lines.push(`Orientation: ${findLabel(US_ORIENTATION, data.usOrientation)}`);
  if (data.usMargin) lines.push(`Margin: ${findLabel(US_MARGIN, data.usMargin)}`);
  if (data.usEchoPattern) lines.push(`Echo pattern: ${findLabel(US_ECHO_PATTERN, data.usEchoPattern)}`);
  if (data.usPosterior) lines.push(`Posterior features: ${findLabel(US_POSTERIOR, data.usPosterior)}`);
  if (data.usAssociatedFeatures?.length > 0) {
    const labels = data.usAssociatedFeatures.map(f => findLabel(US_ASSOCIATED_FEATURES, f));
    lines.push(`Associated features: ${labels.join(", ")}`);
  }
  return lines;
}

export function buildLocationSummary(location) {
  const lines = [];
  if (location.laterality) lines.push(`Laterality: ${location.laterality}`);
  if (location.quadrant) lines.push(`Quadrant: ${location.quadrant}`);
  if (location.clock) lines.push(`Clock position: ${location.clock} o'clock`);
  if (location.depth) lines.push(`Depth: ${location.depth}`);
  if (location.distanceFromNipple) lines.push(`Distance from nipple: ${location.distanceFromNipple} cm`);
  return lines;
}