import { Schema } from '../calculate-metadata';

export function getStepDuration(step: Schema['steps'][number], defaultDuration: number = 90) {
  if (step.code) {
    const durationAnnotation = step.code.annotations.find((annotation) => annotation.name === 'duration');
    if (durationAnnotation) {
      return parseInt(durationAnnotation.query, 10);
    }
  }

  if (step.duration) {
    return step.duration;
  }

  return defaultDuration;
}
