"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/navbar';
import { useUser } from '@/contexts/userContext';
import Loading from '@/components/loading/loading';
export default function ProfilePage() {
    const { user, loading } = useUser();
    const router = useRouter();
    if (loading) {
        return <Loading />;
    }
if(!user){
    router.push('/');
    return null;
}
    return (
        <div>
            <h1>User Profile</h1>
            {/* Profile information goes here */}
        </div>
    );
}