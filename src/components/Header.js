/**
 * Stateless component
 *
 * Stateless components don't need to extend React.Component
 * Simply define a function and pass it props as argument and export it.
 */
import React from 'react';

const Header = (props) => {
  return (
    <header className="top">
      <h1>
        Catch
        <span className="ofThe">
          <span className="of">of</span>
          <span className="the">the</span>
        </span>
        Day
      </h1>
      <h3 className="tagline"><span>{props.tagline}</span></h3>
    </header>
  )
};

Header.propTypes = {
  tagline: React.PropTypes.string.isRequired
};

export default Header;