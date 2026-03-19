import AuthHero from '../Auth/AuthHero'
import { Outlet } from 'react-router'

export default function AuthLayout() {
  return (
    <>
    <main className='grid grid-cols-12 min-h-screen'>
        <div className='col-span-12 lg:col-span-6'>
            <AuthHero/>
        </div>
        <div className='col-span-12 lg:col-span-6'>
            <Outlet/>
        </div>
    </main>
    </>
  )
}
