import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Router } from 'react-router';
import { Provider } from '../../context';
import { fireEvent, render, waitForElement } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { request } from '../../service';
import faker from 'faker';
import Register from './index';

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(() => null),
      setItem: jest.fn(() => null),
    },
    writable: true,
  });
});

describe('Register', () => {
  it('Email Format', () => {
    const { getByTestId } = render(
      <Provider>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.change(getByTestId('EmailRegisterInput'), {
      target: { value: 'WrongEmailFormat.com' },
    });

    expect(getByTestId('EmailRegisterInputFeedback').style.display).toBe('block');

    fireEvent.change(getByTestId('EmailRegisterInput'), {
      target: { value: 'correct@email.com' },
    });

    expect(getByTestId('EmailRegisterInputFeedback').style.display).toBe('none');
  });

  it('Nickname Format', () => {
    const { getByTestId } = render(
      <Provider>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.change(getByTestId('NicknameRegisterInput'), {
      target: { value: '@wrong' },
    });

    expect(getByTestId('NicknameRegisterInputFeedback').style.display).toBe('block');

    fireEvent.change(getByTestId('NicknameRegisterInput'), {
      target: { value: 'bolivar' },
    });

    expect(getByTestId('NicknameRegisterInputFeedback').style.display).toBe('none');
  });

  it('Password Format', () => {
    const { getByTestId } = render(
      <Provider>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.change(getByTestId('PasswordRegisterInput'), {
      target: { value: '@wrong' },
    });

    expect(getByTestId('PasswordRegisterInputFeedback').style.display).toBe('block');

    fireEvent.change(getByTestId('PasswordRegisterInput'), {
      target: { value: '123456' },
    });

    expect(getByTestId('PasswordRegisterInputFeedback').style.display).toBe('none');
  });

  describe('Register Button', () => {
    it('Disabled - Field Formart', () => {
      const { getByTestId } = render(
        <Provider>
          <MemoryRouter>
            <Register />
          </MemoryRouter>
        </Provider>,
      );

      expect(getByTestId('RegisterButton').disabled).toBeTruthy();

      fireEvent.change(getByTestId('EmailRegisterInput'), {
        target: { value: 'correct@email.com' },
      });

      fireEvent.change(getByTestId('NicknameRegisterInput'), {
        target: { value: 'bolivar' },
      });

      fireEvent.change(getByTestId('PasswordRegisterInput'), {
        target: { value: '123456' },
      });

      expect(getByTestId('RegisterButton').disabled).toBeFalsy();
    });

    it('On success', async () => {
      const history = createMemoryHistory();

      const { getByTestId } = render(
        <Provider>
          <Router history={history}>
            <Register />
          </Router>
        </Provider>,
      );

      const mockData = {
        token: faker.random.number(),
        ...faker.random.objectElement(),
      };

      jest.spyOn(request, 'postData').mockResolvedValue({ data: mockData, error: null });

      jest.spyOn(request, 'patchData').mockResolvedValue({ error: null });

      fireEvent.change(getByTestId('EmailRegisterInput'), {
        target: { value: 'correct@email.com' },
      });

      fireEvent.change(getByTestId('NicknameRegisterInput'), {
        target: { value: 'bolivar' },
      });

      fireEvent.change(getByTestId('PasswordRegisterInput'), {
        target: { value: '123456' },
      });

      fireEvent.click(getByTestId('RegisterButton'));

      await waitForElement(() => getByTestId('RegisterButton'));

      expect(window.localStorage.setItem).toHaveBeenCalledWith('token', mockData.token);

      expect(history.location.pathname).toBe('/chat/bolichat');
    });

    it('On failure - error post data', async () => {
      const { getByTestId } = render(
        <Provider>
          <MemoryRouter>
            <Register />
          </MemoryRouter>
        </Provider>,
      );

      const mockError = {
        error: {
          message: faker.random.words(),
        },
      };

      jest.spyOn(request, 'postData').mockResolvedValue({ data: null, error: mockError.error });

      fireEvent.change(getByTestId('EmailRegisterInput'), {
        target: { value: 'correct@email.com' },
      });

      fireEvent.change(getByTestId('NicknameRegisterInput'), {
        target: { value: 'bolivar' },
      });

      fireEvent.change(getByTestId('PasswordRegisterInput'), {
        target: { value: '123456' },
      });

      fireEvent.click(getByTestId('RegisterButton'));

      await waitForElement(() => getByTestId('RegisterButton'));

      expect(getByTestId('MessageBox').style.display).toBe('flex');

      expect(getByTestId('MessageText').innerHTML).toBe(mockError.error.message);
    });

    it('On failure - error patch data', async () => {
      const history = createMemoryHistory();

      const { getByTestId } = render(
        <Provider>
          <Router history={history}>
            <Register />
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

      fireEvent.change(getByTestId('EmailRegisterInput'), {
        target: { value: 'correct@email.com' },
      });

      fireEvent.change(getByTestId('NicknameRegisterInput'), {
        target: { value: 'bolivar' },
      });

      fireEvent.change(getByTestId('PasswordRegisterInput'), {
        target: { value: '123456' },
      });

      fireEvent.click(getByTestId('RegisterButton'));

      await waitForElement(() => getByTestId('RegisterButton'));

      expect(getByTestId('MessageBox').style.display).toBe('flex');

      expect(getByTestId('MessageText').innerHTML).toBe(mockError.error.message);

      expect(history.location.pathname).toBe('/');
    });
  });
});
