const Header = (props) => {
  return (
    <div>
      <h2>{props.header}</h2>
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
      <b>total of {props.total} exercises</b>
    </div>
  )
}

const Courses = (props) => {
  return (
    <div>
      <h1>Web development curriculum</h1>
      {props.courses.map(course => {
        const sum = course.parts.reduce((sum, part) => sum + part.exercises, 0)
        return (
          <div key={course.id}>
            <Header header={course.name}/>
            <Content key={course.id} parts={course.parts}/>
            <Total total={sum}/>
          </div>
        )
      })}
    </div>
  )
}

const App = () => {
  const courses = [
    {
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
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]


  return (
    <div>
      <Courses courses={courses}/>
    </div>
  )
}

export default App