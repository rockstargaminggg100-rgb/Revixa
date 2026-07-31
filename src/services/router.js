/**
 * REVIXA — CLIENT-SIDE SPA ROUTER
 * d:/f/src/services/router.js
 */

export class SpaRouter {
  constructor(routes, defaultRoute = 'dashboard') {
    this.routes = routes;
    this.defaultRoute = defaultRoute;
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }

  navigate(route) {
    window.location.hash = `#${route}`;
  }

  handleRoute() {
    const rawHash = window.location.hash.replace('#', '');
    const route = rawHash || this.defaultRoute;

    // Execute route handler if defined
    if (this.routes[route]) {
      this.routes[route]();
    } else if (this.routes[this.defaultRoute]) {
      this.routes[this.defaultRoute]();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
