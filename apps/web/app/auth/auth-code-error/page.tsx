import Link from 'next/link'

interface AuthCodeErrorPageProps {
  searchParams: { error?: string }
}

export default function AuthCodeErrorPage({ searchParams }: AuthCodeErrorPageProps) {
  const errorType = searchParams.error || 'unknown'
  
  const getErrorMessage = () => {
    switch (errorType) {
      case 'session_expired':
        return {
          title: 'Session Expired',
          description: 'Your session has expired. Please sign in again to continue.',
          reasons: [
            'You were inactive for too long',
            'Your session token has expired',
            'A security refresh was required'
          ]
        }
      case 'missing_code':
        return {
          title: 'Invalid Authentication Link',
          description: 'The authentication link is missing required information.',
          reasons: [
            'The link is malformed or incomplete',
            'You may have copied the link incorrectly',
            'The email client may have broken the link'
          ]
        }
      case 'unexpected_error':
        return {
          title: 'Unexpected Error',
          description: 'An unexpected error occurred during authentication.',
          reasons: [
            'There was a temporary server issue',
            'Your internet connection may be unstable',
            'The authentication service may be temporarily unavailable'
          ]
        }
      default:
        return {
          title: 'Authentication Error',
          description: 'Sorry, we couldn\'t complete your authentication request.',
          reasons: [
            'The link you clicked is too old',
            'The link has already been used',
            'There was an error in the authentication process'
          ]
        }
    }
  }

  const errorInfo = getErrorMessage()
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {errorInfo.title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {errorInfo.description}
          </p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Authentication Failed
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      This could happen if:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {errorInfo.reasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">What to do next:</h4>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                      1
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">
                      Try signing in again with your email address
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                      2
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">
                      Check your email for a new authentication link
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                      3
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">
                      Make sure to use the most recent link in your email
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3 pt-4">
              <Link
                href="/auth/signin"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Signing In Again
              </Link>
              
              <Link
                href="/"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to Home
              </Link>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                If you continue to experience issues, please contact support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}