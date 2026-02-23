// API utility with automatic token refresh
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  // Merge options with credentials
  const mergedOptions: RequestInit = {
    ...options,
    credentials: 'include',
  }

  // First attempt
  let response = await fetch(url, mergedOptions)

  // If unauthorized, try to refresh token
  if (response.status === 401) {
    const refreshResponse = await fetch('http://localhost:4000/api/auth/refresh-token', {
      method: 'POST',
      credentials: 'include',
    })

    if (refreshResponse.ok) {
      // Retry the original request after successful refresh
      response = await fetch(url, mergedOptions)
    } else {
      // Refresh failed, redirect to login
      window.location.href = '/onboarding/auth'
    }
  }

  return response
}
