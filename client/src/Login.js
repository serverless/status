import { Alert, AlertIcon, Box, Button, Center, Heading, Input, VStack } from "@chakra-ui/react"
import { useState } from "react"

import { useLocalStorage } from "react-use";
import { apiClient } from "./api";
import { Collapsible } from "./components/Collapsible";


export const Login = () => {
    
    const [, setStoredPassword] = useLocalStorage('serverless-status', '');
    const [password, setPassword] = useState('')
    const [loading, setloading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const login = async () => {
        setloading(true)
        const result = await apiClient({ url: 'auth', password })

        console.log('result222', result)
        if (result.statusCode !== 500) {

            setStoredPassword(password)
            window.location.href = '/'
        } else {
            setErrorMessage(result.message)

        }
        setloading(false)
    }
    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <Center h="100vh" color="white">
                <VStack spacing="24px" >
                    <Heading>Login</Heading>
                    <Input placeholder="Password" type="password" onChange={e => {
                        setPassword(e.target.value)
                        setErrorMessage('')
                    }}
                        onKeyUp={(event) => {
                            if (event.key === "Enter") {
                                login()
                            }
                        }}
                    />
                    <Button isLoading={loading} onClick={login}>Login</Button>
                    <Collapsible collapsed={!errorMessage}>
                        <Alert status="error">
                            <AlertIcon />
                            {errorMessage}
                        </Alert>
                    </Collapsible>

                </VStack>
            </Center>


        </Box>
    )
}

