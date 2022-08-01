import { useEffect, useState } from 'react'

export function Async() {
  const [isButtonVisible, setIsButtonVisible] = useState(false)
  const [isTagPVisible, setIsTagPVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsButtonVisible(true)
      setIsTagPVisible(true)
    }, 1000)
  }, [])

  return (
    <div>
      <div>Hello World</div>
      {isButtonVisible && <button>Button</button>}
      {isTagPVisible && <p>My name is P tag!</p>}
    </div>
  )
}
