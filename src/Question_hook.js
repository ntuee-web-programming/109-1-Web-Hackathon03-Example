import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_ROOT = 'http://localhost:4000/api'
const instance = axios.create({
  baseURL: API_ROOT
})

function Question() {
  const [complete, setComplete] = useState(false)
  const [contents, setContents] = useState([])
  const [ans, setAns] = useState([])
  const [score, setScore] = useState(0)
  const [current, setCurrent] = useState(0)

  const next = async () => {
    if (current === (contents.length - 1)) {
      const score_result = await instance.post('/checkAns', { myAns: ans })
      if (score_result.data.message === 'success') {
        setComplete(true)
        setScore(score_result.data.score)
      }
    }
    else {
      setCurrent(current + 1)
    }
  }

  const choose = (opt) => {
    let new_ans = ans
    if (!ans[current])
      new_ans = [...new_ans, opt]
    else
      new_ans[current] = opt
    
    setAns(new_ans)
  }

  const getQuestions = async () => {
    const res = await instance.get('/getContents')
    if (res.data.message === 'success') {
      setContents(res.data.contents)
    }
  }

  useEffect(() => {
    if (!contents.length)
      getQuestions()
  })

  return (
    <div id="quiz-container">
      {contents.length ?
        <React.Fragment>
          <div id="question-box">
            <div className="question-box-inner">Question {current + 1} of {contents.length}</div>
          </div>

          <div id="question-title">
            {complete ? `Your Score : ${score} / ${contents.length}` : contents[current].question}
          </div>

          {complete ? <div></div> :
            <div id="options">
              {contents[current].options.map((each, i) => (
                <div className="each-option" onClick={() => choose(i + 1)} key={i}>
                  <input
                    type="radio"
                    name={`q${current + 1}_option`}
                    id={`q${current + 1}_${i + 1}`}
                    value={i + 1}
                    checked={ans[current] === (i + 1)}
                    onChange={e => choose(i + 1)}
                  />
                  <span>{each}</span>
                </div>
              ))}
            </div>
          }
          
          {complete ? <div></div> : <div id="actions" onClick={next}>NEXT</div>}
        </React.Fragment>
        : <React.Fragment></React.Fragment>
      }
    </div>
  )
}

export default Question
