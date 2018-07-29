import React from 'react'
import axios from 'axios'
/* eslint-disable */
export default class TestApi extends React.Component {

  getTopics() {
    axios.get('/api/topics')
      .then(resp => console.log(resp))
      .catch(err => console.log(err))
  }

  login() {
    axios.post('/api/user/login', {
      accessToken: '3b4def82-db97-4ae9-aae1-feaa8315b2df'
    }).then(resp => console.log(resp))
      .catch(err => console.log(err))
  }

  markAll() {
    axios.post('/api/message/mark_all?needAccessToken=true')
      .then(resp => console.log(resp))
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div>
        <button type="button" onClick={this.getTopics}>topic</button>
        <button type="button" onClick={this.login}>login</button>
        <button type="button" onClick={this.markAll}>markAll</button>
      </div>
    )
  }
}
/* eslint-enable */
