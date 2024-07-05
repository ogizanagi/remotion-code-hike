import { Block, HighlightedCodeBlock, ImageBlock, parseRoot } from "codehike/blocks";
import { MDXProps } from 'mdx/types';
import { CalculateMetadataFunction } from 'remotion';
import { z } from 'zod';
import { getStepDuration } from './utils/steps';
import { Frontmatter } from './Root';
import React, { ComponentProps } from 'react';
import { Main } from './Main';

const schema = Block.extend({
  steps: z.array(
    Block.extend({
      code: HighlightedCodeBlock.optional(),
      cover: ImageBlock.optional(),
      /**
       * Allow for duration to be defined outside of the code block for unsupported languages (graphql, md, …)
       */
      duration: z.string().transform((v) => parseInt(v, 10)).optional(),
      /**
       * Allow for callouts to be defined outside of the code block for unsupported languages (graphql, md, …)
       */
      callout: z.string()
        .transform((c) => JSON.parse(c))
        .transform(([lineNumber, fromColumn, toColumn, query]) => ({
          name: "callout",
          lineNumber,
          fromColumn,
          toColumn,
          query,
        }))
        .optional()
      ,
    }).transform((c) => ({
      ...c,
      code: {
        ...c.code,
        annotations: [
          ...(c.code?.annotations ?? []),
          // Forwards the outside callout as a code block annotation
          ...(c.callout ? [c.callout] : []),
        ],
      }
    }))
  ),
})

export type Schema = z.infer<typeof schema>;

type MDX = (props: MDXProps) => React.ReactElement;

export const calculateMetadata = (
  Content: MDX,
  frontmatter: Frontmatter
): CalculateMetadataFunction<ComponentProps<typeof Main>> => async () => {
  const { steps } = parseRoot(Content, schema);

  return {
    durationInFrames: computeDurationInFrames(steps, frontmatter.stepDuration),
    props: {
      steps,
      evenSteps: frontmatter.evenSteps,
      stepDuration: frontmatter.stepDuration,
      transitionDuration: frontmatter.transitionDuration,
    },
  } as const;
};

function computeDurationInFrames(steps: Schema['steps'], defaultDuration?: number) {
  return steps.map((s) => getStepDuration(s, defaultDuration)).reduce((a, b) => a + b, 0);
}
