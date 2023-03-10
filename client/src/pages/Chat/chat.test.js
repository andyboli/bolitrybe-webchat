import React, { useContext } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Router } from 'react-router';
import { Provider, Context } from '../../context';
import { fireEvent, render, waitForElement } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { request } from '../../service';
import faker from 'faker';
import Chat from './index';
import Login from '../Login';

describe('Chat', () => {
  it('People Button', () => {
    const history = createMemoryHistory();

    const mockId = {
      params: { id: faker.random.number() },
    };

    const mockEvent = {
      on: jest.fn(),
    };

    const { getByTestId } = render(
      <Provider event={mockEvent}>
        <Router history={history}>
          <Chat match={mockId} />
        </Router>
      </Provider>,
    );

    fireEvent.click(getByTestId('PeopleChatButton'));

    expect(history.location.pathname).toBe('/people');
  });

  it('Direct Button', () => {
    const history = createMemoryHistory();

    const mockId = {
      params: { id: faker.random.number() },
    };

    const mockEvent = {
      on: jest.fn(),
    };

    const { getByTestId } = render(
      <Provider event={mockEvent}>
        <Router history={history}>
          <Chat match={mockId} />
        </Router>
      </Provider>,
    );

    fireEvent.click(getByTestId('DirectChatButton'));

    expect(history.location.pathname).toBe('/direct');
  });

  it('Logout Button', async () => {
    const { getByTestId, rerender } = render(
      <Provider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    const mockData = {
      token: faker.random.number(),
      ...faker.random.objectElement(),
    };

    jest.spyOn(request, 'postData').mockResolvedValue({ data: mockData, error: null });

    jest.spyOn(request, 'patchData').mockResolvedValue({ error: null });

    fireEvent.change(getByTestId('EmailLoginInput'), {
      target: { value: 'correct@email.com' },
    });

    fireEvent.change(getByTestId('PasswordLoginInput'), {
      target: { value: '123456' },
    });

    fireEvent.click(getByTestId('LoginButton'));

    await waitForElement(() => getByTestId('LoginButton'));

    const history = createMemoryHistory();

    const mockId = {
      params: { id: faker.random.number() },
    };

    const mockEvent = {
      on: jest.fn(),
    };

    rerender(
      <Provider event={mockEvent}>
        <Router history={history}>
          <Chat match={mockId} />
        </Router>
      </Provider>,
    );

    fireEvent.click(getByTestId('LogoutButton'));

    expect(history.location.pathname).toBe('/');
  });

  describe('Send a Message', () => {
    it('On success', async () => {
      const { getByTestId, rerender } = render(
        <Provider>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </Provider>,
      );

      const mockData = {
        token: faker.random.number(),
        ...faker.random.objectElement(),
      };

      jest.spyOn(request, 'postData').mockResolvedValueOnce({ data: mockData, error: null });

      jest.spyOn(request, 'patchData').mockResolvedValue({ error: null });

      fireEvent.change(getByTestId('EmailLoginInput'), {
        target: { value: 'correct@email.com' },
      });

      fireEvent.change(getByTestId('PasswordLoginInput'), {
        target: { value: '123456' },
      });

      fireEvent.click(getByTestId('LoginButton'));

      await waitForElement(() => getByTestId('LoginButton'));

      const mockId = {
        params: { id: faker.random.number() },
      };

      const mockEvent = {
        on: jest.fn(),
      };

      der(
        <Provider event={mockEvent}>
          <MemoryRouter>
            <Chat match={mockId} />
          </MemoryRouter>
        </Provider>,
      );

      jest.spyOn(request, 'postData').mockResolvedValueOnce({ error: null });

      jest.spyOn(request, 'postData').mockResolvedValueOnce({ error: null });

      fireEvent.change(getByTestId('MessageInput'), {
        target: { value: faker.random.words() },
      });

      fireEvent.click(getByTestId('MessageButton'));

      await waitForElement(() => getByTestId('MessageButton'));

      expect(request.patchData).toHaveBeenCalledTimes(1);
    });
    // it('On failure', () => {});
  });
});
