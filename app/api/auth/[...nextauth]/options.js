import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import User from '@/app/(models)/User';
import bcrypt from 'bcrypt';

export const options = {
    providers: [
        GitHubProvider({
            profile(profile) {
                let userRole = "GitHub User";
                if (profile?.email == "adityaks92@gmail.com") {
                    userRole = "admin";
                }

                return {
                    ...profile,
                    role: userRole
                }
            },
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_Secret,
        }),
        GoogleProvider({
            profile(profile) {
                return {
                    ...profile,
                    id: profile.sub,
                    // role: userRole
                }
            },
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_Secret,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: {
                    label: 'email',
                    type: 'text',
                    placeholder: 'Enter your email'
                },
                password: {
                    label: 'password',
                    type: 'password',
                    placeholder: 'Enter your password'
                }
            },
            async authorize(credentials) {
                try {
                    const foundUser = User.findOne({ email: credentials.email }).lean().exec();
                    if (foundUser) {
                        const match = await bcrypt.compare(credentials.password, foundUser.password);
                        if(match) {
                            delete foundUser.password;
                            foundUser['role'] = 'Unverified email';
                            return foundUser
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
                return null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user}) {
            if (user) token.role = user.role
            return token;
        },
        async session ({ session, token }) {
            if(session?.user) session.user.role = token.role;
            return session
        }
    }
}