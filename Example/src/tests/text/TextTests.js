// @flow
import * as React from "react";
import type { TestGroup } from "../../types";
import { TestText } from "./TestText";
import { Colors } from "../../components";

export const TextTests: TestGroup = {
  name: "Texts",
  tests: [
    {
      name: "Simple move",
      description:
        "The most basic form of a shared-element transition. The view should move smoothly without flickering from the start- to the end state, and back",
      start: <TestText />,
      end: <TestText end />
    },
    {
      name: "Move & scale",
      description:
        "Another basic form of a shared-element transition. The view should move & scale correctly without flickering from the start- to the end state, and back",
      start: <TestText size="small" />,
      end: <TestText end size="large" />
    },
    {
      name: "Color change",
      description: "TODO",
      start: <TestText position="left" size="large" />,
      end: <TestText position="right" size="large" color={Colors.yellow} />,
      animation: "fade"
    },
    {
      name: "Expand",
      description: "TODO",
      start: <TestText length="sentence" position="center" />,
      end: <TestText length="paragraph" position="center" />,
      animation: {
        animation: "fade",
        resize: "none",
        align: "center-top"
      }
    },
    {
      name: "Expand & Move",
      description: "TODO",
      start: <TestText length="sentence" />,
      end: <TestText end length="paragraph" />,
      animation: {
        animation: "fade",
        resize: "none",
        align: "center-top"
      }
    }
  ]
};
