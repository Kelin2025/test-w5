import React from "react";
import { render } from "react-dom";
import { App } from "./App";

// import "@/shared/ui/style.css";

const renderTarget = document.getElementById("app");
render(<App />, renderTarget);
