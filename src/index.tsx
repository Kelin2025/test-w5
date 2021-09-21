import React from "react";
import { render } from "react-dom";
import { App } from "./App";

import "@/shared/ui/style.css";

type A = {
  a: string;
};

const renderTarget = document.getElementById("app");
render(<App />, renderTarget);
