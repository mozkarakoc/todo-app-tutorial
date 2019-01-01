import React from 'react';
import ReactDOM from 'react-dom';
import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';
import App from './App';
import TodoModel from './types/todoModel';

const model = new TodoModel('react-todos');

function render() {
  ReactDOM.render(<App model={model} />, document.getElementById('root'));
}

model.subscribe(render);
render();
