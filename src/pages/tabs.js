import React from 'react';
import Question from './question/Question';
import Opinion from './opinion/Opinion';
import Chat from './chat/Chat';
import Term from './term/Term';

const tabs = {
  question: <Question/>,
  opinion: <Opinion/>,
  chat: <Chat/>,
  term: <Term/>
};


export default tabs;
