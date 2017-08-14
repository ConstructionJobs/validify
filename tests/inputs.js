//Test that components with the prop `name` get passed errors and values
import React from 'react';
import { spy } from 'sinon';
import Form from '../src/form';
import { shallow } from 'enzyme';

const Input = ({ error, ...props }) =>
  error ? <p className="error">{error}</p> : <input {...props} />;

test('Input is passed in value correctly', () => {
  const wrapper = shallow(
    <Form>
      <Input name="Awesome" />
    </Form>
  );

  wrapper
    .find(Input)
    .simulate('change', { target: { name: 'Awesome', value: 'yes' } });

  expect(wrapper.find(Input).props().value).toEqual('yes');
});

test('Input gets error message', () => {
  const wrapper = shallow(
    <Form rules={{ Awesome: 'required|min:8' }}>
      <Input name="Awesome" />
    </Form>
  );

  wrapper
    .find(Input)
    .simulate('change', { target: { name: 'Awesome', value: 'fail' } });
  wrapper.find(Input).simulate('blur');

  expect(wrapper.find(Input).props().error).toEqual(
    'The Awesome must be at least 8 characters.'
  );
});

test('Input passes validation first time', () => {
  const wrapper = shallow(
    <Form rules={{ Awesome: 'required|min:4' }}>
      <Input name="Awesome" />
    </Form>
  );

  wrapper
    .find(Input)
    .simulate('change', { target: { name: 'Awesome', value: 'fail' } });
  wrapper.find(Input).simulate('blur');

  expect(wrapper.find(Input).props().error).toEqual('');
  expect(wrapper.find(Input).props().value).toEqual('fail');
});

test('Blur does nothing if no rule is set', () => {
  const wrapper = shallow(
    <Form>
      <Input name="Awesome" />
    </Form>
  );

  wrapper
    .find(Input)
    .simulate('change', { target: { name: 'Awesome', value: 'fail' } });
  wrapper.find(Input).simulate('blur');

  expect(wrapper.find(Input).props().error).toEqual('');
  expect(wrapper.find(Input).props().value).toEqual('fail');
});

test('Error message is cleared after success on second blur', () => {
  const wrapper = shallow(
    <Form rules={{ Awesome: 'required|min:8' }}>
      <Input name="Awesome" />
    </Form>
  );

  wrapper
    .find(Input)
    .simulate('change', { target: { name: 'Awesome', value: 'fail' } });
  wrapper.find(Input).simulate('blur');

  wrapper
    .find(Input)
    .simulate('change', { target: { name: 'Awesome', value: 'failfail' } });
  wrapper.find(Input).simulate('blur');

  expect(wrapper.find(Input).props().error).toEqual('');
});

test('Error is removed onChange if set before blurred', () => {
  const wrapper = shallow(
    <Form rules={{ Awesome: 'required' }}>
      <Input name="Awesome" />
      <div className="submit" submit />
    </Form>
  );
  wrapper.find('.submit').simulate('click');
  expect(wrapper.find(Input).props().error).toEqual(
    'The Awesome field is required.'
  );

  wrapper
    .find(Input)
    .simulate('change', { target: { name: 'Awesome', value: 'fail' } });

  expect(wrapper.find(Input).props().error).toEqual('');
  expect(wrapper.find(Input).props().value).toEqual('fail');
});

test('Form doesnt run validate with no rules', () => {
  const spy = jest.spyOn(Form.prototype, 'validate');
  const wrapper = shallow(
    <Form values={{ Awesome: 'hello' }}>
      <Input name="Awesome" />
      <div className="submit" submit />
    </Form>
  );
  wrapper.find('.submit').simulate('click');
  expect(wrapper.find(Input).props().error).toEqual('');
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy.mock.calls[0][0]).toEqual(undefined);
  spy.mockClear();
});

test('Form validates with valid initial values passed', () => {
  const spy = jest.spyOn(Form.prototype, 'validate');
  const wrapper = shallow(
    <Form rules={{ Awesome: 'required' }} values={{ Awesome: 'hello' }}>
      <Input name="Awesome" />
      <div className="submit" submit />
    </Form>
  );
  wrapper.find('.submit').simulate('click');
  expect(wrapper.find(Input).props().error).toEqual('');
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy.mock.calls[0][0]).toEqual(undefined);
  spy.mockClear();
});

  );
  wrapper.find('.submit').simulate('click');
  expect(wrapper.find(Input).props().error).toEqual('');
});
