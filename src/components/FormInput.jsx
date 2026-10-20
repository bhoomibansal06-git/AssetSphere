import React from 'react';
export default function FormInput({ id, name = id, label, type = 'text', ...props }) {
  return <div className="field">
    <label htmlFor={id}>{label}</label>
    <input id={id} name={name} type={type} {...props} />
  </div>;
}
