import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/supabase.server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

async function handleLogin(formData: FormData) {
  "use server"
  
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await login(email, password)
    revalidatePath('/')
    redirect('/chat/new')
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Zaloguj się</CardTitle>
          <CardDescription>Dane logowania znajdują się w mailu z zadaniem</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleLogin}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Hasło</Label>
                  </div>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
