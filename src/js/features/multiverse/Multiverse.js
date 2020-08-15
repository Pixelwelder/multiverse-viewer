import React from 'react';
import { Tabs, Tab } from "react-bootstrap";

import './style.scss';

import Graph from "./Graph";
import { selectors as multiverseSelectors } from "./multiverseSlice2";
import { useSelector } from "react-redux";
import Story from "./Story";

const Multiverse = () => {
  const meta = useSelector(multiverseSelectors.selectMeta);
  return (
    <div className="page multiverse">
      <h2>{ meta.name }</h2>
      <Tabs defaultActiveKey="story" id="multiverse-main" mountOnEnter>
        <Tab eventKey="story" title="Story">
          <Story />
        </Tab>
        <Tab eventKey="graph" title="Graph">
          <Graph />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Multiverse;
