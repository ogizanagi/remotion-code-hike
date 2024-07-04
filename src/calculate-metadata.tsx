import { Block, HighlightedCodeBlock, parseRoot } from "codehike/blocks";
import { HighlightedCode } from "codehike/code";
import { MDXProps } from 'mdx/types';
import { CalculateMetadataFunction } from 'remotion';
import { z } from 'zod';
import { Step } from './types/steps';
import { getStepDuration } from './utils/steps';

const Schema = Block.extend({
  code: z.array(HighlightedCodeBlock),
  annotations: z.custom<HighlightedCode["annotations"]>(),
});

type Props = {
  steps: Step[];
};

export const calculateMetadata = (Content: (props: MDXProps) => JSX.Element): CalculateMetadataFunction<Props> => async () => {
  const parsed = parseRoot(Content, Schema);

  const { code } = parsed;
  const steps = [
    'images/apollo-local-resolvers.png',
    ...code,
  ];

  return {
    durationInFrames: computeDurationInFrames(steps),
    props: {
      steps,
    },
  };
};

function computeDurationInFrames(steps: Step[]) {
  return steps.reduce<number>((acc, step) => {
    acc += getStepDuration(step);

    return acc;
  }, 0)
}
