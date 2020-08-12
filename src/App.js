import React, { useEffect } from 'react';

import './app.scss';
import Log from "./features/log/Log";
import { selectors as logSelectors } from "./features/log/logSlice";
import { actions as startupActions } from "./app/startupSlice";
import { useDispatch, useSelector } from "react-redux";
import Multiverse from "./features/multiverse/Multiverse";

function App() {
  const { messages } = useSelector(logSelectors.select);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startupActions.init());
  }, []);

  return (
    <div className="app">
      <h1>Multiverse</h1>
      <div className="app-container">
        <Multiverse />
        <Log messages={messages} />
      </div>
    </div>
  );
}

export default App;
