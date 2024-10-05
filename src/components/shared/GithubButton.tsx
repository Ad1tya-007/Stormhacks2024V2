'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Github } from 'lucide-react';
import { signUpWithGithub } from '@/utils/supabase/actions';

function GithubButton() {
  const handleGitHubLogin = async () => {
    try {
      await signUpWithGithub()
        .then(() => {
          console.log('Successfully signed up');
        })
        .catch((error) => {
          console.error('Error signing up:', error);
        });
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <Button
      onClick={handleGitHubLogin}
      className="w-full max-w-sm flex items-center justify-center space-x-2 mb-4"
      variant="outline"
      size="lg">
      <Github className="w-5 h-5" />
      <span>Log in with GitHub</span>
    </Button>
  );
}

export default GithubButton;
