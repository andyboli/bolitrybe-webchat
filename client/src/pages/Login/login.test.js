import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Router } from 'react-router';
import { Provider } from '../../context';
import { fireEvent, render, waitForElement } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { request } from '../../service';
import faker from 'faker';
import Login from './index';

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(() => null),
      setItem: jest.fn(() => null),
    },
    writable: true,
  });
});

describe('Login', () => {
  test('Email Format', () => {
    const { getByTestId } = render(
      <Provider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.change(getByTestId('EmailLoginInput'), {
      target: { value: 'WrongEmailFormat.com' },
    });

    expect(getByTestId('EmailLoginInputFeedback').style.display).toBe('block');

    fireEvent.change(getByTestId('EmailLoginInput'), {
      target: { value: 'correct@email.com' },
    });

    expect(getByTestId('EmailLoginInputFeedback').style.display).toBe('none');
  });

  test('Password Format', () => {
    const { getByTestId } = render(
      <Provider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.change(getByTestId('PasswordLoginInput'), {
      target: { value: 'WrongPassword' },
    });

    expect(getByTestId('PasswordLoginInputFeedback').style.display).toBe('block');

    fireEvent.change(getByTestId('PasswordLoginInput'), {
      target: { value: '123456' },
    });

    expect(getByTestId('PasswordLoginInputFeedback').style.display).toBe('none');
  });

  describe('Submit Button', () => {
    test('Disabled - Field Format', () => {
      const { getByTestId } = render(
        <Provider>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </Provider>,
      );

      expect(getByTestId('LoginButton').disabled).toBeTruthy();

      fireEvent.change(getByTestId('EmailLoginInput'), {
        target: { value: 'WrongEmailFormat.com' },
      });

      fireEvent.change(getByTestId('PasswordLoginInput'), {
        target: { value: 'WrongPassword' },
      });

      expect(getByTestId('LoginButton').disabled).toBeTruthy();

      fireEvent.change(getByTestId('EmailLoginInput'), {
        target: { value: 'correct@email.com' },
      });

      fireEvent.change(getByTestId('PasswordLoginInput'), {
        target: { value: 'WrongPassword' },
      });

      expect(getByTestId('LoginButton').disabled).toBeTruthy();

      fireEvent.change(getByTestId('EmailLoginInput'), {
        target: { value: 'WrongEmailFormat.com' },
      });

      fireEvent.change(getByTestId('PasswordLoginInput'), {
        target: { value: '123456' },
      });

      expect(getByTestId('LoginButton').disabled).toBeTruthy();

      fireEvent.change(getByTestId('EmailLoginInput'), {
        target: { value: 'correct@email.com.com' },
      });

      fireEvent.change(getByTestId('PasswordLoginInput'), {
        target: { value: '123456' },
      });

      expect(getByTestId('LoginButton').disabled).toBeFalsy();
    });

    it('On success', async () => {
      const history = createMemoryHistory();

      const { getByTestId } = render(
        <Provider>
          <Router history={history}>
            <Login />
          </Router>
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

      expect(window.localStorage.setItem).toHaveBeenCalledWith('token', mockData.token);

      expect(history.location.pathname).toBe('/chat/bolichat');
    });

    it('On failure - error post data', async () => {
      const { getByTestId } = render(
        <Provider>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </Provider>,
      );

      const mockError = {
        error: {
          message: faker.random.words(),
        },
      };

      jest.spyOn(request, 'postData').mockResolvedValue({ data: null, error: mockError.error });

      fireEvent.change(getByTestId('EmailLoginInput'), {
        target: { value: 'correct@email.com' },
      });

      fireEvent.change(getByTestId('PasswordLoginInput'), {
        target: { value: '123456' },
      });

      fireEvent.click(getByTestId('LoginButton'));

      await waitForElement(() => getByTestId('LoginButton'));

      expect(getByTestId('MessageBox').style.display).toBe('flex');

      expect(getByTestId('MessageText').innerHTML).toBe(mockError.error.message);
    });

    it('On failure - error patch data', async () => {
      const history = createMemoryHistory();

      const { getByTestId } = render(
        <Provider>
          <Router history={history}>
            <Login />
          </Router>
        </Provider>,
      );

      const mockData = {
        token: faker.random.number(),
        user: faker.random.objectElement(),
      };

      const mockError = {
        error: {
          message: faker.random.words(),
        },
      };

      jest.spyOn(request, 'postData').mockResolvedValue({ data: mockData, error: null });

      jest.spyOn(request, 'patchData').mockResolvedValue({ error: mockError.error });

      fireEvent.change(getByTestId('EmailLoginInput'), {
        target: { value: 'correct@email.com' },
      });

      fireEvent.change(getByTestId('PasswordLoginInput'), {
        target: { value: '123456' },
      });

      fireEvent.click(getByTestId('LoginButton'));

      await waitForElement(() => getByTestId('LoginButton'));

      expect(getByTestId('MessageBox').style.display).toBe('flex');

      expect(getByTestId('MessageText').innerHTML).toBe(mockError.error.message);

      expect(history.location.pathname).toBe('/');
    });
  });

  it('Register Button', () => {
    const history = createMemoryHistory();

    const { getByTestId } = render(
      <Provider>
        <Router history={history}>
          <Login />
        </Router>
      </Provider>,
    );

    fireEvent.click(getByTestId('RegisterLoginButton'));

    expect(history.location.pathname).toBe('/register');
  });
});
