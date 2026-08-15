import { useState } from 'react'

const anecdotes = [
  'If it hurts, do it more often.',
  'Adding manpower to a late software project makes it later.',
  'The first 90 percent of the code accounts for the first 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place.',
  'It is not a bug – it is an undocumented feature.'
]

const App = () => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  const nextAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  const vote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  const mostVoted = votes.indexOf(Math.max(...votes))

  return (
    <div>
      <h1>Anecdote of the day</h1>

      <p>{anecdotes[selected]}</p>

      <p>has {votes[selected]} votes</p>

      <button onClick={vote}>
        vote
      </button>

      <button onClick={nextAnecdote}>
        next anecdote
      </button>

      <h1>Anecdote with most votes</h1>

      <p>{anecdotes[mostVoted]}</p>

      <p>has {votes[mostVoted]} votes</p>
    </div>
  )
}

export default App