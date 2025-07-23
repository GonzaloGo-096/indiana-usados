import React from 'react';
import styles from '../filters/FilterForm/FilterForm.module.css';

const DropdownMultiCheckbox = ({
  label,
  placeholder = '--Seleccione--',
  options,
  isOpen,
  setIsOpen,
  refDropdown,
  seleccionados,
  handleChange
}) => (
  <div className={styles.formGroup} ref={refDropdown}>
    <label className={styles.label}>{label}</label>
    <div className={styles.dropdownMulti}>
      <div
        className={styles.dropdownMultiInput}
        tabIndex={0}
        onClick={() => setIsOpen(open => !open)}
      >
        <span>{placeholder}</span>
        <span className={styles.dropdownArrow}>&#9660;</span>
      </div>
      {isOpen && (
        <div className={styles.dropdownList}>
          {options.map(option => (
            <div key={option} className={styles.dropdownOption}>
              <input
                type="checkbox"
                className={styles.dropdownCheckbox}
                checked={seleccionados.includes(option)}
                onChange={() => handleChange(option)}
                id={`${label}-${option}`}
              />
              <label htmlFor={`${label}-${option}`}>{option}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default DropdownMultiCheckbox; 