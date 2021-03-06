import * as React from 'react'
import { createStore } from 'redux'

import formReducer, { FormState } from './formReducer'
import formEnhancer, { FormStore } from './formEnhancer'

export interface FormProps {
  form: FormStore
}

export default function withForm<P>(
  initialState?: FormState | ((props: P) => FormState),
  reducer = formReducer,
  enhancer = formEnhancer()
) {
  return function createComponent(
    BaseComponent: React.ComponentClass<P & FormProps> | React.StatelessComponent<P & FormProps>
  ): React.ComponentClass<P> {
    class WrappedComponent extends React.PureComponent<P, {}> {
      public static displayName = `withForm(${BaseComponent.displayName || 'Component'})`

      private form: FormStore

      public render() {
        return <BaseComponent {...this.props} form={this.form} />
      }

      private componentWillMount() {
        const state = typeof initialState === 'function'
          ? initialState(this.props)
          : initialState

        this.form = createStore(reducer, state, enhancer) as FormStore
      }

      private componentWillUnmount() {
        this.form.unsubscribe()
        this.form = null
      }
    }

    return WrappedComponent
  }
}
