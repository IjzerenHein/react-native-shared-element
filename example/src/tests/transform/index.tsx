import * as React from "react";

import { TestGroup } from "../../types";
import { TestImage } from "../image/TestImage";

export const TransformTests: TestGroup = {
  name: "Transform",
  tests: [
    {
      name: "Translate X",
      description: "X translation applied to start element",
      start: <TestImage style={{ transform: [{ translateX: 200 }] }} />,
      end: <TestImage />,
    },
    {
      name: "Translate Y",
      description: "Y translation applied to start element",
      start: <TestImage style={{ transform: [{ translateY: 50 }] }} />,
      end: <TestImage />,
    },
  ],
};
