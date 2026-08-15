const Header = ({ course }) => {
  return <h1>{course.name}</h1>
}

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  )
}

const Course = ({ course }) => {
  const total = course.parts.reduce(
    (sum, part) => sum + part.exercises,
    0
  )

  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <p>Number of exercises {total}</p>
    </div>
  )
}

export default Course