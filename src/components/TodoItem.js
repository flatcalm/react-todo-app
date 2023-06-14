import React from 'react'
import { MdDelete, MdDone } from 'react-icons/md';
import cn from 'classnames';

import './scss/TodoInput.scss'

import './scss/TodoItem.scss'
import classNames from 'classnames';

const TodoItem = ({ item }) => {

  const {id, title, done} = item;

  return (
    <li className='todo-list-item'>
        <div className={cn('check-circle', {active: done})}>
            {done && <MdDone />}
        </div>
        <span className={cn('text', {finish: done})}>{title}</span>
        <div className='remove'>
          <MdDelete />
        </div>
    </li>
  )
}

export default TodoItem;