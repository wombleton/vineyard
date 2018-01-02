import { render } from 'react-dom'
import React from 'react'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'

import App from './components/App'
import store from './store'

const theme = createMuiTheme()

render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <IntlProvider locale="en">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </IntlProvider>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
)
