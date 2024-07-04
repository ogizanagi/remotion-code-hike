import { Step } from '../types/steps';

const DEFAULT_STEP_DURATION = 90;

export function getStepDuration(step: Step, defaultDuration: number = DEFAULT_STEP_DURATION) {
  if (typeof step === 'string') {
    return defaultDuration;
  }

  const durationAnnotation = step.annotations.find((annotation) => annotation.name === 'duration');

  if (durationAnnotation) {
    return Number.parseInt(durationAnnotation.query, 10);
  }

  return defaultDuration;
}
