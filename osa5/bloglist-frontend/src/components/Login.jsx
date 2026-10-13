import { useState } from "react"
import Notification from "./Notification"

const LoginForm = ({
    handleLogin,
    notification,
    error
}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const submitCredentials = (event) => {
        event.preventDefault()

        handleLogin({
            username,
            password
        })

        setUsername('')
        setPassword('')
    }

    return (
        <div>
            <h2>Log in to application</h2>

            <Notification message={notification} error={error} />

            <form onSubmit={submitCredentials}>
                <div>
                    <label>
                        username
                        <input
                            type="text"
                            value={username}
                            onChange={({ target }) => setUsername(target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        password
                        <input
                            type="password"
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </label>
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default LoginForm