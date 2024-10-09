/**  @example - https://png-pixel.com/ */
export const BLUR_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOcNX9WPQAGAgJUl8IWQgAAAABJRU5ErkJggg=='

const FEATURE_TYPE = {
  PROGRAM_STROKER: 'STROKER',
  PROGRAM_CRANKER: 'CRANKER',
  PROGRAM_TWOHAND: 'TWOHAND',
  PROGRAM_DUMBLESS: 'DUMBLESS',
}

type FeatureType = (typeof FEATURE_TYPE)[keyof typeof FEATURE_TYPE]

export const FeatureDesc: Record<FeatureType, string> = {
  [FEATURE_TYPE.PROGRAM_STROKER]: '손가락 3개를 모두 파지하고 던집니다.',
  [FEATURE_TYPE.PROGRAM_CRANKER]: '팔꿈치와 손목을 이용해서 던집니다.',
  [FEATURE_TYPE.PROGRAM_TWOHAND]: '엄지를 사용하지 않고 두 손으로 던집니다.',
  [FEATURE_TYPE.PROGRAM_DUMBLESS]: '엄지를 사용하지 않고 한 손으로 던집니다.',
}

// const DEFAULT_LAT = 37.565337
// const DEFAULT_LNG = 126.9772095
export const DEFAULT_LAT = 37.465337
export const DEFAULT_LNG = 126.9992095
export const ZOOM_LEVEL = 7
