import { Platform, Linking } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
  PermissionStatus,
} from 'react-native-permissions';
import { showMessage } from 'react-native-flash-message';
import StaticVariables from '../../preference/StaticVariables';

// Type aliases
type PermissionType = Permission | null;

// Platform-specific permission values
export const LocationAccess: PermissionType = Platform.select({
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
}) ?? null;

export const CameraAccess: PermissionType = Platform.select({
  android: PERMISSIONS.ANDROID.CAMERA,
  ios: PERMISSIONS.IOS.CAMERA,
}) ?? null;

export const MediaAccess: PermissionType = Platform.select({
  android:
    Platform.OS === 'android' && typeof Platform.Version === 'number' && Platform.Version <= 32
      ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
      : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
}) ?? null;

export const StorageAccess: PermissionType = Platform.select({
  android:
   Platform.OS === 'android' && typeof Platform.Version === 'number' &&  Platform.Version < 31
      ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
      : PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
}) ?? null;

// Check permission and request if necessary
export const CheckPermission = (permission: Permission): Promise<PermissionStatus> => {
  return new Promise((resolve, reject) => {
    check(permission)
      .then((result: PermissionStatus) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
          case RESULTS.GRANTED:
          case RESULTS.LIMITED:
            resolve(result);
            break;
          case RESULTS.DENIED:
            RequestPermission(permission)
              .then(resolve)
              .catch(reject);
            break;
          case RESULTS.BLOCKED:
            reject(RESULTS.BLOCKED);
            break;
        }
      })
      .catch(reject);
  });
};

// Request permission with fallback logic
export const RequestPermission = (permission: Permission): Promise<PermissionStatus> => {
  return new Promise((resolve, reject) => {
    request(permission)
      .then((result: PermissionStatus) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
          case RESULTS.GRANTED:
          case RESULTS.LIMITED:
            resolve(result);
            break;
          case RESULTS.DENIED:
          case RESULTS.BLOCKED:
            if (permission === LocationAccess && Platform.OS === 'ios') {
              request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((resultLocation) => {
                if (
                  resultLocation === RESULTS.GRANTED ||
                  resultLocation === RESULTS.LIMITED
                ) {
                  resolve(resultLocation);
                } else {
                  reject(result);
                }
              });
            } else {
              reject(result);
            }
            break;
        }
      })
      .catch(reject);
  });
};

// Show UI message when permission is needed
export const permissionRequest = (
  type: string,
  position: 'top' | 'bottom' | 'center' = 'bottom'
): void => {
  let text = '';

  switch (type) {
    case StaticVariables.CAMERA:
      text = 'Allow camera permission';
      break;
    case StaticVariables.LOCATION:
      text = 'Allow location permission';
      break;
    case StaticVariables.STORAGE:
      text =
        Platform.OS === StaticVariables.PLATFORM_ANDROID
          ? 'Allow android storage permission'
          : 'Allow ios storage permission';
      break;
    default:
      text = 'Allow required permission';
  }

  showMessage({
  message: text,
  description: 'Enable required permissions',
  type: 'danger',
  position,
  floating: true,
  autoHide: true,
  duration: 3000,
  icon: {
    icon: 'warning',
    position: 'left',
    props: {}, // ✅ added to fix TS type error
  },
  onPress: () => {
    Linking.openSettings();
  },
});
};
