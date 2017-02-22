import { isArray, isObject } from 'lodash'

export default (http, store, router) => {
  // https://github.com/mzabriskie/axios#interceptors
  http.interceptors.response.use(
    response => response,
    /**
    * This is a central point to handle all
    * error messages generated by HTTP
    * requests
    */
    (error) => {
      const { response } = error
      /**
      * If token is either expired, not provided or invalid
      * then redirect to login. On server side the error
      * messages can be changed on app/Providers/EventServiceProvider.php
      */
      if ([401].indexOf(response.status) >= 0 && !store.isAuthPage) {
        if (document.querySelector('#login-modal')) {
          $('#login-modal').modal('show')
        }
      }

      /**
      * Error messages are sent in arrays
      */
      if (isArray(response.data.messages)) {
        store.dispatch('setMessage', { type: 'error', message: response.data.messages })

      /**
      * Laravel generated validation errors are
      * sent in an object
      */
      } else if (response.status === 422 && isObject(response.data)) {
        store.dispatch('setMessage', { type: 'validation', message: response.data })
      }

      store.dispatch('setFetching', { fetching: false })

      return Promise.reject(error)
    }
  )
}
