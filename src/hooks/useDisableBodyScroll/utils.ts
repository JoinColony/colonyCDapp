import { scrollbarWidth } from '@xobotyi/scrollbar-width';

export const isVerticalScrollBarVisible = () => {
  const {
    body: { clientWidth: bodyWidth },
  } = document;

  const { innerWidth: windowWidth } = window;

  return windowWidth > bodyWidth;
};

export const enableScrollOnBody = (): void => {
  const { body } = document;

  if (!body.style.top) {
    return;
  }

  const scrollY = parseInt(body.style.top, 10);

  body.style.position = '';
  body.style.width = '';
  body.style.top = '';
  body.style.paddingRight = '';

  document.documentElement.style.setProperty('--fake-scrollbar-width', '0');

  window.scrollTo(0, scrollY * -1);
};

export const disableScrollOnBody = (): void => {
  const scrollY = `${window.scrollY}px`;
  const { body } = document;

  const scrollVisible = isVerticalScrollBarVisible();

  body.style.position = 'fixed';
  body.style.width = '100%';

  body.style.top = scrollY ? `-${scrollY}` : '0px';

  if (!scrollVisible) {
    return;
  }

  const scrollBarWidthPx = `${scrollbarWidth() || 0}px`;

  document.documentElement.style.setProperty(
    '--fake-scrollbar-width',
    scrollBarWidthPx,
  );
  body.style.paddingRight = scrollBarWidthPx;
};
