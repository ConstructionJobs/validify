//Test that components with the prop `name` get passed errors and values
import React from 'react';
import Form from '../src/form';
import { mount } from 'enzyme';

const Input = ({ error, ...props }) => (
  <div>
    {error ? <p className="error">{error}</p> : null}
    <input {...props} />
  </div>
);

test('Input is passed in value correctly', () => {
  const wrapper = mount(
    <Form>
      <Input name="Awesome" />
    </Form>
  );

  wrapper.find('input').simulate('change', {
    target: { name: 'Awesome', value: 'yes', checked: false },
  });

  expect(wrapper.find(Input).props().value).toEqual('yes');
});

test('Input gets error message', () => {
  const wrapper = mount(
    <Form rules={{ Awesome: 'required|min:8' }}>
      <Input name="Awesome" type="password" />
    </Form>
  );

  wrapper.find('input').simulate('change', {
    target: { name: 'Awesome', value: 'fail', type: 'passwor' },
  });
  wrapper.find('input').simulate('blur');

  expect(wrapper.find(Input).props().error).toEqual(
    'The Awesome must be at least 8 characters.'
  );
});

test('Input passes validation first time', () => {
  const wrapper = mount(
    <Form rules={{ Awesome: 'required|min:4' }}>
      <Input name="Awesome" />
    </Form>
  );

  wrapper
    .find('input')
    .simulate('change', { target: { name: 'Awesome', value: 'fail' } });
  wrapper.find(Input).simulate('blur');

  expect(wrapper.find(Input).props().error).toEqual('');
  expect(wrapper.find(Input).props().value).toEqual('fail');
});

test('Blur does nothing if no rule is set', () => {
  const wrapper = mount(
    <Form>
      <Input name="Awesome" />
    </Form>
  );

  wrapper
    .find('input')
    .simulate('change', { target: { name: 'Awesome', value: 'fail' } });
  wrapper.find(Input).simulate('blur');

  expect(wrapper.find(Input).props().error).toEqual('');
  expect(wrapper.find(Input).props().value).toEqual('fail');
});

test('Error message is cleared after success on second blur', async () => {
  const wrapper = mount(
    <Form rules={{ Awesome: 'required|min:8' }}>
      <Input name="Awesome" />
    </Form>
  );

  wrapper
    .find('input')
    .simulate('change', { target: { name: 'Awesome', value: 'fail' } });
  wrapper
    .find('input')
    .simulate('blur', { target: { name: 'Awesome', value: 'failfailss' } });

  wrapper
    .find('input')
    .simulate('change', { target: { name: 'Awesome', value: 'failfailss' } });

  wrapper
    .find('input')
    .simulate('blur', { target: { name: 'Awesome', value: 'failfailss' } });

  expect(wrapper.find(Input).props().error).toEqual('');
});

test('Error is removed onChange if set before blurred', () => {
  const wrapper = mount(
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
    .find('input')
    .simulate('change', { target: { name: 'Awesome', value: 'fail' } });

  wrapper
    .find('input')
    .simulate('blur', { target: { name: 'Awesome', value: 'fail' } });

  expect(wrapper.find(Input).props().error).toEqual('');
  expect(wrapper.find(Input).props().value).toEqual('fail');
});

test('Form validates with valid initial values passed and onValues prop passed', () => {
  const onValues = jest.fn();
  const wrapper = mount(
    <Form
      rules={{ Awesome: 'required' }}
      values={{ Awesome: 'hello' }}
      onValues={onValues}
    >
      <Input name="Awesome" />
      <div className="submit" submit onClick={values => onValues(values)} />
    </Form>
  );
  wrapper.find('.submit').simulate('click');
  expect(wrapper.find(Input).props().error).toEqual('');
  expect(onValues).toHaveBeenCalledTimes(1);
  expect(onValues.mock.calls[0][0].Awesome).toEqual('hello');
});

test('Input onChange is triggered when passing onChange as prop', () => {
  const onChange = jest.fn();
  const wrapper = mount(
    <Form rules={{ Awesome: 'required' }}>
      <Input name="Awesome" onChange={() => onChange()} />
      <div className="submit" submit />
    </Form>
  );

  wrapper
    .find('input')
    .simulate('change', { target: { name: 'Awesome', value: 'Hello World' } });

  expect(onChange).toHaveBeenCalledTimes(1)
})