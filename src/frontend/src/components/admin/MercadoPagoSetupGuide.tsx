import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Info, ExternalLink, Key, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function MercadoPagoSetupGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Mercado Pago Setup Guide
        </CardTitle>
        <CardDescription>
          Follow these steps to configure Mercado Pago payment integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Warning:</strong> The Access Token must NEVER be stored in frontend code or exposed to users. 
            It is stored securely in the backend only and is never returned to the frontend.
          </AlertDescription>
        </Alert>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This guide will help you obtain and configure your Mercado Pago credentials. Never share your API keys publicly.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">Step 1</Badge>
              <h3 className="font-semibold">Create a Mercado Pago Account</h3>
            </div>
            <p className="text-sm text-muted-foreground pl-20">
              If you don't have one already, sign up at{' '}
              <a
                href="https://www.mercadopago.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                mercadopago.com.br
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">Step 2</Badge>
              <h3 className="font-semibold">Access Your Developer Dashboard</h3>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 pl-20">
              <li>• Log in to your Mercado Pago account</li>
              <li>• Navigate to "Your integrations" in the developer menu</li>
              <li>• Create a new application or select an existing one</li>
            </ul>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">Step 3</Badge>
              <h3 className="font-semibold flex items-center gap-2">
                <Key className="h-4 w-4" />
                Obtain Your Credentials
              </h3>
            </div>
            <div className="space-y-3 pl-20">
              <div className="space-y-1">
                <p className="text-sm font-medium">Public Key:</p>
                <p className="text-sm text-muted-foreground">
                  Used for frontend initialization. Starts with <code className="bg-muted px-1 py-0.5 rounded">TEST-</code> for test mode or <code className="bg-muted px-1 py-0.5 rounded">APP_USR-</code> for production.
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Access Token:</p>
                <p className="text-sm text-muted-foreground">
                  Used for backend API calls. <strong>Keep this secret and never expose it in frontend code.</strong> It is stored only in the backend.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">Step 4</Badge>
              <h3 className="font-semibold">Configure in Admin Panel</h3>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 pl-20">
              <li>• Copy your Public Key and paste it in the "Public Key" field above</li>
              <li>• Copy your Access Token and paste it in the "Access Token" field above</li>
              <li>• Enable Mercado Pago by toggling the switch</li>
              <li>• Click "Save Configuration" to apply changes</li>
            </ul>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">Step 5</Badge>
              <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Test Your Integration
              </h3>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 pl-20">
              <li>• Navigate to the checkout page as a regular user</li>
              <li>• Select a subscription plan</li>
              <li>• Choose Mercado Pago as the payment provider</li>
              <li>• Verify that the payment flow works correctly</li>
              <li>• Use test credentials for initial testing</li>
            </ul>
          </div>

          <Separator />

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <p className="font-medium">Important Security Notes:</p>
              <ul className="text-sm space-y-1 mt-2">
                <li>• Never commit API keys to version control</li>
                <li>• Use test credentials during development</li>
                <li>• Switch to production credentials only when ready to go live</li>
                <li>• Regularly rotate your API keys for security</li>
                <li>• Access Tokens are stored securely in the backend and never returned to the frontend</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
