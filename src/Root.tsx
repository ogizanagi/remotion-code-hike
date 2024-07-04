import { Composition } from "remotion";
import { Main } from "./Main";
import Content from "./content/content.mdx";
import { calculateMetadata } from "./calculate-metadata";

const metadata = calculateMetadata(Content);

const [width, height] = [2096, 1180];

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="Content"
        component={Main}
        defaultProps={{ steps: [] }}
        fps={30}
        width={width}
        height={height}
        calculateMetadata={metadata}
      />
    </>
  );
};
