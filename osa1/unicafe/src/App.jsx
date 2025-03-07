import { useState } from 'react'


const Button = (props) => {
  return (
    <div>
      <button onClick={() => props.setValue(props.value + 1)}>
        {props.text}
      </button>
    </div>
  )
}

const StatisticLine = (props) => {
  return (
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>
  )
}

const Statistics = (props) => {
  if (props.good === 0 && props.neutral === 0 && props.bad === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
  return (
    <table>
      <tbody>
      <StatisticLine text="good" value={props.good}/>
      <StatisticLine text="neutral" value={props.neutral}/>
      <StatisticLine text="bad" value={props.bad}/>
      <StatisticLine text="all" value={props.good + props.neutral + props.bad}/>
      <StatisticLine text="average" value={(props.good * 1 + props.neutral * 0 + props.bad * -1) / (props.good + props.bad + props.neutral)}/>
      <StatisticLine text="positive" value={`${props.good / (props.good + props.bad + props.neutral) * 100} %`}/>
      </tbody>
    </table>
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
      <Button text="good" value={good} setValue={setGood}/>
      <Button text="neutral" value={neutral} setValue={setNeutral}/>
      <Button text="bad" value={bad} setValue={setBad}/>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App