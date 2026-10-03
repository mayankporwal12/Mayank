import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { ClerkProvider, Show, SignIn, SignUp, useClerk, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { dark } from '@clerk/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { ArrowRight, LockKeyhole, Sparkles } from 'lucide-react';
import { Route, Switch, useLocation, Router } from 'wouter';

const queryClient = new QueryClient();
const clerkPubKey = publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const logoUrl = `${window.location.origin}${basePath}/logo.svg`;

function stripBasePath(path: string) {
  const pathname = path.startsWith(basePath) ? path.slice(basePath.length) : path;
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

const authAppearance = {
  baseTheme: dark,
  layout: {
    logoImageUrl: logoUrl,
    logoPlacement: 'inside' as const,
    socialButtonsPlacement: 'top' as const,
  },
  variables: {
    colorPrimary: '#78d8bd',
    colorBackground: '#111923',
    colorText: '#eaf1f3',
    colorTextSecondary: '#afbdc5',
    colorInputBackground: '#101a23',
    colorInputText: '#f0f5f6',
    colorDanger: '#ffaaa0',
    borderRadius: '12px',
    fontFamily: 'var(--font-sans)',
  },
  elements: {
    rootBox: 'cl-rootBox',
    cardBox: 'cl-cardBox',
    card: 'cl-card',
    footer: 'cl-footer',
    headerTitle: 'cl-headerTitle',
    headerSubtitle: 'cl-headerSubtitle',
    formFieldLabel: 'cl-formFieldLabel',
    formFieldInput: 'cl-formFieldInput',
    formFieldHintText: 'cl-formFieldHintText',
    formFieldErrorText: 'cl-formFieldErrorText',
    formButtonPrimary: 'cl-formButtonPrimary',
    socialButtonsBlockButton: 'cl-socialButtonsBlockButton',
    socialButtonsBlockButtonText: 'cl-socialButtonsBlockButtonText',
    dividerLine: 'cl-dividerLine',
    dividerText: 'cl-dividerText',
    footerActionText: 'cl-footerActionText',
    footerActionLink: 'cl-footerActionLink',
    formResendCodeLink: 'cl-formResendCodeLink',
    alertText: 'cl-alertText',
  },
};

const authLocalization = {
  signIn: {
    start: {
      title: 'Welcome back',
      subtitle: 'Pick up where your thoughts left off.',
    },
  },
  signUp: {
    start: {
      title: 'Create your account',
      subtitle: 'A little room for your next big thought.',
    },
  },
};

function AuthLanding() {
  const { isLoaded, user } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoaded && user) setLocation('/chat', { replace: true });
  }, [isLoaded, setLocation, user]);

  if (!isLoaded) {
    return (
      <main className="auth-loading" role="status" aria-label="Loading your account" data-testid="status-auth-loading">
        <span className="loading-mark"><img src={logoUrl} alt="" /></span>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <header className="auth-header">
        <a className="auth-brand" href={basePath || '/'} aria-label="QYRON AI home" data-testid="link-qyron-home">
          <img className="auth-logo" src={logoUrl} alt="" />
          <span>
            <span className="auth-brand-name">QYRON AI</span>
            <span className="auth-brand-caption">PERSONAL INTELLIGENCE</span>
          </span>
        </a>
        <span className="auth-header-note">A quieter space for clearer thinking</span>
      </header>

      <div className="auth-main">
        <section className="auth-copy" aria-labelledby="auth-title">
          <div className="auth-kicker">Your mind, in motion</div>
          <h1 id="auth-title">Intelligence,<br /><span>Reimagined.</span></h1>
          <p className="auth-lede">
            A personal AI chat for the way you actually think. Follow an idea in English, हिंदी, or Hinglish — and find the next step that feels right.
          </p>
          <p className="auth-language"><strong>ENGLISH</strong> &nbsp;·&nbsp; <strong>हिंदी</strong> &nbsp;·&nbsp; <strong>HINGLISH</strong></p>
          <Show when="signed-out">
            <div className="auth-actions">
              <a className="auth-cta auth-cta-primary" href={`${basePath}/sign-in`} data-testid="link-login">
                Login <ArrowRight aria-hidden="true" />
              </a>
              <a className="auth-cta auth-cta-secondary" href={`${basePath}/sign-up`} data-testid="link-create-account">
                Create account
              </a>
            </div>
          </Show>
          <Show when="signed-in">
            <p className="auth-local-note" role="status" data-testid="status-opening-chat">
              <Sparkles aria-hidden="true" /> Opening your personal chat…
            </p>
          </Show>
        </section>

        <aside className="auth-aside" aria-label="A glimpse of QYRON AI">
          <div className="auth-panel">
            <div className="panel-topline">
              <span className="panel-label">A thought, taking shape</span>
              <span className="panel-live">READY WHEN YOU ARE</span>
            </div>
            <h2 className="panel-heading">A place to think<br /><span>out loud.</span></h2>
            <div className="preview-message">
              <span className="preview-glyph user" aria-hidden="true">Y</span>
              <div className="preview-text">
                <span className="preview-meta">You · Hinglish</span>
                Mujhe apna idea start karna hai, but pehla step clear nahi.
              </div>
            </div>
            <div className="preview-message">
              <span className="preview-glyph" aria-hidden="true">Q</span>
              <div className="preview-text">
                <span className="preview-meta">QYRON AI</span>
                Let’s make it smaller. What’s one version you could try this week?
              </div>
            </div>
            <div className="auth-local-note">
              <LockKeyhole aria-hidden="true" />
              <span>Your conversations stay on this device.</span>
            </div>
          </div>
        </aside>
      </div>

      <footer className="auth-footer">
        <span className="auth-footer-brand">Made by Mayank</span>
        <span>THOUGHTFUL BY DESIGN&nbsp; / &nbsp;QYRON AI</span>
      </footer>
    </main>
  );
}

function ClerkSignIn() {
  return (
    <main className="auth-page auth-page-clerk">
      <header className="auth-header">
        <a className="auth-brand" href={basePath || '/'} aria-label="QYRON AI home" data-testid="link-qyron-home">
          <img className="auth-logo" src={logoUrl} alt="" />
          <span><span className="auth-brand-name">QYRON AI</span><span className="auth-brand-caption">PERSONAL INTELLIGENCE</span></span>
        </a>
        <span className="auth-header-note">Intelligence, Reimagined.</span>
      </header>
      <div className="auth-main auth-main-clerk">
        <section className="auth-copy">
          <div className="auth-kicker">Your space is waiting</div>
          <h1>Welcome<br /><span>back.</span></h1>
          <p className="auth-lede">Come back to your ideas, your questions, and the conversations you keep close.</p>
        </section>
        <section className="auth-aside clerk-card-surface" aria-label="Sign in to QYRON AI">
          <SignIn
            routing="path"
            path={`${basePath}/sign-in`}
            signUpUrl={`${basePath}/sign-up`}
            forceRedirectUrl={`${basePath}/chat`}
            appearance={authAppearance}
          />
        </section>
      </div>
      <footer className="auth-footer"><span className="auth-footer-brand">Made by Mayank</span><span>QYRON AI</span></footer>
    </main>
  );
}

function ClerkSignUp() {
  return (
    <main className="auth-page auth-page-clerk">
      <header className="auth-header">
        <a className="auth-brand" href={basePath || '/'} aria-label="QYRON AI home" data-testid="link-qyron-home">
          <img className="auth-logo" src={logoUrl} alt="" />
          <span><span className="auth-brand-name">QYRON AI</span><span className="auth-brand-caption">PERSONAL INTELLIGENCE</span></span>
        </a>
        <span className="auth-header-note">Intelligence, Reimagined.</span>
      </header>
      <div className="auth-main auth-main-clerk">
        <section className="auth-copy">
          <div className="auth-kicker">Start with a thought</div>
          <h1>Make space<br /><span>for more.</span></h1>
          <p className="auth-lede">Create your account and bring the questions that have been waiting for a little room.</p>
        </section>
        <section className="auth-aside clerk-card-surface" aria-label="Create a QYRON AI account">
          <SignUp
            routing="path"
            path={`${basePath}/sign-up`}
            signInUrl={`${basePath}/sign-in`}
            forceRedirectUrl={`${basePath}/chat`}
            appearance={authAppearance}
          />
        </section>
      </div>
      <footer className="auth-footer"><span className="auth-footer-brand">Made by Mayank</span><span>QYRON AI</span></footer>
    </main>
  );
}

function ProtectedChat() {
  const { isLoaded, user } = useUser();
  const clerk = useClerk();
  const [, setLocation] = useLocation();
  const [attempt, setAttempt] = useState(0);
  const [mountError, setMountError] = useState(false);
  const userId = user?.id;
  const userName = user?.fullName || user?.primaryEmailAddress?.emailAddress || 'QYRON user';

  const onLogout = useCallback(async () => {
    await clerk.signOut({ redirectUrl: `${basePath}/` });
    setLocation('/', { replace: true });
  }, [clerk, setLocation]);

  useEffect(() => {
    if (isLoaded && !user) setLocation('/', { replace: true });
  }, [isLoaded, setLocation, user]);

  useEffect(() => {
    if (!isLoaded || !userId) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    setMountError(false);

    void import('./main.js')
      .then((chatModule) => {
        if (disposed) return;
        const mountQyronChat = (chatModule as unknown as {
          mountQyronChat: (root: HTMLElement, options: { userId: string; userName: string; onLogout: () => void | Promise<void> }) => void | (() => void);
        }).mountQyronChat;
        if (typeof mountQyronChat !== 'function') throw new Error('Chat mount is not available');
        const root = document.getElementById('qyron-chat-root');
        if (!root) throw new Error('Chat mount node is not available');
        const mountedCleanup = mountQyronChat(root, { userId, userName, onLogout });
        cleanup = typeof mountedCleanup === 'function' ? mountedCleanup : undefined;
      })
      .catch(() => {
        if (!disposed) setMountError(true);
      });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [attempt, isLoaded, onLogout, userId, userName]);

  if (!isLoaded || !user) {
    return (
      <main className="auth-loading" role="status" aria-label="Checking your account" data-testid="status-chat-auth">
        <span className="loading-mark"><img src={logoUrl} alt="" /></span>
      </main>
    );
  }

  return (
    <div className="chat-mount">
      <div id="qyron-chat-root" />
      {mountError && (
        <div className="chat-mount-error" role="alert" data-testid="status-chat-load-error">
          <p>QYRON AI couldn’t open your chat just now.</p>
          <button type="button" onClick={() => setAttempt((value) => value + 1)} data-testid="button-retry-chat">Try again</button>
        </div>
      )}
    </div>
  );
}

function AppRoutes() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={AuthLanding} />
        <Route path='/sign-in/*?' component={ClerkSignIn} />
        <Route path='/sign-up/*?' component={ClerkSignUp} />
        <Route path="/chat" component={ProtectedChat} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function ClerkRoutingProvider({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const routerPush = useCallback((to: string) => setLocation(stripBasePath(to)), [setLocation]);
  const routerReplace = useCallback((to: string) => setLocation(stripBasePath(to), { replace: true }), [setLocation]);

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      routerPush={routerPush}
      routerReplace={routerReplace}
      localization={authLocalization}
    >
      {children}
    </ClerkProvider>
  );
}

function App() {
  return (
    <Router base={basePath}>
      <ClerkRoutingProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AppRoutes />
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </ClerkRoutingProvider>
    </Router>
  );
}

export default App;