
// middleware/admin.ts
import { useUser } from '@/store/UserStore';
import { supabase } from '@/store/client';

const isAdmin = async () => {
    try {
        return await supabase.auth.getSession().then((data: any) => {
            const session = data.data.session;
            const user = session?.user || { role: null };
            // console.log(session, user);
            if (!user) {
                // Handle unauthorized access
                return false;
            }
            // Check if the user has the 'admin' role (modify this based on your Supabase schema)
            if (user?.is_admin) {
                return true;
            } else {
                // Handle unauthorized access for non-admin users
                return false;
            }
        })
    } catch (error) {
        console.error('Error in isAdmin middleware:', error);
        return false;
    }
};

export default isAdmin;
