import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Alert, AlertDescription } from './alert';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Copy, Key, Loader2 } from 'lucide-react';

// When using Vite, use import.meta.env
// When using Create React App, prefix with VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

const KeyGeneration = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasKey, setHasKey] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    checkExistingKey();
  }, []);

  const checkExistingKey = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        setError('Please sign in to generate a key');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('generated_keys')
        .select('key')
        .eq('user_id', session.session.user.id)
        .single();

      if (data) {
        setHasKey(true);
        setGeneratedKey(data.key);
      }
    } catch (err) {
      console.error('Error checking key:', err);
      setError('Failed to check existing key');
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewKey = () => {
    return 'pk_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .substring(0, 32);
  };

  const handleGenerateKey = async () => {
    try {
      setIsLoading(true);
      setError('');

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        setError('Please sign in to generate a key');
        return;
      }

      const { data: existingKey } = await supabase
        .from('generated_keys')
        .select('key')
        .eq('user_id', session.session.user.id)
        .single();

      if (existingKey) {
        setError('You already have a generated key');
        return;
      }

      const newKey = generateNewKey();

      const { error: insertError } = await supabase
        .from('generated_keys')
        .insert([
          {
            key: newKey,
            user_id: session.session.user.id,
            created_at: new Date().toISOString()
          }
        ]);

      if (insertError) throw insertError;

      setGeneratedKey(newKey);
      setHasKey(true);
    } catch (err) {
      console.error('Error generating key:', err);
      setError('Failed to generate key');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedKey);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setError('Failed to copy key');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          API Key Generation
        </CardTitle>
        <CardDescription>
          Generate your unique API key for accessing our services
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {hasKey ? (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg break-all font-mono text-sm">
              {generatedKey}
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={copyToClipboard}
              disabled={copySuccess}
            >
              <Copy className="h-4 w-4 mr-2" />
              {copySuccess ? 'Copied!' : 'Copy Key'}
            </Button>
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={handleGenerateKey}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate New Key'
            )}
          </Button>
        )}
      </CardContent>

      <CardFooter className="text-sm text-gray-500">
        {hasKey ? (
          'Keep this key secure. It grants access to your account.'
        ) : (
          'You can only generate one key per account.'
        )}
      </CardFooter>
    </Card>
  );
};

export default KeyGeneration;