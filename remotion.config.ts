import { Config, WebpackOverrideFn } from "@remotion/cli/config";
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

const chConfig = {
  syntaxHighlighting: {
    theme: 'one-dark-pro',
  },
};

const enableMdx: WebpackOverrideFn = async (currentConfiguration) => {
  const { remarkCodeHike, recmaCodeHike } = await import('codehike/mdx');

  return {
    ...currentConfiguration,
    module: {
      ...currentConfiguration.module,
      rules: [
        ...(currentConfiguration.module?.rules
          ? currentConfiguration.module.rules
          : []),
        {
          test: /\.mdx?$/,
          use: [
            {
              loader: '@mdx-js/loader',
              /** @type {import('@mdx-js/loader').Options} */
              options: {
                remarkPlugins: [
                  // About .default workaround:
                  // https://github.com/shikijs/twoslash/issues/147#issuecomment-1076816797
                  // @ts-expect-error default does exists
                  remarkFrontmatter.default,
                  // @ts-expect-error default does exists
                  remarkMdxFrontmatter.default,
                  [remarkCodeHike, chConfig],
                ],
                recmaPlugins: [[recmaCodeHike, chConfig]],
              },
            },
          ],
        },
      ],
    },
  };
};

Config.overrideWebpackConfig(enableMdx);
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
