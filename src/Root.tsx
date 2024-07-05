import { Composition } from "remotion";
import { Main } from "./Main";
// @ts-expect-error mdx-frontmatter plugin
import Content, { frontmatter as rawFrontmatter } from "./content/content.mdx";
import { calculateMetadata } from "./calculate-metadata";
import { z } from 'zod';

const frontmatterSchema = z.object({
  title: z.string().optional(),
  width: z.number().optional().default(1080),
  height: z.number().optional().default(720),
  fps: z.number().optional().default(30),
  stepDuration: z.number().optional().default(90),
  evenSteps: z.boolean().optional().default(true),
  transitionDuration: z.number().optional().default(30),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;

export const RemotionRoot = () => {
  const frontmatter = frontmatterSchema.parse(rawFrontmatter);

  const { width, height, fps} = frontmatter;

  return (
    <>
      <Composition
        id="Content"
        component={Main}
        fps={fps}
        width={width}
        height={height}
        calculateMetadata={calculateMetadata(Content, frontmatter)}
      />
    </>
  );
};
