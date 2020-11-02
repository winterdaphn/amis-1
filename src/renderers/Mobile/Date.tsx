import React from 'react';
import moment from 'moment';
import { FormItem } from '../Form/Item';
import DateControl from '../Form/Date';
import DatePicker from 'antd-mobile/lib/date-picker';
import { Icon } from '../../components/icons';

function normalizeValue(value: any, format?: string) {
  if (!value || value === '0') {
    return undefined;
  }
  const v = moment(value, format, true);
  return v.isValid() ? v : undefined;
}

export default class MobileDateControl extends DateControl {
  static defaultProps = {
    ...DateControl.defaultProps,
    mode: 'datetime'
  };

  clearValue(e: React.MouseEvent<any>) {
    e.preventDefault();
    e.stopPropagation();
    const onChange = this.props.onChange;
    onChange('');
  }

  handleChange(value: Date) {
    const {
      onChange,
      format,
      minTime,
      maxTime,
      utc
    } = this.props;

    if (!moment.isDate(value)) {
      return;
    }

    let date: moment.Moment = moment(value);
    if (minTime && date && date.isBefore(minTime, 'second')) {
      date = minTime;
    } else if (maxTime && date && date.isAfter(maxTime, 'second')) {
      date = maxTime;
    }

    onChange(utc ? moment.utc(date).format(format) : date.format(format));
  }

  render() {
    const {
      format,
      className,
      classnames: cx,
      value,
      mode,
      placeholder,
      inputFormat,
      classPrefix: ns,
      clearable,
      disabled
    } = this.props;
    let date = value;
    let formatValue = '';

    if (date) {
      let m = moment(date, format);
      date = new Date(m.valueOf());
      formatValue = m.format(inputFormat);
    }

    return (
      <div className={cx(`DateControl`, className)}>
        <DatePicker mode={mode} value={date} extra={placeholder} format={inputFormat} onOk={this.handleChange.bind(this)}>
          <div className={`${ns}DatePicker`}>
            <span className={`${ns}DatePicker-placeholder`}>{date ? formatValue : placeholder}</span>
            {clearable && !disabled && normalizeValue(value, format) ? (
              <a className={`${ns}DatePicker-clear`} onClick={this.clearValue.bind(this)}>
                <Icon icon="close" className="icon" />
              </a>
            ) : null}
            <Icon icon="calendar" className="icon" />
          </div>
        </DatePicker>
      </div>
    );
  }
}

@FormItem({
  type: 'mobile-date',
  weight: -150
})
export class MobileDateControlRenderer extends MobileDateControl {
  static defaultProps = {
    ...MobileDateControl.defaultProps,
    mode: 'date',
    placeholder: '请选择日期',
    strictMode: false
  };
}

@FormItem({
  type: 'mobile-datetime'
})
export class MobileDatetimeControlRenderer extends MobileDateControl {
  static defaultProps = {
    ...MobileDateControl.defaultProps,
    inputFormat: 'YYYY-MM-DD HH:mm',
    placeholder: '请选择日期以及时间',
    strictMode: false
  };
}

@FormItem({
  type: 'mobile-time'
})
export class MobileTimeControlRenderer extends MobileDateControl {
  static defaultProps = {
    ...MobileDateControl.defaultProps,
    placeholder: '请选择时间',
    inputFormat: 'HH:mm',
    mode: 'time',
    strictMode: false
  };
}