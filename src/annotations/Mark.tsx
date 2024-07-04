import { AnnotationHandler } from "codehike/code"

export const mark: AnnotationHandler = {
  name: "mark",
  AnnotatedLine: ({ InnerLine, ...props }) => (
    <InnerLine merge={props} className="markedLine" />
  ),
  Block: ({ children}) => (
    <div className="markedBlock">{children}</div>
  ),
}
