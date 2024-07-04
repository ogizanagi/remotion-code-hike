import { AbsoluteFill, Series, useVideoConfig, Img, staticFile } from "remotion";
import { ProgressBar } from "./ProgressBar";
import { CodeTransition } from "./CodeTransition";
import { HighlightedCode } from "codehike/code";
import { getStepDuration } from './utils/steps';
import { Step } from './types/steps';

type Props = Readonly<{
  steps: Step[];
}>

const DEFAULT_TRANSITION_DURATION = 30;

export const Main = (props: Props) => {
  console.log(useVideoConfig());
  const { steps } = props;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D1117" }}>
      <ProgressBar steps={steps} />
      <AbsoluteFill>
        <Series>
          {steps.map((step, index) => {
            const stepDuration = getStepDuration(step);

            if (typeof step === 'string') {
              return (
                <Series.Sequence
                  key={index}
                  layout="none"
                  durationInFrames={stepDuration}
                  name={step}
                >
                  <Img src={staticFile(step)} />
                </Series.Sequence>
              )
            }

            const previousStep = steps[index - 1];
            let oldCode: HighlightedCode | null = null;

            if (previousStep?.code !== undefined) {
              oldCode = previousStep as HighlightedCode;
            }

            return (
              <Series.Sequence
                key={index}
                layout="none"
                durationInFrames={stepDuration}
                name={step.meta}

              >
                <AbsoluteFill key={index} style={{ padding: "84px 48px" }}>
                  <CodeTransition
                    // Do not interpolate if the previous step is not the same scene
                    oldCode={oldCode && oldCode.meta === step.meta ? oldCode : null}
                    newCode={step}
                    durationInFrames={DEFAULT_TRANSITION_DURATION}
                  />
                </AbsoluteFill>
              </Series.Sequence>
            );
          })}
        </Series>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
