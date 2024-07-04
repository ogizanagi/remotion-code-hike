import { InlineAnnotation, AnnotationHandler } from "codehike/code";
import { interpolate, useCurrentFrame } from "remotion";

export const callout: AnnotationHandler = {
  name: "callout",
  transform: (annotation: InlineAnnotation) => {
    const { name, query, lineNumber, fromColumn, toColumn, data } = annotation;

    const { parsedQuery, parsedData } = parseQuery(query);

    return {
      name,
      query: parsedQuery,
      fromLineNumber: lineNumber,
      toLineNumber: lineNumber,
      data: {
        ...data,
        ...parsedData,
        column: (fromColumn + toColumn) / 2,
      },
    };
  },
  AnnotatedLine: ({ InnerLine, annotation, indentation, ...props }) => {
    const { column } = annotation.data;
    const frame = useCurrentFrame();
    const inputRangeStart = annotation.data.start ?? 10;
    const inputRangeEnd = annotation.data.end ?? inputRangeStart + 10;
    let opacity = 1;

    if (inputRangeStart !== inputRangeEnd) {
      opacity = interpolate(frame, [inputRangeStart, inputRangeEnd], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }

    return (
      <>
        <InnerLine {...props} />
        <div
          style={{
            opacity,
            minWidth: `${column + 4}ch`,
            marginLeft: `${indentation}ch`,
            width: "fit-content",
            border: "1px solid #666",
            backgroundColor: "#171717",
            borderRadius: "10px",
            padding: "1rem",
            position: "relative",
            marginTop: "0.25rem",
            whiteSpace: "pre-wrap",
            color: "#bababa",
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              left: `${column - indentation - 0.5}ch`,
              position: "absolute",
              borderLeft: "2px solid #666",
              borderTop: "2px solid #666",
              width: "1rem",
              height: "1rem",
              transform: "rotate(45deg) translateY(-50%)",
              top: "-3px",
              backgroundColor: "#171717",
            }}
          />
          {annotation.data.children || annotation.query}
        </div>
      </>
    );
  },
};

function parseQuery(query: string) {
  try {
    const { message, ...rest } = JSON.parse(query);

    return { parsedQuery: message, parsedData: rest }
  } catch (e) {
    return { parsedQuery: query, parsedData: {} }
  }
}
