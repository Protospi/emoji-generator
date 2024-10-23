import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "./utils/supabase-client";

// Add these lines at the top of the file
export const runtime = 'edge';
export const preferredRegion = 'auto';

const isProtectedRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = auth();

  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: "/" });
  }

  // If the user is logged in and the route is protected, create or update the user profile
  if (userId && isProtectedRoute(req)) {
    const supabase = createClient();

    if (supabase) {
      try {
        // Check if the user profile exists
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select()
          .eq('user_id', userId)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching user profile:', fetchError);
        }

        if (!existingProfile) {
          // Create a new user profile if it doesn't exist
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({ user_id: userId })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating user profile:', insertError);
          } else {
            console.log('New user profile created:', newProfile);
          }
        }
      } catch (error) {
        console.error('Error in Supabase operations:', error);
      }
    } else {
      console.error('Failed to create Supabase client');
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*).*)", "/", "/(api|trpc)(.*)"],
};
