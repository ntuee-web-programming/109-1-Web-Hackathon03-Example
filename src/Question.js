import React, { Component } from 'react'
import axios from 'axios'

const API_ROOT = 'http://localhost:4000/api'
const instance = axios.create({
  baseURL: API_ROOT
})

class Question extends Component {
  constructor(props) {
    super(props)
    this.state = {
      complete: false,
      contents: [],
      ans: [],
      score: 0,
      current_question: 0
    }
  }

  next = async () => {
    if (this.state.current_question === (this.state.contents.length - 1)) {
      const score_result = await instance.post('/checkAns', { myAns: this.state.ans })
      if (score_result.data.message === 'success') {
        this.setState({ complete: true, score: score_result.data.score })
      }
    }
    else {
      this.setState(state => ({ current_question: state.current_question + 1 }))
    }
  }

  choose = (opt) => {
    let new_ans = this.state.ans
    if (!new_ans[this.state.current_question])
      new_ans = [...new_ans, parseInt(opt)]
    else
      new_ans[this.state.current_question] = opt
    
    this.setState({ ans: new_ans })
  }

  getQuestions = async () => {
    const res = await instance.get('/getContents')
    if (res.data.message === 'success') {
      this.setState({ contents: res.data.contents })
    }
  }

  componentDidMount() {
    this.getQuestions()
  }

  render() {
    const contents = this.state.contents
    const current = this.state.current_question
    const score = this.state.score
    const ans = this.state.ans

    return (
      <div id="quiz-container">
        {contents.length ?
          <React.Fragment>
            <div id="question-box">
              <div className="question-box-inner">Question {current + 1} of {contents.length}</div>
            </div>

            <div id="question-title">
              {this.state.complete ? `Your Score : ${score} / ${contents.length}` : contents[current].question}
            </div>

            {this.state.complete ? <div></div> :
              <div id="options">
                {contents[current].options.map((each, i) => (
                  <div className="each-option" onClick={() => this.choose(i + 1)} key={i}>
                    <input
                      type="radio"
                      name={`q${current + 1}_option`}
                      id={`q${current + 1}_${i + 1}`}
                      value={i + 1}
                      checked={ans[current] === (i + 1)}
                      onChange={e => this.choose(i + 1)}
                    />
                    <span>{each}</span>
                  </div>
                ))}
              </div>
            }
            
            {this.state.complete ? <div></div> : <div id="actions" onClick={this.next}>NEXT</div>}
          </React.Fragment>
          : <React.Fragment></React.Fragment>
        }
      </div>
    )
  }
}

export default Question
