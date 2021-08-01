
const baseURL = 'https://pleasent-package-3eqvi.cloud.serverless.com'

const getHeaders = (password) => ({
    Authorization: `Bearer ${password || JSON.parse(localStorage.getItem("serverless-status") || {}) || ""
        }`,
    "Content-Type": "application/json",
});
export const apiClient = async ({ url, body, password, method = 'GET' }) => {
    
    const res = await fetch(`${baseURL}/${url}`, {
        method,
        headers: getHeaders(password || {}),
        body
    })
    
    const json = await res.json()
    if (res.ok) {

        return json
    } else {

        
        throw new Error(json.message)
    }
}


