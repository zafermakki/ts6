
import { useState, useEffect } from 'react';
import { HashRouter , Outlet, Route, Routes } from 'react-router-dom';

import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';

import FeedPage from './pages/FeedPage';
import PostDetailsPage from './pages/PostDetailsPage';
import UserProfilePage from './pages/UserProfilePage';
import NotFoundPage from './pages/NotFoundPage';

import { ThemeProvider } from './context/ThemeContext';
import { EngagementProvider } from './context/EngagementContext';

function MainLayout() {
  const [searchValue, setSearchValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const outletContext = {
    searchValue,
    onSearchChange: setSearchValue,
  };

  // Lock background scrolling when mobile sidebar is open
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 720px)').matches;

    if (!menuOpen || !isMobile) return;

    const scrollY = window.scrollY;

    const body = document.body;
    const html = document.documentElement;

    const previousStyles = {
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
      htmlOverflow: html.style.overflow,
    };

    // Prevent background scrolling
    html.style.overflow = 'hidden';

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      // Restore original styles
      html.style.overflow = previousStyles.htmlOverflow;

      body.style.position = previousStyles.bodyPosition;
      body.style.top = previousStyles.bodyTop;
      body.style.left = previousStyles.bodyLeft;
      body.style.right = previousStyles.bodyRight;
      body.style.width = previousStyles.bodyWidth;
      body.style.overflow = previousStyles.bodyOverflow;

      // Restore previous scroll position
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen]);

  function focusComposer() {
    window.location.pathname !== '/' &&
      (window.location.href = '/#create-post-form');

    setTimeout(() => {
      document
        .getElementById('create-post-form')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });

      document
        .querySelector('#create-post-form textarea')
        ?.focus({ preventScroll: true });
    }, 80);
  }

  return (
    <div className="app-shell">
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="app-main">
        <Topbar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onMenuClick={() => setMenuOpen(true)}
          onCreateClick={focusComposer}
        />

        <div className="main-content">
          <Outlet context={outletContext} />
        </div>

        <footer className="mobile-footer">
          A softer place on the internet. <span>✦</span>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <EngagementProvider>
        <HashRouter >
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<FeedPage />} />
              <Route
                path="/posts/:postId"
                element={<PostDetailsPage />}
              />
              <Route
                path="/users/:userId"
                element={<UserProfilePage />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </HashRouter >
      </EngagementProvider>
    </ThemeProvider>
  );
}
