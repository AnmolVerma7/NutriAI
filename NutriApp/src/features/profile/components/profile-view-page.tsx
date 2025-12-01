import { createClient } from '@/lib/supabase/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default async function ProfileViewPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const fullName = user.user_metadata?.full_name || 'User';
  const email = user.email || '';
  const avatarUrl = user.user_metadata?.avatar_url || '';
  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className='flex w-full flex-col space-y-6 p-4'>
      <div className='flex items-center space-x-4'>
        <Avatar className='h-20 w-20'>
          <AvatarImage src={avatarUrl} alt={fullName} />
          <AvatarFallback className='text-lg'>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className='text-2xl font-bold'>{fullName}</h2>
          <p className='text-muted-foreground'>{email}</p>
        </div>
      </div>

      <Separator />

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='grid grid-cols-3 gap-4'>
              <div className='text-muted-foreground font-medium'>Full Name</div>
              <div className='col-span-2'>{fullName}</div>
            </div>
            <div className='grid grid-cols-3 gap-4'>
              <div className='text-muted-foreground font-medium'>Email</div>
              <div className='col-span-2'>{email}</div>
            </div>
            <div className='grid grid-cols-3 gap-4'>
              <div className='text-muted-foreground font-medium'>User ID</div>
              <div className='text-muted-foreground col-span-2 pt-1 font-mono text-xs'>
                {user.id}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
