
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './client';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
interface UserProviderProps {
    children: React.ReactNode;
}

interface UserContextProps {
    user: any | null;
}

export const UserContext = createContext<UserContextProps>({ user: null });
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
const UserProvider: React.FC<UserProviderProps> = ({ children }: UserProviderProps) => {
    const [user, setuser] = useState<any | null>(null);

    useEffect(() => {
        const { data: authListener } = supabase?.auth?.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
            if (session?.user) {
                setuser(session.user);
                console.log(session.user?.user_metadata?.full_name);
            }
        });

        // Cleanup the subscription when the component unmounts
        return () => {
            authListener?.subscription.unsubscribe();
        }
    }, []);

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;
