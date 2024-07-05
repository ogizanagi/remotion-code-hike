import { AbsoluteFill, Img, Series, staticFile, useVideoConfig } from "remotion";
import { ProgressBar } from "./ProgressBar";
import { CodeTransition } from "./CodeTransition";
import { HighlightedCode } from "codehike/code";
import { getStepDuration } from './utils/steps';
import { Schema } from './calculate-metadata';
import { useEffect } from 'react';

type Props = Readonly<{
  steps?: Schema['steps'];
  evenSteps?: boolean;
  stepDuration?: number
  transitionDuration?: number
}>

export const Main = ({
  steps = [],
  evenSteps = true,
  stepDuration: defaultStepDuration,
  transitionDuration
}: Props) => {
  const videoConfig = useVideoConfig();

  useEffect(() => {
    console.info(videoConfig);
  }, [videoConfig]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D1117" }}>
      <ProgressBar steps={steps} evenSteps={evenSteps} />
      <AbsoluteFill>
        <Series>
          {steps.map((step, index) => {
            const stepDuration = getStepDuration(step, defaultStepDuration);

            // Image as a cover
            if (step.cover) {
              return (
                <Series.Sequence
                  key={index}
                  layout="none"
                  durationInFrames={stepDuration}
                  name={step.title}
                >
                  <Img src={staticFile(step.cover.url.replace('../../public/', '/'))} />
                </Series.Sequence>
              )
            }

            // Highlighted code
            if (step.code?.code) {
              const previousStep = steps[index - 1];
              let oldCode: HighlightedCode | null = null;

              if (previousStep?.code) {
                oldCode = previousStep.code as HighlightedCode;
              }

              return (
                <Series.Sequence
                  key={index}
                  layout="none"
                  durationInFrames={stepDuration}
                  name={step.code.meta}

                >
                  <AbsoluteFill key={index} style={{ padding: "84px 48px" }}>
                    <CodeTransition
                      // Do not interpolate if the previous step is not the same scene
                      oldCode={oldCode && oldCode.meta === step.code.meta ? oldCode : null}
                      newCode={step.code as HighlightedCode}
                      durationInFrames={transitionDuration}
                    />
                  </AbsoluteFill>
                </Series.Sequence>
              );
            }

            // Raw content (MDX)
            return <Series.Sequence
              key={index}
              layout="none"
              durationInFrames={stepDuration}
              name={step.title}
            >
              <AbsoluteFill key={index} style={{ padding: "84px 48px" }}>
                {step.children}
              </AbsoluteFill>
            </Series.Sequence>;
          })}
        </Series>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
