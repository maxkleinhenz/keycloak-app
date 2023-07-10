import { RouteLocationRaw, Router } from 'vue-router';

export const useRouteUtils = () => {
  const getAbsoluteUrlFromRoute = (router: Router, to: RouteLocationRaw) => {
    const absoluteURL = new URL(router.resolve(to).href, window.location.origin)
      .href;
    return absoluteURL;
  };

  return { getAbsoluteUrlFromRoute };
};
