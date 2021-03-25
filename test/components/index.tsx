import { createElement as h } from 'react';
import { Button, DatePicker } from 'antd';
import Left from './Left'
import Right from './Right'

// export default () => <Button>Button</Button>

const { MonthPicker, RangePicker, WeekPicker } = DatePicker

function onChange(date, dateString) {
    console.log(date, dateString)
}

export default () => <div>
    <div>
        <Left/>
        <Right/>
    </div>
    <DatePicker onChange={onChange} />
    <br />
    <MonthPicker onChange={onChange} placeholder="Select month" />
    <br />
    <RangePicker onChange={onChange} />
    <br />
    <WeekPicker onChange={onChange} placeholder="Select week 2" />
  </div>