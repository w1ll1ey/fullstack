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

export default Courses