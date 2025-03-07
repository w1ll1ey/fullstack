import { useState } from 'react'

const Statistics = (props) => {
  return (
    <div>
      <h1>statistics</h1>
      <p>good {props.good}<br/>neutral {props.neutral}<br/>bad {props.bad}
      <br/>all {props.good + props.neutral + props.bad}
      <br/>average {(props.good * 1 + props.neutral * 0 + props.bad * -1) / (props.good + props.bad + props.neutral)}
      <br/>positive {props.good / (props.good + props.bad + props.neutral) * 100} %
      </p>
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0) 

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={() => setGood(good + 1)}>
        good
      </button>
      <button onClick={() => setNeutral(neutral + 1)}>
        neutral
      </button>
      <button onClick={() => setBad(bad + 1)}>
        bad
      </button>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App