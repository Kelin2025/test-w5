import * as React from "react";

import { createStore } from "effector";
import { useStore } from "effector-react";

import style from "./a.module.scss";

const $st = createStore(1);

export const App = () => {
  const st = useStore($st);
  return <div className={style.a}>asdfasdfasdf</div>;
};
