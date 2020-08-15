import React from 'react';
import { useSelector } from "react-redux";
import { selectors } from "./selectors";
import ReactMarkdown from "react-markdown";

const Story = () => {
  const selectedObject = useSelector(selectors.selectSelectedObject);

  return (
    <div className="story">
      <ReactMarkdown source={selectedObject?.description || ''} />
    </div>
  );
};

export default Story;
