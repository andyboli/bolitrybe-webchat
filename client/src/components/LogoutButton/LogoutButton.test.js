import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Router } from 'react-router';
import { Provider } from '../../context';
import { fireEvent, render, waitForElement } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { request } from '../../service';
import faker from 'faker';
import Logout from './index';

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(() => null),
      setItem: jest.fn(() => null),
    },
    writable: true,
  });
});

describe('Logout', () => {
  test('On Success', async () => {
    const history = createMemoryHistory();

    const { getByTestId } = render(
      <Provider>
        <Router history={history}>
          <Logout />
        </Router>
      </Provider>,
    );

    jest.spyOn(request, 'patchData').mockResolvedValue({ error: null });

    fireEvent.click(getByTestId('LogoutButton'));

    await waitForElement(() => getByTestId('LogoutButton'));
  });
});
