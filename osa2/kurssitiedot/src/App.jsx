const Header = (props) => {
  return (
    <div>
      <h1>{props.header}</h1>
    </div>
  )
}

const Part = (props) => {
  return (
    <p>{props.part}</p>
  )
}

const Content = (props) => {
  return (
    <div>
      {props.parts.map(part => (
      <Part key={part.id} part={`${part.name} ${part.exercises}`}/>
      ))}
    </div>
  )
}

const Total = (props) => {
  return (
    <div>
      <p>total of {props.total} exercises</p>
    </div>
  )
}

const Course = (props) => {
  
  const sum = props.course.parts.map(part => part.exercises).reduce(
    (sum, currentValue) => sum + currentValue,
    0,
  );

  return (
    <div>
      <Header header={props.course.name}/>
      <Content parts={props.course.parts}/>
      <Total total={sum}/>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  }

  return (
    <div>
      <Course course={course}/>
    </div>
  )
}

export default App