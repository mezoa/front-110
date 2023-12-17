import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { useExpenseStore } from './components/modules/expense/expenseStore';
import App from './App';

let root = null;

function Root() {
  const store = useExpenseStore();

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

const container = document.getElementById('root');

if (container._reactRootContainer) {
  root = container._reactRootContainer;
  root.render(<Root />);
} else {
  root = createRoot(container);
  root.render(<Root />);
}