import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import './app.scss';

import { actions as startupActions } from "./startupSlice";
import Multiverse from "../features/multiverse/Multiverse";
import MetaBar from "../features/multiverse/MetaBar";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startupActions.startup());
  }, [dispatch]);

  return (
    <div className="app">
      <h1>Multiverse Prime</h1>
      <div className="app-container">
        <Multiverse />
        <MetaBar />
      </div>
    </div>
  );
}

export default App;
