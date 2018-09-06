// @flow
// TODO:
// 1. localStorage
// 2. todo editing
/* global Document, Element */
import { skipRepeats, map, merge, scan, tap, runEffects } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { hashchange } from '@most/dom-event'

import { emptyApp } from './model'
import { View } from './view.jsx'
import { handleFilterChange, runAction } from './action'
import { createEventAdapter } from './eventAdapter'
import * as ReactDOM from 'react-dom'

const fail = (s: string): empty => { throw new Error(s) }
const qs = (s: string, el: Document): Element =>
  el.querySelector(s) || fail(`${s} not found`)

const appNode = qs('.todoapp', document)
const appState = emptyApp
const scheduler = newDefaultScheduler()

const [addAction, todoActions] = createEventAdapter(scheduler)

// 监听 URL的变化，触发url对应的事件
const updateFilter = map(handleFilterChange, hashchange(window))

const actions = merge(todoActions, updateFilter)

const stateUpdates = skipRepeats(scan(runAction, appState, actions))
const viewUpdates = tap(rel => ReactDOM.render(rel, appNode), map(View(addAction), stateUpdates))

runEffects(viewUpdates, scheduler)
