import { useCurrentFrame } from "remotion";
import { getStepDuration } from './utils/steps';
import { Step } from './types/steps';
import { useMemo } from 'react';

type Props = Readonly<{
  steps: Step[];
  /**
   * If true, the progress bar will have uneven steps widths, respecting their duration ratio.
   */
  unevenSteps?: boolean;
}>

export function ProgressBar({ steps, unevenSteps = true }: Props) {
  const frame = useCurrentFrame();

  // Computes the start and end frames of every step:
  const stepFrames = useMemo(() => steps.reduce<[number, number][]>((acc, step) => {
    const startFrame = acc.length === 0 ? 0 : acc[acc.length - 1][1];
    const stepDuration = getStepDuration(step);
    const endFrame = startFrame + stepDuration;

    return [...acc, [startFrame, endFrame]];
  }, []), [steps]);

  return (
    <div
      style={{
        position: "absolute",
        top: 48,
        left: 48,
        right: 48,
        height: 6,
        display: "flex",
        gap: 12,
        zIndex: 99,
      }}
    >
      {stepFrames.map(([start, end], index) => (
        <div
          key={index}
          style={{
            backgroundColor: "#333",
            borderRadius: 6,
            overflow: "hidden",
            height: "100%",
            flex: unevenSteps ? end - start : 1,
          }}
        >
          <div
            style={{
              height: "100%",
              backgroundColor: "white",
              width: computeWidth(frame, start, end),
            }}
          />
        </div>
      ))}
    </div>
  );
}

function computeWidth(frame: number, start: number, end: number) {
  const isPastStep = frame >= end;
  const isStartedStep = frame >= start;

  if (isPastStep) {
    return "100%";
  }

  if (!isStartedStep) {
    return "0%";
  }

  const stepDuration = end - start;
  const currentStepProgress = (frame - start) * 100 / stepDuration;

  return currentStepProgress + "%";
}
