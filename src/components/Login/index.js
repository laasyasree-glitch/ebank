import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

class Login extends Component {
  state = {
    userId: '',
    pin: '',
    show: false,
    errorMsg: '',
  }

  submitForm = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = error => {
    this.setState({show: true, errorMsg: error})
  }

  onChangeUserId = event => this.setState({userId: event.target.value})

  onChangePin = event => this.setState({pin: event.target.value})

  renderUsername = () => {
    const {userId} = this.state
    return (
      <div>
        <label htmlFor="userId">User ID</label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={this.onChangeUserId}
          placeholder="Enter User ID"
        />
      </div>
    )
  }

  renderPassword = () => {
    const {pin} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div>
        <label htmlFor="pin">Pin</label>
        <input
          type="password"
          id="pin"
          value={pin}
          onChange={this.onChangePin}
          placeholder="Enter PIN"
        />
      </div>
    )
  }

  render() {
    const {show, errorMsg} = this.state
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
          alt="website login"
        />
        <h1>Welcome Back</h1>
        <form onSubmit={this.submitForm}>
          {this.renderUsername()}
          {this.renderPassword()}
          <button type="submit">Login</button>
        </form>
        {show && <p>{errorMsg}</p>}
      </div>
    )
  }
}

export default Login
