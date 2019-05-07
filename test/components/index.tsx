import { createElement as h } from 'react';
import { Button, DatePicker } from 'antd';

// export default () => <Button>Button</Button>

const { MonthPicker, RangePicker, WeekPicker } = DatePicker

function onChange(date, dateString) {
    console.log(date, dateString)
}

export default () => <div>
    <DatePicker onChange={onChange} />
    <br />
    <MonthPicker onChange={onChange} placeholder="Select month" />
    <br />
    <RangePicker onChange={onChange} />
    <br />
    <WeekPicker onChange={onChange} placeholder="Select week 2" />
  </div>