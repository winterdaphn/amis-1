import { theme, ClassNamesFn, makeClassnames } from '../theme';
export const classPrefix: string = 'mobile-';
export const classnames: ClassNamesFn = makeClassnames(classPrefix);

theme('mobile', {
  classPrefix,
  classnames
});
