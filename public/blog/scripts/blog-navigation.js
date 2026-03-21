(function () {
  function isAuthenticated() {
    const token = window.localStorage.getItem('jwt_token');
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < currentTime) {
        window.localStorage.removeItem('jwt_token');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Invalid token format:', error);
      window.localStorage.removeItem('jwt_token');
      return false;
    }
  }

  function syncBackHomeLink() {
    const backHomeLink = document.getElementById('back-home-link');
    if (!backHomeLink) {
      return;
    }

    backHomeLink.href = isAuthenticated() ? '/#/dashboard' : '/#/';
    backHomeLink.textContent = '← Back to Home';
  }

  syncBackHomeLink();
})();