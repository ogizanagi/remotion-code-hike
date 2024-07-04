import { Config, WebpackOverrideFn } from "@remotion/cli/config";

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
              options: {
                remarkPlugins: [[remarkCodeHike, chConfig]],
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
