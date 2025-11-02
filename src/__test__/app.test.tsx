import App from '@src/app.tsx';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

test('renders learn react link', () => {
  const result = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  const app = result.baseElement.querySelector('#app');

  expect(document.title).toBe('vite react front temp');

  app && expect(app).toBeInTheDocument();
});
