import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import ReactGraph from 'react-graph-vis';

import { selectors as multiverseSelectors } from "./multiverseSlice";
import { actions as uiActions } from "./uiSlice";

const Graph = () => {
  const dispatch = useDispatch();
  const graph = useSelector(multiverseSelectors.selectAsGraph);
  const { nodesMap } = graph;

  return (
    <div className="graph">
      <h3>Graph</h3>
      {!!graph.nodes.length && (
        <ReactGraph
          graph={graph}
          options={{
            edges: {
              color: '#000000'
            },
            height: '500px',
            nodes: {

            }
          }}
          events={{
            select: (event) => {
              const [nodeName] = event.nodes;
              const { [nodeName]: node } = nodesMap;
              dispatch(uiActions.setSelectedNode(node));
            }
          }}
        />
      )}
    </div>
  );
};

export default Graph;
