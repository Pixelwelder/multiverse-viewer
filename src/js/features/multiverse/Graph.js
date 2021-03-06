import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import ReactGraph from 'react-graph-vis';

import { selectors as multiverseSelectors } from "./multiverseSlice2";
import { actions as uiActions } from "./uiSlice";

const Graph = () => {
  const dispatch = useDispatch();
  const graph = useSelector(multiverseSelectors.selectAsGraph);

  return (
    <div className="graph">
      {!!graph.nodes.length && (
        <ReactGraph
          graph={graph}
          options={{
            edges: {
              color: '#000000'
            },
            height: '500px'
          }}
          events={{
            select: (event) => {
              const [nodeName] = event.nodes;
              dispatch(uiActions.setSelectedNode(nodeName));
            }
          }}
        />
      )}
    </div>
  );
};

export default Graph;
