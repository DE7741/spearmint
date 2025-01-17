import React from 'react';
import styles from './AccTestTypes.module.scss';

/**
 * Renders the dropdown menu to 'Choose Type of Accessibility Test' inside the Accessibility TestType.
 * @returns { JSX.Element } Returns the AccTestTypes react component
 */
const AccTestTypes = () => {

  return (
    <div id={styles.AccTestTypesComponent}>
      <label id={styles.AccTestTypesLabel} htmlFor='accTestTypes'>
        Choose Type of Accessibility Test
      </label>
      <select 
        id='accTestTypes' 
        className={styles.AccTestTypesInput} 
        defaultValue='select'
      >
        <option value='select'>Please select an option</option>
        <option value='html'>HTML</option>
        <option value='react'>React</option>
        <option value='puppeteer'>Puppeteer</option>
      </select>
    </div>
  );
};

export default AccTestTypes;
