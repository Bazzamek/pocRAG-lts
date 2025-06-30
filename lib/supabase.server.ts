import { ChatType } from "@/types/chat"
import { createServer } from "@/utils/supabase/server"


export const isUserLoggedIn = async (isServer: boolean): Promise<any> => {
    const supabase  = await createServer()

    const {
        data: { user },
    } = await supabase.auth.getUser()
    return user
}

export const login = async (email: string, password: string): Promise<any> => {
    const supabase  = await createServer()

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return error
    }

    return data;
};

export const getUserId = async (isServer?: boolean): Promise<string | null>=>{
    const supabase  = await createServer()

    const user = await isUserLoggedIn(isServer ? isServer : true);
    if (user && user.aud === 'authenticated') {return user.id}
    else {return null}
}

