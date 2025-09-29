import { useEffect } from 'react'
import { useAuthStore } from '../store/auth'

export function useSession(client: any) {
  const { setUser, setSession } = useAuthStore()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await client.auth.getSession()
      
      if (error || !session) {
        setUser(null)
        setSession(null)
        return
      }

      setSession(session)
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
        })
      }
    }

    getSession()

    const { data: { subscription } } = client.auth.onAuthStateChange(
      (_event: any, session: any) => {
        setSession(session)
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name,
          })
        } else {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [client, setUser, setSession])

  return useAuthStore()
}