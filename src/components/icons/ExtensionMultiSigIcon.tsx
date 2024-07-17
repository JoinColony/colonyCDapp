import { type Icon, IconBase, type IconWeight } from '@phosphor-icons/react';
import React, { forwardRef, type ReactElement } from 'react';

const SVG = (
  <>
    <circle cx="128" cy="128" r="126" fill="#039855" />
    <path
      d="M195.294 153.882H86.4977C88.2188 150.492 89.9465 147.004 91.6741 143.458C101.335 144.526 112.781 137.764 125.8 123.257C126.188 124.331 126.622 125.438 127.094 126.557C131.306 136.425 136.742 142.048 143.271 143.284C149.961 144.578 156.587 141.194 163.381 133.047C167.794 138.269 176.853 143.529 195.294 143.529C196.667 143.529 197.984 142.984 198.954 142.013C199.925 141.042 200.471 139.726 200.471 138.353C200.471 136.98 199.925 135.663 198.954 134.693C197.984 133.722 196.667 133.176 195.294 133.176C175.475 133.176 169.703 126.324 169.412 122.681C169.38 121.477 168.93 120.322 168.138 119.414C167.346 118.506 166.262 117.903 165.074 117.708C163.885 117.514 162.665 117.74 161.625 118.347C160.585 118.955 159.79 119.906 159.376 121.038C151.501 132.846 146.836 133.422 145.141 133.112C139.751 132.096 134.736 119.569 133.047 111.429C132.826 110.401 132.297 109.464 131.531 108.744C130.765 108.024 129.797 107.555 128.757 107.398C127.718 107.241 126.655 107.405 125.71 107.867C124.766 108.33 123.985 109.069 123.471 109.986C110.659 125.916 102.066 131.339 96.6759 132.724C102.169 120.507 106.272 109.785 108.899 100.759C113.312 85.5918 113.635 74.9865 109.876 68.3412C107.935 64.8729 103.865 60.7382 95.6988 60.7059H95.5371C85.1841 60.7771 77.0312 70.6059 73.1359 87.6882C70.8129 97.8535 70.4312 109.164 72.0812 118.747C73.7312 128.33 77.1671 135.254 82.1429 139.382C79.7359 144.384 77.2706 149.269 74.8765 153.895H60.7059C59.333 153.895 58.0163 154.441 57.0456 155.411C56.0748 156.382 55.5294 157.699 55.5294 159.072C55.5294 160.445 56.0748 161.761 57.0456 162.732C58.0163 163.703 59.333 164.248 60.7059 164.248H69.3829C62.0582 177.836 56.3641 187.309 56.2735 187.465C55.9045 188.048 55.6557 188.698 55.5417 189.379C55.4278 190.059 55.451 190.756 55.6101 191.427C55.7691 192.098 56.0607 192.731 56.4678 193.288C56.8749 193.845 57.3892 194.315 57.9805 194.671C58.5719 195.026 59.2283 195.26 59.9112 195.358C60.5941 195.456 61.2897 195.416 61.9571 195.242C62.6246 195.067 63.2504 194.761 63.7978 194.341C64.3452 193.921 64.8031 193.396 65.1447 192.796C65.2418 192.628 72.4371 180.638 81.1271 164.248H195.294C196.667 164.248 197.984 163.703 198.954 162.732C199.925 161.761 200.471 160.445 200.471 159.072C200.471 157.699 199.925 156.382 198.954 155.411C197.984 154.441 196.667 153.895 195.294 153.895V153.882ZM169.412 122.824V122.688C169.416 122.733 169.416 122.778 169.412 122.824ZM83.2171 89.9918C85.7988 78.6812 90.7812 71.0588 95.6471 71.0588C99.0441 71.0588 100.176 72.2624 100.824 73.4335C102.765 76.8824 105.042 89.0859 86.8147 129.32C81.5153 122.015 79.71 105.353 83.2171 89.9918Z"
      fill="white"
    />
  </>
);

const weights = new Map<IconWeight, ReactElement>([['regular', SVG]]);

const ExtensionMultiSigIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} />
));

ExtensionMultiSigIcon.displayName = 'ExtensionMultiSigIcon';

export default ExtensionMultiSigIcon;
