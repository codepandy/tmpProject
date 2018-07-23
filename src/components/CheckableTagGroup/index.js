import React, { Fragment } from 'react';
import { Tag } from 'antd';

const { CheckableTag } = Tag;
export default class CheckableTagGroup extends React.Component {
  render() {
    const { list, checkedVal } = this.props;
    return (
      <Fragment>
        {list.map(item => {
          return (
            <CheckableTag
              key={item.value}
              checked={item.value === checkedVal}
              onChange={checked => {
                this.props.onChange(checked, item);
              }}
            >
              {item.text}
            </CheckableTag>
          );
        })}
      </Fragment>
    );
  }
}
