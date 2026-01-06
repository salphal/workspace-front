import App from '@src/app.tsx';
import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';

describe('App component', () => {
  it('renders #root element in the DOM', async () => {
    const result = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    const rootElement = result.baseElement.querySelector('#root');
    expect(rootElement).toBeInTheDocument();
  });
});
