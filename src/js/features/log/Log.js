import React from 'react';

import './style.scss';

import { LogItem } from "./LogItem";

const Log = ({ messages }) => {
  return (
    <div className="page log">
      <h2>Log</h2>
      <ul className="log-list">
        {messages.map((log, index) => <LogItem log={log} key={index} />)}
      </ul>
    </div>
  );
};

export default Log;
