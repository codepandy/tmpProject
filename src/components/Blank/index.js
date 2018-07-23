import PropTypes from 'prop-types';
import React from 'react';
import styles from './index.less';

class Blank extends React.Component {
  render() {
    const { msg, wrapStyle } = this.props;
    return (
      <div style={wrapStyle} className={styles.blank_box}>
        <i className={styles.sadness} />
        <br />
        {msg}
      </div>
    );
  }
}

Blank.propTypes = {
  msg: PropTypes.string,
  wrapStyle: PropTypes.object,
};

Blank.defaultProps = {
  msg: '信息拉取失败',
  wrapStyle: {
    padding: '100px 0',
    textAlign: 'center',
  },
};

export default Blank;
